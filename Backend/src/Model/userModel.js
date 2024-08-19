import firebase from 'firebase';
import bcrypt from 'bcrypt';

class User {
    constructor(id, name, email,password, age = null, tasks = [], projects = [], messages = []) {
        
        if (!id || !name || !email) {
            throw new Error('ID, name, and email are required fields.');
        }

        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.age = age;
        this.tasks = tasks;
        this.projects = projects;
        this.messages = messages;
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
    async getUserById(userId) {
        const user = await this.db.collection('users').doc(userId).get();
        return user.data();
    }
    async createUser(userData) {
        await User.checkUniqueEmail(userData.email);
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = new User(userData.id, userData.name, userData.email,hashedPassword, userData.age, userData.tasks, userData.projects, userData.messages);
        return this.db.collection('users').doc(user.id).set(user);
    }
    async updateUser(user) {
        return this.db.collection('users').doc(user.id).update(user);
    }
}
