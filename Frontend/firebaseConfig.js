import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBkO3se3UD5cZecGJZsEqOOl4FrEdoqKLk",
    authDomain: "project-management-appli-ff008.firebaseapp.com",
    projectId: "project-management-appli-ff008",
    storageBucket: "project-management-appli-ff008.appspot.com",
    messagingSenderId: "485232347458",
    appId: "1:485232347458:android:cc7ce3b6a3d7e8912460db"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;