// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection, addDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDZkxzfu6DwFH57C9VXOyvbudZaUsDLEck",
    authDomain: "mini-hackathone-2025.firebaseapp.com",
    projectId: "mini-hackathone-2025",
    storageBucket: "mini-hackathone-2025.firebasestorage.app",
    messagingSenderId: "1066976037283",
    appId: "1:1066976037283:web:5fe33debb298c538667216",
    measurementId: "G-M88PLEG48D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, analytics, auth, getDocs, collection, addDoc, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged };
