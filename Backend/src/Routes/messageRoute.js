const express = require('express');
const router = express.Router();
const messageController = require('../Controllers/message');
const { authenticateToken } = require('../middleware/authenticate');

router.post('/', authenticateToken, messageController.createMessage);

router.get('/:messageId', authenticateToken, messageController.getMessageById);

router.get('/user/:userId', authenticateToken, messageController.getMessagesByUser);

router.put('/:messageId', authenticateToken, messageController.updateMessage);

router.delete('/:messageId', authenticateToken, messageController.deleteMessage);

module.exports = router;
