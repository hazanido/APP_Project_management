require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://project-management-appli-ff008.firebaseio.com'
});

const db = admin.firestore();

module.exports = { admin, db };
