document.addEventListener('DOMContentLoaded', () => {
    // عناصر المصادقة
    const authScreen = document.getElementById('authScreen');
    const appContainer = document.getElementById('appContainer');
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabRegisterBtn = document.getElementById('tabRegisterBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('loginBtn');

    const regFirstName = document.getElementById('regFirstName');
    const regLastName = document.getElementById('regLastName');
    const regEmail = document.getElementById('regEmail');
    const regPassword = document.getElementById('regPassword');
    const registerBtn = document.getElementById('registerBtn');

    // عناصر التطبيق الرئيسي والتبويبات
    const navItems = document.querySelectorAll('.nav-item');
    const settingsView = document.getElementById('settingsView');
    const backToAppBtn = document.getElementById('backToAppBtn');

    // بيانات الـ currentUser الديناميكية
    let currentUser = JSON.parse(localStorage.getItem('manbr_current_user')) || null;

    function checkAuth() {
        if(currentUser) {
            authScreen.style.display = 'none';
            appContainer.style.display = 'flex';
            updateUIWithUserData();
        } else {
            authScreen.style.display = 'flex';
            appContainer.style.display = 'none';
        }
    }
    checkAuth();

    // تبديل تبويبات الدخول والتسجيل
    tabLoginBtn.addEventListener('click', () => {
        tabLoginBtn.classList.add('active');
        tabRegisterBtn.classList.remove('active');
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
    });

    tabRegisterBtn.addEventListener('click', () => {
        tabRegisterBtn.classList.add('active');
        tabLoginBtn.classList.remove('active');
        registerForm.style.display = 'flex';
        loginForm.style.display = 'none';
    });

    // إنشاء حساب جديد
    registerBtn.addEventListener('click', () => {
        const fName = regFirstName.value.trim();
        const lName = regLastName.value.trim();
        const email = regEmail.value.trim();
        const pass = regPassword.value.trim();

        if(fName && email && pass) {
            currentUser = {
                firstName: fName,
                lastName: lName || '',
                email: email,
                phone: '+964 يحدد لاحقاً',
                username: fName.toLowerCase() + Math.floor(Math.random() * 1000)
            };
            localStorage.setItem('manbr_current_user', JSON.stringify(currentUser));
            checkAuth();
        } else {
            alert('يرجى ملء الحقول الإجبارية');
        }
    });

    // تسجيل الدخول
    loginBtn.addEventListener('click', () => {
        const email = loginEmail.value.trim();
        if(email) {
            currentUser = {
                firstName: 'مستخدم',
                lastName: 'مانبر',
                email: email,
                phone: 'غير متوفر',
                username: 'user_' + Math.floor(Math.random() * 1000)
            };
            localStorage.setItem('manbr_current_user', JSON.stringify(currentUser));
            checkAuth();
        }
    });

    // تحديث بيانات واجهة المستخدم الديناميكية
    function updateUIWithUserData() {
        if(!currentUser) return;
        const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
        document.getElementById('mainChatName').innerText = fullName;
        document.getElementById('mainAvatar').innerText = currentUser.firstName.charAt(0);
        
        document.getElementById('settingsAvatar').innerText = currentUser.firstName.charAt(0);
        document.getElementById('settingsFullName').innerText = fullName;
        document.getElementById('settingsPhone').innerText = currentUser.phone;
        document.getElementById('displayNameVal').innerText = fullName;
        document.getElementById('displayEmailVal').innerText = currentUser.email;
        document.getElementById('displayPhoneVal').innerText = currentUser.phone;
        document.getElementById('displayUsernameVal').innerText = `@${currentUser.username}`;
        document.getElementById('profileLinkInput').value = `menbrchat.com/@${currentUser.username}`;
    }

    // تنقل التبويبات السفلية (Bottom Navigation) بشكل منفصل
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const target = item.getAttribute('data-target');

            // إخفاء كل الواجهات أولاً
            document.querySelector('.sidebar').style.display = 'none';
            document.getElementById('mainContentArea').style.display = 'none';
            settingsView.style.display = 'none';

            // إظهار الواجهة المطلوبة حسب التبويب
            if (target === 'chats') {
                document.querySelector('.sidebar').style.display = 'flex';
                document.getElementById('mainContentArea').style.display = 'flex';
            } else if (target === 'settings') {
                settingsView.style.display = 'flex';
            } else {
                alert('صفحة ' + target + ' قيد التجهيز.. سيتم تفعيلها في الدفعة القادمة!');
                document.querySelector('.sidebar').style.display = 'flex';
                document.getElementById('mainContentArea').style.display = 'flex';
            }
        });
    });

    backToAppBtn.addEventListener('click', () => {
        settingsView.style.display = 'none';
        document.querySelector('.sidebar').style.display = 'flex';
        document.getElementById('mainContentArea').style.display = 'flex';
    });

    // تعديل البيانات الديناميكية
    document.getElementById('editNameBtn').addEventListener('click', () => {
        const newName = prompt('أدخل الاسم الجديد:', currentUser.firstName);
        if(newName) {
            currentUser.firstName = newName;
            localStorage.setItem('manbr_current_user', JSON.stringify(currentUser));
            updateUIWithUserData();
        }
    });

    document.getElementById('copyLinkBtn').addEventListener('click', () => {
        const linkVal = `menbrchat.com/@${currentUser.username}`;
        navigator.clipboard.writeText(linkVal);
        alert('تم نسخ رابط الملف الشخصي بنجاح!');
    });

    // المحادثات والإرسال
    const input = document.getElementById('msgInput');
    const sendBtn = document.getElementById('sendBtn');
    const list = document.getElementById('msgList');
    let messages = JSON.parse(localStorage.getItem('manbr_messages')) || [];

    function renderMessages() {
        if(!list) return;
        list.innerHTML = '';
        messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = `message ${msg.type}`;
            div.innerText = msg.text;
            list.appendChild(div);
        });
        list.scrollTop = list.scrollHeight;
    }
    renderMessages();

    if(sendBtn) {
        sendBtn.addEventListener('click', () => {
            if(input.value.trim() !== '') {
                messages.push({ text: input.value, type: 'outgoing' });
                localStorage.setItem('manbr_messages', JSON.stringify(messages));
                renderMessages();
                input.value = '';
            }
        });
    }
});
