const MessageModel = require('../Model/messageModel');
const UserModel = require('../Model/userModel');
const messageModel = new MessageModel();
const userModel = new UserModel();

const createMessage = async (req, res) => {
    try {
        const { messageSender, messageRecipient, title, message } = req.body;

        if (!messageSender || !messageRecipient || !title || !message) {
            return res.status(400).json({ message: 'Message sender, recipient, title, and message content are required.' });
        }

        // יצירת הודעה חדשה
        const newMessage = await messageModel.createMessage({
            messageSender,
            messageRecipient,
            title,
            message
        });

        // הוספת מזהה ההודעה למשתמש השולח ולמשתמש המקבל
        await userModel.addMessageToUserByEmail(messageSender, newMessage.id);
        await userModel.addMessageToUserByEmail(messageRecipient, newMessage.id);

        res.status(201).json({ message: 'Message created successfully and added to users', messageData: newMessage });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Error creating message', error: error.message });
    }
};

const getMessageById = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await messageModel.findMessageById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json(message);
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ message: 'Error fetching message', error: error.message });
    }
};

const getMessagesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const messageIds = await userModel.getMessagesByUserId(userId);
        if (!messageIds || messageIds.length === 0) {
            return res.status(200).json([]);
        }

        const messages = await Promise.all(
            messageIds.map(async (messageId) => {
                const message = await messageModel.findMessageById(messageId);
                return message ? { id: messageId, title: message.title, sender: message.messageSender } : null;
            })
        );

        const filteredMessages = messages.filter(message => message !== null);

        res.status(200).json(filteredMessages);
    } catch (error) {
        console.error('Error fetching messages by user:', error);
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
};

const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { title, message, messageSender, messageRecipient } = req.body;

        const updatedMessage = {
            id: messageId,
            title,
            message,
            messageSender,
            messageRecipient
        };

        await messageModel.updateMessage(updatedMessage);
        res.status(200).json({ message: 'Message updated successfully' });
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ message: 'Error updating message', error: error.message });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        await messageModel.deleteMessage(messageId);
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Error deleting message', error: error.message });
    }
};

module.exports = {
    createMessage,
    getMessageById,
    getMessagesByUser,
    updateMessage,
    deleteMessage
};
