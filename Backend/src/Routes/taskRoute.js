const express = require('express');
const router = express.Router();
const taskController = require('../Controllers/task'); 
const { authenticateToken } = require('../middleware/authenticate'); 


router.get('/user/:userId', authenticateToken, taskController.getTasksByUser);

router.get('/project/:projectId', authenticateToken, taskController.getTasksByProjectId);

router.post('/', authenticateToken, taskController.createTask);

router.get('/:taskId', authenticateToken, taskController.getTaskById);

router.put('/:taskId', authenticateToken, taskController.updateTask);

router.delete('/:taskId', authenticateToken, taskController.deleteTask);

module.exports = router;
