const request = require('supertest');
const app = require('../index'); 
const { db } = require('../firebase'); 
const { v4: uuidv4 } = require('uuid'); // מחולל מזהים ייחודיים

let projectId;
let token;
let userId;

const testUser = {
    id: "userTestId",
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
};

// פרויקט בדיקה עם מזהה ייחודי כדי למנוע כפילות שמות
const testProject = {
    name: `Test Project ${uuidv4()}`,
    description: "This is a test project",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    managerId: "userTestId",
    members: ["userTestId"],
    tasks: []
};

// עדכון פרויקט עם מזהה ייחודי ושדות מעודכנים
const updatedProjectData = {
    name: `Updated Project ${uuidv4()}`,
    description: "Updated project description",
    startDate: "2023-02-01",
    endDate: "2023-11-30",
};

beforeAll(async () => {
    // מחיקת המשתמש אם הוא כבר קיים כדי למנוע כפילויות
    await db.collection('users').doc(testUser.id).delete();

    // יצירת משתמש חדש
    await request(app)
        .post('/users/register')
        .send(testUser);

    // התחברות וקבלת טוקן
    const res = await request(app)
        .post('/users/login')
        .send({ email: testUser.email, password: testUser.password });
    
    token = `Bearer ${res.body.token}`;
    userId = testUser.id;
});

afterAll(async () => {
    // ניקוי משתמש ופרויקטים לאחר סיום הבדיקות
    await db.collection('users').doc(testUser.id).delete();

    if (projectId) {
        await db.collection('projects').doc(projectId).delete();
    }
});

describe('Project API Tests', () => {

    test('POST /projects - יצירת פרויקט חדש', async () => {
        const res = await request(app)
            .post('/projects')
            .set('Authorization', token)
            .send(testProject);
    
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Project created successfully');
        expect(res.body.project).toHaveProperty('id');
        
        projectId = res.body.project.id;
        console.log("Created Project ID:", projectId); // הוסף לוג לבדוק את המזהה
    });

    test('GET /projects/:id - שליפת פרויקט לפי מזהה', async () => {
        const res = await request(app)
            .get(`/projects/${projectId}`)
            .set('Authorization', token); 

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', projectId);
        expect(res.body).toHaveProperty('name', testProject.name);
    });

    test('PUT /projects/:id - עדכון פרויקט קיים', async () => {
        const res = await request(app)
            .put(`/projects/${projectId}`)
            .set('Authorization', token) 
            .send(updatedProjectData);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Project updated successfully');

        // בדיקת עדכון הפרויקט
        const updatedRes = await request(app)
            .get(`/projects/${projectId}`)
            .set('Authorization', token);
        
        expect(updatedRes.body).toHaveProperty('name', updatedProjectData.name);
        expect(updatedRes.body).toHaveProperty('description', updatedProjectData.description);
    });

    test('GET /projects/user/:userId - שליפת פרויקטים לפי משתמש', async () => {
        const res = await request(app)
            .get(`/projects/user/${userId}`)
            .set('Authorization', token); 

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.some(project => project.id === projectId)).toBe(true); 
    });

    test('DELETE /projects/:id - מחיקת פרויקט', async () => {
        const res = await request(app)
            .delete(`/projects/${projectId}`)
            .set('Authorization', token); 

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Project deleted successfully');

        // בדיקה שהפרויקט נמחק בהצלחה
        const deletedRes = await request(app)
            .get(`/projects/${projectId}`)
            .set('Authorization', token); 

        expect(deletedRes.statusCode).toBe(404);
    });

});
