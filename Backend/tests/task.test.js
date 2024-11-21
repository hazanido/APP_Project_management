const request = require('supertest');
const app = require('../index'); 
const { db } = require('../firebase');
const { v4: uuidv4 } = require('uuid');

let projectId;
let taskId;
let token;
let userId;

const testUser = {
    id: "testUserId",
    name: "Test User",
    email: "testuser@example.com",
    password: "password123"
};

const taskPersonEmail = "taskperson@example.com"; 
const testProject = {
    name: `Test Project ${uuidv4()}`,
    description: "Test project description",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    managerId: testUser.id,
    members: [testUser.id],
    tasks: []
};

const testTask = {
    name: `Test Task ${uuidv4()}`,
    description: "Test task description",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    taskPersonId: taskPersonEmail, 
    status: "in-progress"
};


beforeAll(async () => {
    
    await db.collection('users').doc(testUser.id).delete();

    
    await request(app).post('/users/register').send(testUser);

    const res = await request(app).post('/users/login').send({ email: testUser.email, password: testUser.password });
    token = `Bearer ${res.body.token}`;
    userId = testUser.id;

    
    await request(app).post('/users/register').send({
        id: "taskPersonId",
        name: "Task Person",
        email: taskPersonEmail,
        password: "password123"
    });
});

afterAll(async () => {
    if (taskId) {
        await db.collection('tasks').doc(taskId).delete();
    }
    if (projectId) {
        await db.collection('projects').doc(projectId).delete();
    }
    await db.collection('users').doc(testUser.id).delete();
});
describe('Task API Tests', () => {
    test('POST /tasks - יצירת משימה חדשה', async () => {
        
        const projectRes = await request(app)
            .post('/projects')
            .set('Authorization', token)
            .send(testProject);

        expect(projectRes.statusCode).toBe(201);
        projectId = projectRes.body.project.id;

        // יצירת משימה בפרויקט
        const taskRes = await request(app)
            .post('/tasks')
            .set('Authorization', token)
            .send({ ...testTask, projectId });

        expect(taskRes.statusCode).toBe(201);
        expect(taskRes.body).toHaveProperty('message', 'Task created and added to project and user successfully');
        expect(taskRes.body.task).toHaveProperty('id');
        taskId = taskRes.body.task.id;
    });

    test('GET /tasks/:taskId - קבלת משימה לפי ID', async () => {
        const res = await request(app)
            .get(`/tasks/${taskId}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', taskId);
        expect(res.body).toHaveProperty('name', testTask.name);
    });

    test('GET /tasks/project/:projectId - קבלת משימות לפי פרויקט', async () => {
        const res = await request(app)
            .get(`/tasks/project/${projectId}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.some(task => task.id === taskId)).toBe(true);
    });

    test('PUT /tasks/:taskId - עדכון משימה', async () => {
        const updatedTaskData = {
            name: 'Updated Task Name',
            description: 'Updated Task Description',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            taskPersonId: taskPersonEmail, 
            status: 'completed'
        };

        const res = await request(app)
            .put(`/tasks/${taskId}`)
            .set('Authorization', token)
            .send(updatedTaskData);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Task updated successfully');
    });

    test('DELETE /tasks/:taskId - מחיקת משימה', async () => {
        const res = await request(app)
            .delete(`/tasks/${taskId}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Task deleted successfully');
    });
});
