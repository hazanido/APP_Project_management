const express = require('express');
const router = express.Router();
const userController = require('../Controllers/user'); 
const { authenticateToken } = require('../middleware/authenticate');


router.put('/removeProject', authenticateToken, userController.removeProjectFromUserByEmail);

router.put('/addProject', authenticateToken, userController.addProjectToUserByEmail);

router.post('/register', userController.createUser);

router.post('/login', userController.loginUser);

router.post('/google-login', userController.googleLogin);

router.put('/tasks/assign', authenticateToken, userController.updateTaskAssignment);

router.get('/byEmail/:email', authenticateToken, userController.getUserByEmail);

router.get('/:id', userController.getUserById);

router.put('/:id',authenticateToken, userController.updateUser);

router.delete('/:id', userController.deleteUser);



module.exports = router;
