const User = require('../models/user');
const { validationResult } = require('express-validator');

const { toUserViewModel } = require('../utils/user');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).send(users.map((user) => toUserViewModel(user)));
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
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

exports.updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userId = req.params.userId;
    const userLoginId = req.userId;
    const userLogin = await User.findById(userLoginId);

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }

    if (userId !== userLoginId && !userLogin.isAdmin) {
      const error = new Error("You don't have permission to update this user.");
      error.statusCode = 403;
      throw error;
    }

    user.email = req.body.email;
    user.name = req.body.name;
    user.phone = req.body.phone;
    user.address = req.body.address;

    await user.save();

    res.status(201).json({
      message: 'Update successfully!',
      user: toUserViewModel(user),
    });
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const userLoginId = req.userId;
    const userLogin = await User.findById(userLoginId);

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }

    if (userId !== userLoginId && !userLogin.isAdmin) {
      const error = new Error("You don't have permission to update this user.");
      error.statusCode = 403;
      throw error;
    }

    if (user.isAdmin) {
      const error = new Error('Could not delete admin.');
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
