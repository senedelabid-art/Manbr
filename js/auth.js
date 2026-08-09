import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXCM4n0UWeuEEI6uSV5wx-aN87icjqXuw",
  authDomain: "menbrchat.firebaseapp.com",
  projectId: "menbrchat",
  storageBucket: "menbrchat.firebasestorage.app",
  messagingSenderId: "741501842921",
  appId: "1:741501842921:web:6e13d47178bd59cbcc0778"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function registerWithEmail(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function loginWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
