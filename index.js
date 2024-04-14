import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged, 
    signOut } from "firebase/auth";

// Setup dotenv for environment variables
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};


/********************* Firebase setup *********************/

const app = initializeApp(firebaseConfig);
console.log('Firebase initialized with app name:', app.options.projectId);


/********************* Auth related functions *********************/

// Get the auth service for the current app
const auth = getAuth(app);

// Create a new user
const createUser = () => {
    return createUserWithEmailAndPassword(auth, USER_EMAIL, USER_PASSWORD)
}

// Sign in an existing user
const signInUser = async () => {
    return signInWithEmailAndPassword(auth, USER_EMAIL, USER_PASSWORD)
}

// Sign out the current user
const signOutUser = async () => {
    return signOut(auth);
}

// Listen to any change in auth user
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is logged in with email:', user.email);
    } else {
        console.log('Logged out');
    }
});


/********************* Main code *********************/

const USER_EMAIL = 'testuser@test.com';
const USER_PASSWORD = 'testpassword';
let authUser = null;
try {
    authUser = await createUser();
} catch (error) {
    console.log('Error creating user:', error.message);
    authUser = await signInUser();
    console.log('User signed in with uid:', authUser.user.uid);
}
