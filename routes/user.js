const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

/**
 * @swagger
 * /user/list:
 *   get:
 *     description: get list
 */
router.get('/list', isAuth, userController.getUsers);

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     description: get by Id
 */
router.get('/:userId', isAuth, userController.getUser);

/**
 * @swagger
 * /user/{userId}:
 *   delete:
 *     description: delete
 */
router.delete('/:userId', isAuth, userController.deleteUser);

module.exports = router;
