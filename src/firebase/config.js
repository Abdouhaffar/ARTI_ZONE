import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDHuYlu4xDoaom-neYGQBYf4iITeybdrvI",
  authDomain: "artizone-e3d9c.firebaseapp.com",
  projectId: "artizone-e3d9c",
  storageBucket: "artizone-e3d9c.firebasestorage.app",
  messagingSenderId: "370751376477",
  appId: "1:370751376477:web:804fb26c7f24db5f3c51b4",
  measurementId: "G-YLTXWE4TC4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export default app;