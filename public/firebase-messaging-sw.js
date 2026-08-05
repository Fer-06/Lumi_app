// Service worker para notificaciones push en segundo plano (Firebase Cloud Messaging)
importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js");

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwc_GtxUqlyINHyMtkOJ2vlmkT4GPkyXo",
  authDomain: "lumi-595a7.firebaseapp.com",
  projectId: "lumi-595a7",
  storageBucket: "lumi-595a7.firebasestorage.app",
  messagingSenderId: "643301087296",
  appId: "1:643301087296:web:cbc8df40a702c79d3e27a5",
  measurementId: "G-D3X8XQ71GL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
