const { db } = require('../../firebase');
const { v4: uuidv4 } = require('uuid');

class Message {
    constructor(id, messageSender, messageRecipient, title, message) {
        if (!id || !messageSender || !messageRecipient || !title || !message) {
            throw new Error('ID, message sender, message recipient, title, and message are required fields.');
        }

        this.id = id;
        this.messageSender = messageSender;
        this.messageRecipient = messageRecipient;
        this.title = title;
        this.message = message;
    }
}

class MessageModel {
    constructor() {
        this.db = db;
    }

    async createMessage(messageData) {
        try {
            const message = new Message(
                uuidv4(),
                messageData.messageSender,
                messageData.messageRecipient,
                messageData.title,
                messageData.message
            );

            const messagePlainObject = {
                id: message.id,
                messageSender: message.messageSender,
                messageRecipient: message.messageRecipient,
                title: message.title,
                message: message.message
            };

            await this.db.collection('messages').doc(message.id).set(messagePlainObject);

            return messagePlainObject;
        } catch (error) {
            console.error('Error creating message:', error);
            throw error;
        }
    }

    async getMessagesByRecipient(recipientId) {
        if (!recipientId) {
            throw new Error('Recipient ID is required');
        }

        const snapshot = await this.db.collection('messages').where('messageRecipient', '==', recipientId).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async findMessageById(messageId) {
        if (!messageId) {
            throw new Error('Message ID is required');
        }

        const snapshot = await this.db.collection('messages').doc(messageId).get();
        if (!snapshot.exists) {
            throw new Error('Message not found');
        }

        return { id: messageId, ...snapshot.data() };
    }

    async updateMessage(message) {
        if (!message.id) throw new Error('Message ID is required');

        const updateData = {};
        if (message.title !== undefined) updateData.title = message.title;
        if (message.message !== undefined) updateData.message = message.message;
        if (message.messageSender !== undefined) updateData.messageSender = message.messageSender;
        if (message.messageRecipient !== undefined) updateData.messageRecipient = message.messageRecipient;

        await this.db.collection('messages').doc(message.id).update(updateData);

        return message;
    }

    async deleteMessage(messageId) {
        if (!messageId) throw new Error('Message ID is required');

        await this.db.collection('messages').doc(messageId).delete();
    }
}

module.exports = MessageModel;
