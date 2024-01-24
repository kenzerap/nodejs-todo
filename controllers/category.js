const Category = require('../models/category');
const { validationResult } = require('express-validator');

const { toCategoryViewModel } = require('../utils/category');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res
      .status(200)
      .send(categories.map((category) => toCategoryViewModel(category)));
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).send(toCategoryViewModel(category));
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const category = new Category({
      name: req.body.name,
      code: req.body.code,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
    });

    await category.save();

    res.status(201).json({
      message: 'Create successfully!',
      category: toCategoryViewModel(category),
    });
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }

    category.name = req.body.name;
    category.code = req.body.code;
    category.imageUrl = req.body.imageUrl;
    category.description = req.body.description;

    await category.save();

    res.status(201).json({
      message: 'Update successfully!',
      product: toCategoryViewModel(category),
    });
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId);
    if (!category) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }

    await Category.findByIdAndDelete(categoryId);
    res.status(200).json({ message: 'Delete successfully!' });
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};
