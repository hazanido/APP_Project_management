const request = require('supertest');
const app = require('../index'); 
const UserModel = require('../src/Model/userModel'); 
const { db } = require('../firebase'); 

let userId; 
let token;

const testUser = {
    id: "1",
    name: "Test User",
    email: "testuser@gmail.com",
    password: "123456",
    age: 25,
};

const updatedUserData = {
    name: "Updated User",
    email: "updateduser@gmail.com",
    age: 30
};

beforeAll(async () => {
    await db.collection('users').doc(testUser.id).delete();
});

afterAll(async () => {
    await db.collection('users').doc(testUser.id).delete();
});

describe('User API Tests', () => {

    test('POST /users - should create a new user', async () => {
        const res = await request(app)
            .post('/users/register')
            .send(testUser);
        
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'User created successfully');
    

        const getUserRes = await request(app)
            .get(`/users/${testUser.id}`);
        
        expect(getUserRes.statusCode).toBe(200);
        expect(getUserRes.body).toHaveProperty('id', testUser.id);
    
        userId = testUser.id; 
    });
    
    test('POST /users/login - should login and return a token', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({ email: testUser.email, password: testUser.password });
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token'); 
        token = res.body.token; 
    });

    test('GET /users/:id - should get a user by id', async () => {
        const res = await request(app)
            .get(`/users/${userId}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', userId);
        expect(res.body).toHaveProperty('email', testUser.email);
    });

    test('PUT /users/:id - should update an existing user', async () => {
        const res = await request(app)
            .put(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`) 
            .send(updatedUserData);
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'User updated successfully');

        const updatedRes = await request(app)
            .get(`/users/${userId}`);
        expect(updatedRes.body).toHaveProperty('name', updatedUserData.name);
        expect(updatedRes.body).toHaveProperty('email', updatedUserData.email);
    });

    test('DELETE /users/:id - should delete a user', async () => {
        const res = await request(app)
            .delete(`/users/${userId}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'User deleted successfully');

        const deletedRes = await request(app)
            .get(`/users/${userId}`);
        expect(deletedRes.statusCode).toBe(404);
    });

});
