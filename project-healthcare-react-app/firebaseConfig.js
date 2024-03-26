// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDA0kndqrrBEw6wZ_5W0dpvgUWsN-YByw",
  authDomain: "healthcare-d201f.firebaseapp.com",
  projectId: "healthcare-d201f",
  storageBucket: "healthcare-d201f.appspot.com",
  messagingSenderId: "680713397401",
  appId: "1:680713397401:web:dc6740d67617dd6b5d0408"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Get Firestore database instance
export const db = getFirestore(app);