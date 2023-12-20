const User = require('../models/user');
const { validationResult } = require('express-validator');

const { toUserViewModel } = require('../utils/user');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res
      .status(200)
      .send(users.map((user) => toUserViewModel(user)));
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await Product.findById(userId);
    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).send(toUserViewModel(user));
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'Delete successfully!' });
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};
