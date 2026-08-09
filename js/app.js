document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('msgInput');
    const sendBtn = document.getElementById('sendBtn');
    const list = document.getElementById('msgList');
    
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    
    const settingsModal = document.getElementById('settingsModal');
    const openSettings = document.getElementById('openSettings');
    const closeSettings = document.getElementById('closeSettings');
    const saveSettings = document.getElementById('saveSettings');
    const usernameInput = document.getElementById('usernameInput');
    const mainChatTitle = document.getElementById('currentChatTitle');

    const groupModal = document.getElementById('groupModal');
    const openNewGroup = document.getElementById('openNewGroup');
    const closeGroup = document.getElementById('closeGroup');
    const createGroupBtn = document.getElementById('createGroupBtn');
    const groupNameInput = document.getElementById('groupNameInput');
    const chatList = document.getElementById('chatList');

    // استرجاع الرسائل المخزنة مسبقاً
    let messages = JSON.parse(localStorage.getItem('manbr_messages')) || [];
    function renderMessages() {
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

    // إرسال رسالة وحفظها
    function sendMessage() {
        if(input.value.trim() !== '') {
            const newMsg = { text: input.value, type: 'outgoing' };
            messages.push(newMsg);
            localStorage.setItem('manbr_messages', JSON.stringify(messages));
            renderMessages();
            input.value = '';
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

    // تحكم بالقائمة الجانبية
    menuToggle.addEventListener('click', () => {
        sideMenu.style.display = sideMenu.style.display === 'none' ? 'block' : 'none';
    });

    // إعدادات الملف الشخصي
    openSettings.addEventListener('click', () => {
        sideMenu.style.display = 'none';
        settingsModal.style.display = 'flex';
    });
    closeSettings.addEventListener('click', () => settingsModal.style.display = 'none');
    
    saveSettings.addEventListener('click', () => {
        if(usernameInput.value.trim() !== '') {
            mainChatTitle.innerText = usernameInput.value;
            localStorage.setItem('manbr_username', usernameInput.value);
            settingsModal.style.display = 'none';
        }
    });

    // استرجاع الاسم المحفوظ
    const savedName = localStorage.getItem('manbr_username');
    if(savedName) { mainChatTitle.innerText = savedName; }

    // إنشاء مجموعة جديدة
    openNewGroup.addEventListener('click', () => {
        sideMenu.style.display = 'none';
        groupModal.style.display = 'flex';
    });
    closeGroup.addEventListener('click', () => groupModal.style.display = 'none');

    createGroupBtn.addEventListener('click', () => {
        if(groupNameInput.value.trim() !== '') {
            const groupItem = document.createElement('div');
            groupItem.className = 'chat-item';
            groupItem.innerHTML = `
                <div class="avatar" style="background-color: #2b5278;">م</div>
                <div class="chat-info">
                    <div class="chat-name-time">
                        <span class="chat-name">${groupNameInput.value}</span>
                        <span class="chat-time">الآن</span>
                    </div>
                    <div class="chat-last-msg">مجموعة جديدة</div>
                </div>
            `;
            chatList.appendChild(groupItem);
            groupModal.style.display = 'none';
            groupNameInput.value = '';
        }
    });
});
