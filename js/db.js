import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, query, collection, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXCM4n0UWeuEEI6uSV5wx-aN87icjqXuw",
  authDomain: "menbrchat.firebaseapp.com",
  projectId: "menbrchat",
  storageBucket: "menbrchat.firebasestorage.app",
  messagingSenderId: "741501842921",
  appId: "1:741501842921:web:6e13d47178bd59cbcc0778"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// فحص هل اسم المستخدم محجوز
export async function isUsernameTaken(username) {
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}

// حفظ بيانات المستخدم
export async function saveUserData(userId, userData) {
    try {
        await setDoc(doc(db, "users", userId), userData);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
