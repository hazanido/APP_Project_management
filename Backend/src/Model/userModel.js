import firebase from 'firebase';
import bcrypt from 'bcrypt';

class User {
    constructor(id, name, email,password, age = null, taskId = [], projectId = [], messageId = []) {
        
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

    // Function to check if the email is unique
    static async checkUniqueEmail(email) {
        const snapshot = await firebase.firestore().collection('users').where('email', '==', email).get();
        if (!snapshot.empty) {
            throw new Error('Email must be unique.');
        }
    }
}
export default class UserModel {
    constructor() {
        this.firebase = firebase;
        this.db = firebase.firestore();
    }
    async createUser(userData) {
        await User.checkUniqueEmail(userData.email);
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = new User(userData.id, userData.name, userData.email,hashedPassword, userData.age, userData.taskId, userData.projectId, userData.messageId);
        return this.db.collection('users').doc(user.id).set(user);
    }
    async getUserById(userId) {
        const user = await this.db.collection('users').doc(userId).get();
        return user.data();
    }
    async updateUser(user) {
        return this.db.collection('users').doc(user.id).update(user);
    }
    async deleteUser(userId) {
        return this.db.collection('users').doc(userId).delete();
    }

    
}
