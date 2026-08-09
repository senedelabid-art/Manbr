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
    const mainAvatar = document.getElementById('mainAvatar');

    const groupModal = document.getElementById('groupModal');
    const openNewGroup = document.getElementById('openNewGroup');
    const closeGroup = document.getElementById('closeGroup');
    const createGroupBtn = document.getElementById('createGroupBtn');
    const groupNameInput = document.getElementById('groupNameInput');
    const chatList = document.getElementById('chatList');
    const searchInput = document.getElementById('searchInput');

    // استرجاع الرسائل المخزنة
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

    // إرسال رسالة
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

    // القائمة الجانبية
    menuToggle.addEventListener('click', () => {
        sideMenu.style.display = sideMenu.style.display === 'none' ? 'block' : 'none';
    });

    // الإعدادات والبروفايل
    openSettings.addEventListener('click', () => {
        sideMenu.style.display = 'none';
        settingsModal.style.display = 'flex';
    });
    closeSettings.addEventListener('click', () => settingsModal.style.display = 'none');
    
    saveSettings.addEventListener('click', () => {
        const newName = usernameInput.value.trim();
        if(newName !== '') {
            mainChatTitle.innerText = newName;
            mainAvatar.innerText = newName.charAt(0); // تحديث الأفاتار بأول حرف من الاسم
            localStorage.setItem('manbr_username', newName);
            settingsModal.style.display = 'none';
        }
    });

    // استتحضار البيانات المحفوظة مسبقاً
    const savedName = localStorage.getItem('manbr_username');
    if(savedName) { 
        mainChatTitle.innerText = savedName; 
        mainAvatar.innerText = savedName.charAt(0);
    }

    // إنشاء مجموعة جديدة
    openNewGroup.addEventListener('click', () => {
        sideMenu.style.display = 'none';
        groupModal.style.display = 'flex';
    });
    closeGroup.addEventListener('click', () => groupModal.style.display = 'none');

    createGroupBtn.addEventListener('click', () => {
        const gName = groupNameInput.value.trim();
        if(gName !== '') {
            const groupItem = document.createElement('div');
            groupItem.className = 'chat-item';
            groupItem.setAttribute('data-name', gName);
            groupItem.innerHTML = `
                <div class="avatar" style="background-color: #2b5278;">${gName.charAt(0)}</div>
                <div class="chat-info">
                    <div class="chat-name-time">
                        <span class="chat-name">${gName}</span>
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

    // ميزة البحث الفوري في المحادثات
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const items = chatList.querySelectorAll('.chat-item');
        items.forEach(item => {
            const name = item.getAttribute('data-name').toLowerCase();
            if(name.includes(term)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
});
