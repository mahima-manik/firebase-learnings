import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile,
    signOut } from "firebase/auth";

import { 
    getStorage, 
    ref, 
    uploadBytes, 
    uploadString, 
    getDownloadURL, 
    deleteObject } from "firebase/storage";

import { format } from 'date-fns';
import fs from 'fs';

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
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || null // Set to null if analytics is not enabled
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

const updateDisplayName = async (newDisplayName) => {
    if (!auth.currentUser) {
        console.log('No user is currently signed in.');
        return;
    }
    try {
        await updateProfile(auth.currentUser, { displayName: newDisplayName });
        console.log('Display name updated to:', newDisplayName);
    } catch (error) {
        console.error('Error updating display name:', error.message);
    }
}

/********************* Running auth related code *********************/

const USER_EMAIL = 'testuser@test.com';
const USER_PASSWORD = 'testpassword';
let authUser = null;
try {
    authUser = await createUser();
} catch (error) {
    console.log('Error creating user:', error.message);
    authUser = await signInUser();
} finally {
    await updateDisplayName('New User 2');
    let displayNameAfter = authUser.user.displayName;
    console.log('Display name after:', displayNameAfter);
}

/********************* Storage related functions *********************/
const storage = getStorage(app);
const BUCKET_URL = `gs://${process.env.FIREBASE_STORAGE_BUCKET}`;

const uploadTextData = async (data) => {
    const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    const filePath = `${BUCKET_URL}/data/${authUser.user.uid}/${formattedDate}.txt`;
    
    const fileRef = ref(storage, filePath);
    await uploadString(fileRef, data)
    
    // Returning storage reference for reuse in downloadData
    return fileRef;
}

const downloadTextData = async (fileRef) => {
    const download_url = await getDownloadURL(fileRef)
    const data = await fetch(download_url).then(res => res.text());
    return data;
}

const uploadImageData = async (file) => {
    const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    const filePath = `${BUCKET_URL}/images/${authUser.user.uid}/${formattedDate}.jpg`;
    
    const fileRef = ref(storage, filePath);
    await uploadBytes(fileRef, file)
    
    return fileRef;
}

const downloadImageData = async (fileRef) => {
    const download_url = await getDownloadURL(fileRef)
    const data = await fetch(download_url).then(res => res.blob());
    return data;
}

const deleteFile = async (fileRef) => {
    return deleteObject(fileRef);
}

/********************* Running storage related code *********************/

// Upload text data and download it back
const fileRef = await uploadTextData('Hello World');
const dataString = await downloadTextData(fileRef);
console.log(`\nData at ${fileRef.name} is: ${dataString} \n\n`);


// Upload image data and download it back
const imageFile = fs.readFileSync('test.jpg');
const imageRef = await uploadImageData(imageFile);

const imageBlob = await downloadImageData(imageRef);

// Convert the image blob to buffer and save it as a file
const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
fs.writeFileSync('downloaded_image.jpg', imageBuffer);
console.log(`Image at ${imageRef.name} downloaded and saved as downloaded_image.jpg`);

// Optional: Delete the uploaded files
// await deleteFile(fileRef);
// await deleteFile(imageRef);
