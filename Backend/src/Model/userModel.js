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
            
            if (user.password) {
                
                const hashedPassword = await bcrypt.hash(user.password, 10);
                user.password = hashedPassword;
            }
    
            
            return this.db.collection('users').doc(user.id).update(user);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }
    

    async deleteUser(userId) {
        return this.db.collection('users').doc(userId).delete();
    }
}

module.exports = UserModel;
