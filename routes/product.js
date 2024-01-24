const express = require('express');
const { body } = require('express-validator');
const Category = require('../models/category');

const productController = require('../controllers/product');

const router = express.Router();

/**
 * @swagger
 * /product/list:
 *   get:
 *     description: get list
 */
router.get('/list', productController.getProducts);

/**
 * @swagger
 * /product/{productId}:
 *   get:
 *     description: get by Id
 */
router.get('/:productId', productController.getProduct);

/**
 * @swagger
 * /product:
 *   post:
 *     description: create
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                type: string
 *                example: Leanne Graham
 *               price:
 *                type: number
 *                example: 1234
 *               imageUrls:
 *                type: string[]
 *                example: [hshshs, heeyw]
 *               description:
 *                type: string
 *                example: jajaja
 *               categoryId:
 *                type: string
 *                example: wwweeer
 */
router.post(
  '',
  [
    body('name').trim().notEmpty(),
    body('categoryId')
      .trim()
      .notEmpty()
      .custom((value, { req }) => {
        return Category.findOne({ _id: value }).then((categoryDoc) => {
          if (!categoryDoc) {
            return Promise.reject('Category not found');
          }
        });
      }),
    body('price').notEmpty().isDecimal(),
  ],
  productController.createProducts
);

/**
 * @swagger
 * /product/{productId}:
 *   put:
 *     description: update
 */
router.put(
  '/:productId',
  [
    body('name').trim().notEmpty(),
    body('categoryId')
      .trim()
      .notEmpty()
      .custom((value, { req }) => {
        return Category.findOne({ _id: value }).then((categoryDoc) => {
          if (!categoryDoc) {
            return Promise.reject('Category not found');
          }
        });
      }),
    body('price').notEmpty().isDecimal(),
  ],
  productController.updateProduct
);

/**
 * @swagger
 * /product/{productId}:
 *   delete:
 *     description: delete
 */
router.delete('/:productId', productController.deleteProduct);

module.exports = router;
