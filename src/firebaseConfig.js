// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAA2m0X0F8dKoixs62k34WBN4GIs6xOSfU",
  authDomain: "biblioteca-centrocultural.firebaseapp.com",
  projectId: "biblioteca-centrocultural",
  storageBucket: "biblioteca-centrocultural.firebasestorage.app",
  messagingSenderId: "529855784656",
  appId: "1:529855784656:web:243e9807124c557215a0d5",
  measurementId: "G-2L2TKFTFT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };