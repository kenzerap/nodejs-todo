const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const password = req.body.password;
    const hashedPw = await bcrypt.hash(password, 10);

    const user = new User({
      email: req.body.email,
      password: hashedPw,
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    });
    const result = await user.save();

    res
      .status(201)
      .json({ message: 'Create successfully!', userId: result._id.toString() });
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
        name: user.name,
      },
      process.env.SECRET_KEY ? process.env.SECRET_KEY : 'hoangnqjwtsecretkey',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token, userId: user._id.toString() });
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};
