const express = require('express');
const router = express.Router();
const projectController = require('../Controllers/project'); 
const { authenticateToken } = require('../middleware/authenticate'); 


router.post('/', authenticateToken, projectController.createProject);


router.get('/:id', authenticateToken, projectController.getProjectById);


router.put('/:id', authenticateToken, projectController.updateProject);


router.delete('/:id', authenticateToken, projectController.deleteProject);


router.get('/user/:userId', authenticateToken, projectController.getProjectsByUser);

module.exports = router;
