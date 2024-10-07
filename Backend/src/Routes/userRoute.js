const express = require('express');
const router = express.Router();
const userController = require('../Controllers/user'); 
const { authenticateToken } = require('../middleware/authenticate');




router.post('/register', userController.createUser);

router.post('/login', userController.loginUser);

router.get('/:id', userController.getUserById);

router.put('/:id',authenticateToken, userController.updateUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;
