const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     description: create user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@test.com
 *               password:
 *                 type: string
 *                 example: kwuwuw
 *               name:
 *                 type: string
 *                 example: lwqwqoe
 *               phone:
 *                 type: string
 *                 example: 7386622
 *               address:
 *                 type: string
 *                 example: ajss wuwe qe
 */
router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password').trim().notEmpty(),
    body('name').trim().notEmpty(),
  ],
  authController.signup
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@test.com
 *               password:
 *                 type: string
 *                 example: wiweewre
 */
router.post('/login', authController.login);

module.exports = router;
