import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnMHAWocO1dQC_kuwOmrgrl5M2fI4ug4c",
  authDomain: "medibot-ai.firebaseapp.com",
  projectId: "medibot-ai",
  storageBucket: "medibot-ai.firebasestorage.app",
  messagingSenderId: "317850214714",
  appId: "1:317850214714:web:3e91758aed356e98557003"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    console.error("Firebase persistence error:", err);
  });

export { auth, db };