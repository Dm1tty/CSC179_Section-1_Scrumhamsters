// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeAuth, getAuth, createUserWithEmailAndPassword, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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
export const app = initializeApp(firebaseConfig);
// Get Firestore database instance
export const db = getFirestore(app);

// Initialize and get Firebase Auth instance with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
