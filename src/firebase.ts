import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  signOut, 
  onAuthStateChanged, 
  User,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

console.log("Initializing Firebase with project:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set persistence to session to avoid some iframe issues with local storage
// We use a try-catch to ensure this doesn't block the app if it fails
try {
  setPersistence(auth, browserSessionPersistence).catch(err => {
    console.error("Failed to set auth persistence:", err);
  });
} catch (e) {
  console.error("Persistence error:", e);
}

// Ensure firestoreDatabaseId is handled correctly
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)"
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, doc, setDoc, getDoc, onSnapshot };
export type { User };
