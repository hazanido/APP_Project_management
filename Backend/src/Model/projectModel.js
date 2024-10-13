class projectId {
    constructor(id, name, description, userId, taskId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.userId = userId;
        this.taskId = taskId.length ? taskId : [];
    }
}

class projectModel {
    constructor() {
        this.db = db;
    }

    async createProject(projectData) {
        try {
            const projectId = projectData.id || uuidv4();

            const project = new projectId(
                projectId,
                projectData.name,
                projectData.description,
                projectData.userId,
                projectData.taskId
            );

            const projectPlainObject = {
                id: project.id,
                name: project.name,
                description: project.description,
                userId: project.userId,
                taskId: project.taskId
            };

            await this.db.collection('projects').doc(projectId).set(projectPlainObject);

            return projectPlainObject;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }

    async getProjectById(projectId) {
        try {
            const project = await this.db.collection('projects').doc(projectId).get();
            return project.data();
        } catch (error) {
            console.error('Error fetching project by ID:', error);
            throw error;
        }
    }

    async updateProject(projectData) {
        try {
            const projectId = projectData.id;

            const project = new projectId(
                projectId,
                projectData.name,
                projectData.description,
                projectData.userId,
                projectData.taskId
            );

            const projectPlainObject = {
                id: project.id,
                name: project.name,
                description: project.description,
                userId: project.userId,
                taskId: project.taskId
            };

            await this.db.collection('projects').doc(projectId).set(projectPlainObject);

            return projectPlainObject;
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    }

    async deleteProject(projectId) {
        try {
            await this.db.collection('projects').doc(projectId).delete();
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    }
}