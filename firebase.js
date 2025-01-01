import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBZqIqv-dGwbArRFyFCfk_k9nKJ-ePoHi8",
    authDomain: "first-app-a4921.firebaseapp.com",
    projectId: "first-app-a4921",
    storageBucket: "first-app-a4921.firebasestorage.app",
    messagingSenderId: "287589748424",
    appId: "1:287589748424:web:07322db1f7c51791e51ffd"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword};


