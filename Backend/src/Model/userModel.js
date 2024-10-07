const { db } = require('../../firebase'); 
const bcrypt = require('bcryptjs');

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
        this.taskId = taskId;
        this.projectId = projectId;
        this.messageId = messageId;
    }

    
    static async checkUniqueEmail(email) {
        try {
            const snapshot = await db.collection('users').where('email', '==', email).get();
            if (!snapshot.empty) {
                throw new Error('Email must be unique.');
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
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const user = new User(
                userData.id,
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



    async getUserById(userId) {
        const user = await this.db.collection('users').doc(userId).get();
        return user.exists ? user.data() : null;
    }

    async updateUser(user) {
        return this.db.collection('users').doc(user.id).update(user);
    }

    async deleteUser(userId) {
        return this.db.collection('users').doc(userId).delete();
    }
}

module.exports = UserModel;
