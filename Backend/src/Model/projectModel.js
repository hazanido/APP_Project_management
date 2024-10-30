const { db } = require('../../firebase');
const { v4: uuidv4 } = require('uuid'); 

class Project {
    constructor(id, name, description, startDate, endDate, managerId, members = [], tasks = []) {
        if (!id || !name || !managerId) {
            throw new Error('ID, name, and managerId are required fields.');
        }

        this.id = id;
        this.name = name;
        this.description = description;
        this.startDate = startDate || null;  
        this.endDate = endDate || null;      
        this.managerId = managerId;  
        this.members = Array.isArray(members) ? members : [];  
        this.tasks = Array.isArray(tasks) ? tasks : [];        
    }

    static async checkUniqueProjectName(name) {
        try {
            const snapshot = await db.collection('projects').where('name', '==', name).get();
            if (!snapshot.empty) {
                throw new Error('Project name must be unique.');
            }
            console.log('Project name is unique:', name);
        } catch (error) {
            console.error('Error checking project name uniqueness:', error);
            throw error; 
        }
    }
    
    
}

class ProjectModel {
    constructor() {
        this.db = db;
    }

    async createProject(projectData) {
        try {
            await Project.checkUniqueProjectName(projectData.name);
    
            const project = new Project(
                uuidv4(), 
                projectData.name,
                projectData.description,
                projectData.startDate,
                projectData.endDate,
                projectData.managerId,
                projectData.members,
                projectData.tasks
            );
    
            const projectPlainObject = {
                id: project.id,
                name: project.name,
                description: project.description,
                startDate: project.startDate,
                endDate: project.endDate,
                managerId: project.managerId,
                members: project.members,
                tasks: project.tasks
            };
    
            console.log('Saving project to database:', project.name);
            await this.db.collection('projects').doc(project.id).set(projectPlainObject);
            return projectPlainObject;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }
    
    async getProjectsByUser(userId) {
        const snapshot = await this.db.collection('projects').where('managerId', '==', userId).get();
        const projects = [];
        snapshot.forEach(doc => projects.push(doc.data()));
        return projects;
    }

    async getProjectsByUserMember(userEmail) {
        const snapshot = await this.db.collection('projects').where('members', 'array-contains', userEmail).get();
        const projects = [];
        snapshot.forEach(doc => projects.push(doc.data()));
        return projects;
    }
    

    async findProjectById(projectId) {
        if (!projectId) {
            throw new Error('Project ID is required');
        }
        const snapshot = await this.db.collection('projects').doc(projectId).get();
        if (!snapshot.exists) {
            throw new Error('Project not found');
        }
        return snapshot.data();
    }
    

    async updateProject(project) {
        if (!project.id) throw new Error('Project ID is required');  
        await this.db.collection('projects').doc(project.id).update(project);
        return project;
    }

    async deleteProject(projectId) {
        if (!projectId) throw new Error('Project ID is required');  
        await this.db.collection('projects').doc(projectId).delete();
    }

    async addTaskToProject(projectId, taskId) {
        const project = await this.findProjectById(projectId);
        if (!project.tasks.includes(taskId)) {
            project.tasks.push(taskId);
            await this.updateProject(project);
        }
    }
    async getParticipantsByProjectId(projectId) {
        const projectRef = this.db.collection('projects').doc(projectId);
        const projectDoc = await projectRef.get();
    
        if (!projectDoc.exists) {
            throw new Error('Project not found');
        }
    
        const participants = projectDoc.data().members || []; 
        return participants;
    }
    
    
    
}

module.exports = ProjectModel;
