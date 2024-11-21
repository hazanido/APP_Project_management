const request = require('supertest');
const app = require('../index'); 
const { db } = require('../firebase');
const { v4: uuidv4 } = require('uuid');

let messageId;
let token;
let userId;

const testSender = {
    id: "testSenderId",
    name: "Sender User",
    email: "sender@example.com",
    password: "password123"
};

const testRecipient = {
    id: "testRecipientId",
    name: "Recipient User",
    email: "recipient@example.com",
    password: "password123"
};

const testMessage = {
    messageSender: testSender.email,
    messageRecipient: testRecipient.email,
    title: `Test Message ${uuidv4()}`,
    message: "This is a test message."
};

const updatedMessageData = {
    title: `Updated Message ${uuidv4()}`,
    message: "This is an updated test message."
};
beforeAll(async () => {
   
    await db.collection('users').doc(testSender.id).delete();
    await db.collection('users').doc(testRecipient.id).delete();

   
    await request(app).post('/users/register').send(testSender);
    await request(app).post('/users/register').send(testRecipient);

    const res = await request(app)
        .post('/users/login')
        .send({ email: testSender.email, password: testSender.password });

    token = `Bearer ${res.body.token}`;
    userId = testSender.id;
});

afterAll(async () => {
    if (messageId) {
        await db.collection('messages').doc(messageId).delete();
    }
    await db.collection('users').doc(testSender.id).delete();
    await db.collection('users').doc(testRecipient.id).delete();
});
describe('Message API Tests', () => {
    test('POST /messages - יצירת הודעה חדשה', async () => {
        const res = await request(app)
            .post('/messages')
            .set('Authorization', token)
            .send(testMessage);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Message created successfully and added to users');
        expect(res.body.messageData).toHaveProperty('id');
        messageId = res.body.messageData.id;
    });

    test('GET /messages/:messageId - קבלת הודעה לפי ID', async () => {
        const res = await request(app)
            .get(`/messages/${messageId}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', messageId);
        expect(res.body).toHaveProperty('title', testMessage.title);
        expect(res.body).toHaveProperty('message', testMessage.message);
    });

    test('GET /messages/user/:userId - קבלת הודעות לפי משתמש', async () => {
        const res = await request(app)
            .get(`/messages/user/${userId}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.some(message => message.id === messageId)).toBe(true);
    });

    test('PUT /messages/:messageId - עדכון הודעה', async () => {
        const res = await request(app)
            .put(`/messages/${messageId}`)
            .set('Authorization', token)
            .send(updatedMessageData);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Message updated successfully');
    });

    test('DELETE /messages/:messageId - מחיקת הודעה', async () => {
        const res = await request(app)
            .delete(`/messages/${messageId}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Message deleted successfully');
    });
});
