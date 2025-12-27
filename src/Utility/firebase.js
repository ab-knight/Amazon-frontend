import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Firebase configuration for clone-6afb7
const firebaseConfig = {
  apiKey: "AIzaSyB5iHyILnjGKbMfq-xOgyAXueiYynMo5-M",
  authDomain: "clone-6afb7.firebaseapp.com",
  projectId: "clone-6afb7",
  storageBucket: "clone-6afb7.appspot.com",
  messagingSenderId: "145080972786",
  appId: "1:145080972786:web:fe7fc0137a087e808b276b",
};

// Initialize Firebase (v8 compat)
const app = firebase.initializeApp(firebaseConfig);

// Exports
export const auth = firebase.auth();
export const db = firebase.firestore();

export default app;
