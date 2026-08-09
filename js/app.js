document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('msgInput');
    const sendBtn = document.getElementById('sendBtn');
    const list = document.getElementById('msgList');

    function sendMessage() {
        if(input.value.trim() !== '') {
            const msg = document.createElement('div');
            msg.className = 'message outgoing';
            msg.innerText = input.value;
            list.appendChild(msg);
            input.value = '';
            list.scrollTop = list.scrollHeight;
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') { 
            sendMessage(); 
        }
    });
});

