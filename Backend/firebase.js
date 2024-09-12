const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase-service-account.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<your-project-id>.firebaseio.com'
});

const db = admin.firestore();

module.exports = { admin, db };
