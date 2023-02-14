// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGDiImOtH1cZyPBWbR1D2Ymc0qvzjU58I",
  authDomain: "whos-that-pokemon-d6f3c.firebaseapp.com",
  projectId: "whos-that-pokemon-d6f3c",
  storageBucket: "whos-that-pokemon-d6f3c.appspot.com",
  messagingSenderId: "146951067706",
  appId: "1:146951067706:web:0534c6895c10eb4d9f7d03",
  measurementId: "G-C09C2DP2RB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app)