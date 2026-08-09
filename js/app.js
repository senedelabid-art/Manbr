import { registerWithEmail, loginWithEmail } from './auth.js';
import { isUsernameTaken, saveUserData } from './db.js';

document.addEventListener('DOMContentLoaded', () => {
    // متغيرات مؤقتة لتخزين البيانات أثناء الخطوات
    let tempEmail = '';
    let tempPassword = '';

    // عناصر الشاشات والخطوات
    const step1Email = document.getElementById('step1Email');
    const step2Otp = document.getElementById('step2Otp');
    const step3Password = document.getElementById('step3Password');
    const step4Profile = document.getElementById('step4Profile');
    
    const authScreen = document.getElementById('authScreen');
    const appContainer = document.getElementById('appContainer');

    // أزرار الخطوات
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const savePasswordBtn = document.getElementById('savePasswordBtn');
    const finishRegisterBtn = document.getElementById('finishRegisterBtn');

    // الخطوة 1: حفظ الإيميل والانتقال لكود التحقق (محاكاة أو إرسال حقيقي)
    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', () => {
            const emailInput = document.getElementById('authEmailInput').value.trim();
            if (!emailInput) {
                alert('الرجاء إدخال البريد الإلكتروني');
                return;
            }
            tempEmail = emailInput;
            step1Email.style.display = 'none';
            step2Otp.style.display = 'block';
            alert('تم إرسال كود التحقق (أدخل أي 6 أرقام كمحاكاة حالياً)');
        });
    }

    // الخطوة 2: التحقق من الكود والانتقال لكلمة المرور
    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener('click', () => {
            step2Otp.style.display = 'none';
            step3Password.style.display = 'block';
        });
    }

    // الخطوة 3: حفظ كلمة المرور مؤقتاً والانتقال لإدخال البروفايل
    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', () => {
            const pass = document.getElementById('authPasswordInput').value;
            const confirmPass = document.getElementById('authConfirmPasswordInput').value;
            
            if (pass.length < 6) {
                alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
                return;
            }
            if (pass !== confirmPass) {
                alert('كلمات المرور غير متطابقة');
                return;
            }

            tempPassword = pass;
            step3Password.style.display = 'none';
            step4Profile.style.display = 'block';
        });
    }

    // الخطوة 4: إنهاء التسجيل، فحص اليوزر، وإنشاء الحساب في Firebase
    if (finishRegisterBtn) {
        finishRegisterBtn.addEventListener('click', async () => {
            const firstName = document.getElementById('profileFirstName').value.trim();
            const lastName = document.getElementById('profileLastName').value.trim();
            let username = document.getElementById('profileUsername').value.trim();

            if (!firstName || !username) {
                alert('الرجاء إدخال الاسم الأول واسم المستخدم');
                return;
            }

            // تنظيف الـ username إذا كتب المستخدم @ في البداية
            if (username.startsWith('@')) {
                username = username.substring(1);
            }

            // 1. فحص هل اليوزر مستخدم من قبل في قاعدة البيانات
            const taken = await isUsernameTaken(username);
            if (taken) {
                alert('اسم المستخدم هذا محجوز مسبقاً، اختر اسمًا آخر.');
                return;
            }

            // 2. إنشاء الحساب في Firebase Auth
            const authResult = await registerWithEmail(tempEmail, tempPassword);
            if (!authResult.success) {
                alert('خطأ في التسجيل: ' + authResult.error);
                return;
            }

            const userId = authResult.user.uid;

            // 3. حفظ بيانات المستخدم في Firestore
            const dbResult = await saveUserData(userId, {
                firstName,
                lastName,
                username,
                email: tempEmail,
                isOnline: true,
                lastSeen: new Date().toISOString()
            });

            if (dbResult.success) {
                alert('تم إنشاء الحساب بنجاح!');
                authScreen.style.display = 'none';
                appContainer.style.display = 'flex';
            } else {
                alert('حدث خطأ أثناء حفظ البيانات: ' + dbResult.error);
            }
        });
    }

    // التحكم بالتبويبات السفلية (الشات، الإجهات، الإعدادات، البروفايل)
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            const target = item.getAttribute('data-target');
            console.log("تم الانتقال إلى تبويب: " + target);
        });
    });
});
