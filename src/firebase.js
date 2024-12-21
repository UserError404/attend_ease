import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBA99whE5UP7JsbdHOUbJX9KSFmu21xjbs",
  authDomain: "attendease-aab43.firebaseapp.com",
  projectId: "attendease-aab43",
  storageBucket: "attendease-aab43.appspot.com",
  messagingSenderId: "426090215191",
  appId: "1:426090215191:web:990e8f8d84d7fad1a6a952"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// Function to get the current user's UID
const getCurrentUserUID = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user.uid); // Return the UID if a user is signed in
      } else {
        reject("No user is signed in");
      }
    });
  });
};

export { app, auth, db, getCurrentUserUID };