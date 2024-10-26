const express = require('express');
const router = express.Router();
const projectController = require('../Controllers/project'); 
const { authenticateToken } = require('../middleware/authenticate'); 


router.post('/', authenticateToken, projectController.createProject);

router.put('/:projectId/removeParticipant', authenticateToken, projectController.removeParticipantFromProject);

router.get('/:projectId', authenticateToken, projectController.getProjectById);

router.put('/:projectId', authenticateToken, projectController.updateProject);

router.delete('/:id', authenticateToken, projectController.deleteProject);

router.get('/user/:userId', authenticateToken, projectController.getProjectsByUser);

router.put('/:projectId/addParticipant', authenticateToken, projectController.addParticipantByEmail);

module.exports = router;
