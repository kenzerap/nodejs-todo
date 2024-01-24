const express = require('express');
const { body } = require('express-validator');
const Category = require('../models/category');

const categoryController = require('../controllers/category');

const router = express.Router();

/**
 * @swagger
 * /category/list:
 *   get:
 *     description: get list
 */
router.get('/list', categoryController.getCategories);

/**
 * @swagger
 * /category/{categoryId}:
 *   get:
 *     description: get by Id
 */
router.get('/:categoryId', categoryController.getCategory);

/**
 * @swagger
 * /category:
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
 *               code:
 *                type: string
 *                example: Leanne
 *               imageUrl:
 *                type: string
 *                example: hshshs
 *               description:
 *                type: string
 *                example: sssw
 */
router.post(
  '',
  [
    body('name').trim().notEmpty(),
    body('code')
      .trim()
      .notEmpty()
      .custom((value, { req }) => {
        return Category.findOne({ code: value }).then((categoryDoc) => {
          if (categoryDoc) {
            return Promise.reject('Category already exists!');
          }
        });
      }),
    body('imageUrl').trim().notEmpty(),
  ],
  categoryController.createCategory
);

/**
 * @swagger
 * /category/{categoryId}:
 *   put:
 *     description: update
 */
router.put(
  '/:categoryId',
  [
    body('name').trim().notEmpty(),
    body('code').trim().notEmpty(),
    body('imageUrl').trim().notEmpty(),
  ],
  categoryController.updateCategory
);

/**
 * @swagger
 * /category/{categoryId}:
 *   delete:
 *     description: delete
 */
router.delete('/:categoryId', categoryController.deleteCategory);

module.exports = router;
