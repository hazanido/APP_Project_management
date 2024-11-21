const request = require('supertest');
const app = require('../index'); 
const { db } = require('../firebase');
const { v4: uuidv4 } = require('uuid');

let projectId;
let token;
let userId;

const testUser = {
    id: "testUserId",
    name: "Test User",
    email: "testuser@example.com",
    password: "password123"
};

const testProject = {
    name: `Test Project ${uuidv4()}`,
    description: "Test project description",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    managerId: "testUserId",
    members: ["testUserId"],
    tasks: []
};

const updatedProjectData = {
    name: `Updated Project ${uuidv4()}`,
    description: "Updated project description",
    startDate: "2023-02-01",
    endDate: "2023-11-30"
};


beforeAll(async () => {
    await db.collection('users').doc(testUser.id).delete();

    await request(app)
        .post('/users/register')
        .send(testUser);

    const res = await request(app)
        .post('/users/login')
        .send({ email: testUser.email, password: testUser.password });

    token = `Bearer ${res.body.token}`;
    userId = testUser.id;
});

afterAll(async () => {
    await db.collection('users').doc(testUser.id).delete();
    if (projectId) {
        await db.collection('projects').doc(projectId).delete();
    }
});

describe('Project API Tests', () => {

    test('POST /projects ', async () => {
        const res = await request(app)
            .post('/projects')
            .set('Authorization', token)
            .send(testProject);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Project created successfully');
        expect(res.body.project).toHaveProperty('id');

        projectId = res.body.project.id;
    });

    test('GET /projects/:id ', async () => {
        const res = await request(app)
            .get(`/projects/${projectId}`) 
            .set('Authorization', token);
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', projectId);
        expect(res.body).toHaveProperty('name', testProject.name);
    });
    
    

    test('PUT /projects/:id ', async () => {
        const updatedProjectData = {
            name: 'Updated Project Name',
            description: 'Updated Description',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            managerId: 'testUserId',
            members: [],
            tasks: []
        };
    
        const res = await request(app)
            .put(`/projects/${projectId}`) 
            .set('Authorization', token)
            .send(updatedProjectData);
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Project updated successfully');
    });
    

    test('GET /projects/user/:userId ', async () => {
        const res = await request(app)
            .get(`/projects/user/${userId}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.some(project => project.id === projectId)).toBe(true);
    });

 
    
});
