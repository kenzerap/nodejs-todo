const express = require('express');
const { body } = require('express-validator');

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
 *               imageUrl:
 *                type: string
 *                example: hshshs
 *               description:
 *                type: string
 *                example: jajaja
 */
router.post(
  '',
  [
    body('name').trim().notEmpty(),
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
  [body('name').trim().notEmpty(), body('price').notEmpty().isDecimal()],
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
