// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjVImxCt3SaIdVu2fWSe8wJYkK8DVC9SY",
  authDomain: "gainz-461da.firebaseapp.com",
  projectId: "gainz-461da",
  storageBucket: "gainz-461da.appspot.com",
  messagingSenderId: "309789552401",
  appId: "1:309789552401:web:88e84586936c86e1e626b0",
  measurementId: "G-E50CSKH4N2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const realtimeDB = getDatabase(app);
export const auth = getAuth(app);
const analytics = getAnalytics(app);

// Connect to dev emulators
connectDatabaseEmulator(realtimeDB, "localhost", 9000);
connectAuthEmulator(auth, "http://127.0.0.1:9099");
