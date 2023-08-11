import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBPR8fIbM8CuVuNz8CAotb_Af5PJSz6R70",
  authDomain: "video-c746c.firebaseapp.com",
  projectId: "video-c746c",
  storageBucket: "video-c746c.appspot.com",
  messagingSenderId: "476698453897",
  appId: "1:476698453897:web:20baa1361f957f3d98e358",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
// this GoogleAuthProvider will provide the google button
export const provider = new GoogleAuthProvider();
// exporting app to upload image and video
export default app;
