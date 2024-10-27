const request = require('supertest');
const app = require('../index');
const { db } = require('../firebase');
const { v4: uuidv4 } = require('uuid');

let taskId;
let projectId;
let token;
let userId;

const testUser = {
    id: "testUserId",
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
    // taskId: "[]",
    // projectId: "[]",
    // messageId: "[]",
};


const testProject = {
    id: uuidv4(),
    name: `Test Project ${uuidv4()}`,
    description: "Test project description",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    managerId: "testUserId",
    members: ["testUserId"],
    tasks: []
};

const testTask = {
    name: `Test Task ${uuidv4()}`,
    description: "Task description",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    projectId: testProject.id,
    taskPersonId: "testUserId"
};

beforeAll(async () => {
    await db.collection('users').doc(testUser.id).delete();
    await db.collection('projects').doc(testProject.id).delete();

    await request(app)
        .post('/users/register')
        .send(testUser);

    const res = await request(app)
        .post('/users/login')
        .send({ email: testUser.email, password: testUser.password });

    token = `Bearer ${res.body.token}`;
    userId = testUser.id;

    const projectRes = await request(app)
    .post('/projects')
    .set('Authorization', token)
    .send(testProject);

    projectId = projectRes.body.project.id;
    console.log("Generated projectId:", projectId); 
});

afterAll(async () => {
    await db.collection('users').doc(testUser.id).delete();
    if (projectId) {
        await db.collection('projects').doc(projectId).delete();
    }
    if (taskId) {
        await db.collection('tasks').doc(taskId).delete();
    }
});

describe('Task API Tests', () => {

    test('POST /tasks - Create Task', async () => {
        const res = await request(app)
            .post('/tasks')
            .set('Authorization', token)
            .send({ ...testTask, projectId });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Task created and added to project and user successfully');
        expect(res.body.task).toHaveProperty('id');

        taskId = res.body.task.id;
    });

    test('GET /tasks/:taskId - Get Task by ID', async () => {
        const res = await request(app)
            .get(`/tasks/${taskId}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', taskId);
        expect(res.body).toHaveProperty('name', testTask.name);
    });

    test('PUT /tasks/:taskId - Update Task', async () => {
        const updatedTaskData = {
            name: 'Updated Task Name',
            description: 'Updated Description',
            startDate: '2024-01-01',
            endDate: '2024-12-31'
        };

        const res = await request(app)
            .put(`/tasks/${taskId}`)
            .set('Authorization', token)
            .send(updatedTaskData);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Task updated successfully');
    });

    // test('GET /tasks/project/:projectId - Get Tasks by Project ID', async () => {
    //     console.log("Project ID in test:", projectId); 
    //     await new Promise(resolve => setTimeout(resolve, 500));

    //     const res = await request(app)
    //         .get(`/tasks/project/${projectId}`)
    //         .set('Authorization', token);
    
    //     expect(res.statusCode).toBe(200);
    //     expect(res.body).toBeInstanceOf(Array);
    //     expect(res.body.some(task => task.id === taskId)).toBe(true);
    // });
    

    test('DELETE /tasks/:taskId - Delete Task', async () => {
        const res = await request(app)
            .delete(`/tasks/${taskId}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Task deleted successfully');
    });
});
