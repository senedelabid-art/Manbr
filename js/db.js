import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ضع إعدادات مشروعك الحقيقي هنا
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. التحقق مما إذا كان اسم المستخدم (Username) مستخدماً من قبل (Unique Check)
export async function isUsernameTaken(username) {
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // يعود بـ true إذا كان محجوزاً مسبقاً
}

// 2. حفظ بيانات المستخدم الجديد في قاعدة البيانات
export async function saveUserData(userId, userData) {
    try {
        await setDoc(doc(db, "users", userId), {
            ...userData,
            createdAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// 3. جلب بيانات المستخدم
export async function getUserData(userId) {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}
