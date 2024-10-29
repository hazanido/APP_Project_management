const { db } = require('../../firebase');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');  

class User {
    constructor(id, name, email, password, age = null, taskId = [], projectId = [], messageId = []) {
        if (!id || !name || !email) {
            throw new Error('ID, name, and email are required fields.');
        }

        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.age = age;
        this.taskId = taskId.length ? taskId : [];  
        this.projectId = projectId.length ? projectId : [];
        this.messageId = messageId.length ? messageId : [];
    }

    static async checkUniqueEmail(email) {
        try {
            const snapshot = await db.collection('users').where('email', '==', email).get();
            if (!snapshot.empty) {
                throw new Error('Email already exists.');
            }
        } catch (error) {
            console.error('Error checking email uniqueness:', error);
            throw error;
        }
    }
}

class UserModel {
    constructor() {
        this.db = db;
    }

    async createUser(userData) {
        try {
            await User.checkUniqueEmail(userData.email);

            
            const userId = userData.id || uuidv4();

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const user = new User(
                userId,
                userData.name,
                userData.email,
                hashedPassword,
                userData.age,
                userData.taskId,
                userData.projectId,
                userData.messageId
            );

            const userPlainObject = {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                age: user.age,
                taskId: user.taskId,
                projectId: user.projectId,
                messageId: user.messageId
            };

            console.log('Saving user to database:', user.email);
            return this.db.collection('users').doc(user.id).set(userPlainObject);

        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async findUserByEmail(email) {
        const snapshot = await this.db.collection('users').where('email', '==', email).get();
        if (snapshot.empty) {
            return null;
        }
        return snapshot.docs[0].data();
    }

    async verifyPassword(enteredPassword, storedPassword) {
        return bcrypt.compare(enteredPassword, storedPassword);
    }

    async getUserById(userId) {
        const user = await this.db.collection('users').doc(userId).get();
        return user.exists ? user.data() : null;
    }


    async updateUser(user) {
        try {
            
            if (user.password && !user.isProjectUpdate) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                user.password = hashedPassword;
            }
    
            
            return this.db.collection('users').doc(user.id).update(user);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }
    async addProjectToUser(userId, projectId) {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (!Array.isArray(user.projectId)) {
            user.projectId = []; 
        }
        user.projectId.push(projectId);
        user.isProjectUpdate = true;
        return this.updateUser(user);
    }
    async addProjectToUserByEmail(email, projectId) {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        if (!Array.isArray(user.projectId)) {
            user.projectId = []; 
        }
        user.projectId.push(projectId);
        user.isProjectUpdate = true;
        return this.updateUser(user);
    }

    async deleteUser(userId) {
        return this.db.collection('users').doc(userId).delete();
    }

    async addTaskToUser(userId, taskId) {
        const user = await this.db.collection('users').doc(userId).get();
        if (!user.exists) throw new Error('User not found');
    
        const userData = user.data();
        if (!userData.taskId) userData.taskId = [];
        if (!userData.taskId.includes(taskId)) {
            userData.taskId.push(taskId);
            await this.db.collection('users').doc(userId).update({ taskId: userData.taskId });
        }
        return userData.taskId;
    }
    
    async addTaskToUserByEmail(email, taskId) {
        const userSnapshot = await this.db.collection('users').where('email', '==', email).limit(1).get();
        if (userSnapshot.empty) {
            throw new Error('User not found');
        }
        const userDoc = userSnapshot.docs[0];
        const userId = userDoc.id;
        const userData = userDoc.data();
    
        if (!userData.taskId) userData.taskId = []; 
        if (!userData.taskId.includes(taskId)) {
            userData.taskId.push(taskId);
            await this.db.collection('users').doc(userId).update({ taskId: userData.taskId });
        }
        return userData.taskId;
    }

    async getTasksByUserId(userId) {
        const user = await this.db.collection('users').doc(userId).get();
        if (!user.exists) {
            throw new Error('User not found');
        }
        const userData = user.data();
        if (!userData.taskId) {
            return [];
        }
        return userData.taskId;
    }
    
    async addMessageToUserByEmail(email, messageId) {
        const user = await this.findUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        user.messageId.push(messageId);
        await this.updateUser(user);
    }

    async getMessagesByUserId(userId) {
        const user = await this.getUserById(userId);
        if (!user || !user.messageId) {
            return [];
        }
        return user.messageId;
    }
    
    
    
}

module.exports = UserModel;
