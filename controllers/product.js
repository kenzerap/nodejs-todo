const Product = require('../models/product');
const Category = require('../models/category');
const { validationResult } = require('express-validator');

const { toProductViewModel } = require('../utils/product');
const category = require('../models/category');

exports.getProducts = async (req, res, next) => {
  try {
    const {
      searchBy,
      search,
      orderBy,
      orderByDirection,
      page,
      itemPerPage,
      categoryCode,
    } = req.query;

    const categoryByCode = await Category.findOne({ code: categoryCode });

    const queries = {
      page: page || 1,
      itemPerPage: itemPerPage || 50,
      searchBy: searchBy || 'name',
      search: search || '',
      orderBy: orderBy || 'name',
      orderByDirection: orderByDirection === 'desc' ? -1 : 1,
    };

    const filter = {
      $or: (!Array.isArray(queries.searchBy)
        ? [queries.searchBy]
        : queries.searchBy
      ).map((key) => ({
        [key]: { $regex: queries.search, $options: 'i' },
      })),
      [categoryByCode ? 'categoryId' : undefined]: categoryByCode?._id,
    };

    const totalItem = await Product.find({ ...filter }).countDocuments();
    const products = await Product.find({ ...filter })
      .skip((queries.page - 1) * queries.itemPerPage)
      .limit(queries.itemPerPage)
      .sort({ [queries.orderBy]: queries.orderByDirection })
      .populate('categoryId');

    res.status(200).send({
      data: products.map((product) => toProductViewModel(product)),
      totalItem,
      hasNextPage: queries.page * queries.itemPerPage < totalItem,
    });
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
      soldCount: req.body.soldCount,
      discountPercentage: req.body.discountPercentage,
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

exports.importProducts = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    // get list category
    const categories = await Category.find();

    const productList = req.body;
    // insert multiple products
    for (const productData of productList.products) {
      const category = categories.find(
        (category) => category.code === productData.category
      );
      if (category) {
        await Product.updateOne(
          { name: productData.name },
          {
            $set: {
              price: productData.price,
              imageUrls: productData.imageUrls,
              description: productData.description,
              categoryId: category._id,
              soldCount: productData.soldCount,
              discountPercentage: productData.discountPercentage,
            },
          },
          { upsert: true } // Insert the product if it does not exist
        );
      }
    }

    res.status(201).json({
      message: 'Import successfully!',
      product: productList.products.map((product) =>
        toProductViewModel(product)
      ),
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
    product.categoryId = req.body.categoryId;
    product.soldCount = req.body.soldCount;
    product.discountPercentage = req.body.discountPercentage;

    await product.save();
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
