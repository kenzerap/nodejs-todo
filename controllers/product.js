const Product = require('../models/product');
const { validationResult } = require('express-validator');

const { toProductViewModel } = require('../utils/product');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('categoryId');
    res
      .status(200)
      .send(products.map((product) => toProductViewModel(product)));
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId).populate('categoryId');
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).send(toProductViewModel(product));
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};

exports.createProducts = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      imageUrls: req.body.imageUrls,
      description: req.body.description,
      categoryId: req.body.categoryId,
    });

    await product.save();

    res.status(201).json({
      message: 'Create successfully!',
      product: toProductViewModel(product),
    });
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }

    product.name = req.body.name;
    product.price = req.body.price;
    product.imageUrls = req.body.imageUrls;
    product.description = req.body.description;
    (product.categoryId = req.body.categoryId), await product.save();

    res.status(201).json({
      message: 'Update successfully!',
      product: toProductViewModel(product),
    });
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }

    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Delete successfully!' });
  } catch (error) {
    error.statusCode = !error.statusCode ? 500 : !error.statusCode;
    next(error);
  }
};
