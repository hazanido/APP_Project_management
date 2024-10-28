const { db } = require('../../firebase');
const { v4: uuidv4 } = require('uuid');

class Task {
    constructor(id, projectId, name, description, startDate, endDate, taskPersonId) {
        if (!id || !projectId || !name || !taskPersonId) {
            throw new Error('ID, Project ID, Task Name, and Task Person ID are required fields.');
        }

        this.id = id;
        this.projectId = projectId;
        this.name = name;
        this.description = description || ''; 
        this.startDate = startDate || null;
        this.endDate = endDate || null;
        this.taskPersonId = taskPersonId;
    }
}

class TaskModel {
    constructor() {
        this.db = db;
    }

    async createTask(taskData) {
        try {
            const task = new Task(
                uuidv4(),
                taskData.projectId,
                taskData.name,
                taskData.description,
                taskData.startDate,
                taskData.endDate,
                taskData.taskPersonId
            );

            const taskPlainObject = {
                id: task.id,
                projectId: task.projectId,
                name: task.name,
                description: task.description,
                startDate: task.startDate,
                endDate: task.endDate,
                taskPersonId: task.taskPersonId
            };
            console.log('Saving task with projectId:', taskPlainObject.projectId);

            console.log('Saving task to database:', task.name);
            await this.db.collection('tasks').doc(task.id).set(taskPlainObject);
            
            return taskPlainObject;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    async getTasksByProjectId(projectId) {
        if (!projectId) {
            throw new Error('Project ID is required');
        }
    
        const snapshot = await this.db.collection('tasks').where('projectId', '==', projectId).get();
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return tasks;
    }
    
    

    async findTaskById(taskId) {
        if (!taskId) {
            throw new Error('Task ID is required');
        }
    
        const snapshot = await this.db.collection('tasks').doc(taskId).get();
        if (!snapshot.exists) {
            throw new Error('Task not found');
        }
    
        return { id: taskId, ...snapshot.data() }; 
    }
    

    async updateTask(task) {
        if (!task.id) throw new Error('Task ID is required');
    
        const updateData = {};
    
        if (task.name !== undefined) updateData.name = task.name;
        if (task.description !== undefined) updateData.description = task.description;
        if (task.startDate !== undefined) updateData.startDate = task.startDate;
        if (task.endDate !== undefined) updateData.endDate = task.endDate;
        if (task.taskPersonId !== undefined) updateData.taskPersonId = task.taskPersonId;
    
        await this.db.collection('tasks').doc(task.id).update(updateData);
    
        return task;
    }
    

    async deleteTask(taskId) {
        if (!taskId) throw new Error('Task ID is required');
        
        await this.db.collection('tasks').doc(taskId).delete();
    }

    async getTasksByUserId(userId) {
        if (!userId) throw new Error('User ID is required');

        const tasksSnapshot = await this.db.collection('tasks').where('taskPersonId', '==', userId).get();
        if (tasksSnapshot.empty) {
            return null;
        }

        return tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
   
    
}

module.exports = TaskModel;
