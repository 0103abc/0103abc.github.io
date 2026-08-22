<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>和香草聊天 ฅ^•ﻌ•^ฅ</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                "Microsoft YaHei",
                sans-serif;
            background:
                radial-gradient(circle at 15% 20%, #ffe3ef 0, transparent 30%),
                radial-gradient(circle at 85% 80%, #e8deff 0, transparent 32%),
                linear-gradient(135deg, #fff4f8, #f6f0ff);
            height: 100vh;
            color: #4e3d49;
        }

        .page {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }

        .chat-app {
            width: min(950px, 100%);
            height: min(850px, calc(100vh - 48px));
            background: rgba(255, 255, 255, .86);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,.9);
            border-radius: 28px;
            box-shadow:
                0 25px 70px rgba(166, 109, 142, .20),
                0 5px 20px rgba(118, 92, 136, .10);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .header {
            height: 88px;
            padding: 15px 22px;
            display: flex;
            align-items: center;
            gap: 14px;
            border-bottom: 1px solid #f2e7ed;
            background: rgba(255,255,255,.7);
        }

        .avatar {
            width: 58px;
            height: 58px;
            border-radius: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 31px;
            background: linear-gradient(145deg, #ffcee0, #eadcff);
            box-shadow: 0 7px 18px rgba(222, 142, 178, .26);
        }

        .character-info {
            flex: 1;
        }

        .character-name {
            font-size: 18px;
            font-weight: 700;
            color: #593d50;
        }

        .status {
            margin-top: 5px;
            font-size: 13px;
            color: #a27e92;
        }

        .online {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #68d391;
            border-radius: 50%;
            margin-right: 5px;
        }

        .clear-btn {
            border: 0;
            background: #fff1f6;
            color: #a05f80;
            border-radius: 14px;
            padding: 9px 14px;
            cursor: pointer;
            transition: .2s;
        }

        .clear-btn:hover {
            background: #ffe4ee;
        }

        .messages {
            flex: 1;
            overflow-y: auto;
            padding: 28px;
            scroll-behavior: smooth;
        }

        .message {
            display: flex;
            margin-bottom: 20px;
            animation: show .25s ease;
        }

        @keyframes show {
            from {
                opacity: 0;
                transform: translateY(7px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .message.user {
            justify-content: flex-end;
        }

        .message.assistant {
            justify-content: flex-start;
        }

        .bubble {
            max-width: min(72%, 650px);
            padding: 13px 17px;
            border-radius: 20px;
            font-size: 15px;
            line-height: 1.75;
            white-space: pre-wrap;
            word-break: break-word;
        }

        .assistant .bubble {
            background: #fff;
            border: 1px solid #f2e5ec;
            border-bottom-left-radius: 6px;
            box-shadow: 0 5px 16px rgba(122, 83, 107, .06);
        }

        .user .bubble {
            background: linear-gradient(135deg, #ff91b9, #d398f4);
            color: #fff;
            border-bottom-right-radius: 6px;
            box-shadow: 0 7px 18px rgba(211, 126, 172, .22);
        }

        .typing {
            display: inline-flex;
            gap: 5px;
            align-items: center;
        }

        .typing span {
            width: 7px;
            height: 7px;
            background: #c590a8;
            border-radius: 50%;
            animation: blink 1.1s infinite;
        }

        .typing span:nth-child(2) {
            animation-delay: .15s;
        }

        .typing span:nth-child(3) {
            animation-delay: .3s;
        }

        @keyframes blink {
            0%, 70%, 100% {
                opacity: .25;
                transform: translateY(0);
            }
            35% {
                opacity: 1;
                transform: translateY(-3px);
            }
        }

        .input-area {
            padding: 16px 20px 20px;
            border-top: 1px solid #f2e7ed;
            background: rgba(255,255,255,.78);
        }

        .input-box {
            display: flex;
            align-items: flex-end;
            gap: 12px;
            background: #faf7f9;
            padding: 10px;
            border: 1px solid #f0e2e9;
            border-radius: 21px;
            transition: .2s;
        }

        .input-box:focus-within {
            border-color: #efa7c6;
            box-shadow: 0 0 0 3px rgba(239, 167, 198, .12);
        }

        textarea {
            width: 100%;
            min-height: 45px;
            max-height: 140px;
            resize: none;
            border: 0;
            outline: 0;
            background: transparent;
            padding: 10px;
            font-size: 15px;
            font-family: inherit;
            line-height: 1.5;
            color: #51424a;
        }

        textarea::placeholder {
            color: #b9a9b1;
        }

        .send-btn {
            flex: 0 0 auto;
            width: 48px;
            height: 48px;
            border: 0;
            border-radius: 16px;
            cursor: pointer;
            color: #fff;
            font-size: 19px;
            background: linear-gradient(135deg, #ff88b4, #bf8bea);
            box-shadow: 0 7px 17px rgba(202, 126, 176, .25);
            transition: .2s;
        }

        .send-btn:hover {
            transform: translateY(-2px);
        }

        .send-btn:disabled {
            opacity: .5;
            cursor: not-allowed;
            transform: none;
        }

        .hint {
            text-align: center;
            color: #baa4b0;
            font-size: 11px;
            margin-top: 9px;
        }

        @media (max-width: 600px) {
            .page {
                padding: 0;
            }

            .chat-app {
                height: 100vh;
                border-radius: 0;
            }

            .messages {
                padding: 18px 14px;
            }

            .bubble {
                max-width: 85%;
            }
        }
    </style>
</head>

<body>

<div class="page">
    <main class="chat-app">

        <header class="header">
            <div class="avatar">🐱</div>

            <div class="character-info">
                <div class="character-name">
                    香草 Vanilla
                </div>

                <div class="status">
                    <span class="online"></span>
                    正趴在屏幕另一边等主人说话~
                </div>
            </div>

            <button class="clear-btn" onclick="clearConversation()">
                清空聊天
            </button>
        </header>


        <section id="messages" class="messages"></section>


        <footer class="input-area">

            <div class="input-box">
                <textarea
                    id="input"
                    rows="1"
                    maxlength="4000"
                    placeholder="给主人家的香草说点什么吧……"
                ></textarea>

                <button
                    id="send"
                    class="send-btn"
                    onclick="sendMessage()"
                    title="发送"
                >
                    ➤
                </button>
            </div>

            <div class="hint">
                Enter 发送 · Shift + Enter 换行
            </div>

        </footer>

    </main>
</div>


<script>
    const messagesElement = document.getElementById('messages');
    const inputElement = document.getElementById('input');
    const sendButton = document.getElementById('send');

    let history = [];

    try {
        history = JSON.parse(localStorage.getItem('vanilla_history')) || [];
    } catch (e) {
        history = [];
    }


    function saveHistory() {
        localStorage.setItem(
            'vanilla_history',
            JSON.stringify(history)
        );
    }


    function addMessage(role, content, save = true) {

        const item = document.createElement('div');
        item.className = 'message ' + role;

        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        // 使用 textContent，避免模型输出 HTML 导致 XSS。
        bubble.textContent = content;

        item.appendChild(bubble);
        messagesElement.appendChild(item);

        messagesElement.scrollTop =
            messagesElement.scrollHeight;

        if (save) {
            history.push({
                role: role === 'assistant' ? 'assistant' : 'user',
                content: content
            });

            // 防止 localStorage 无限增长
            if (history.length > 40) {
                history = history.slice(-40);
            }

            saveHistory();
        }
    }


    function showWelcome() {
        if (history.length === 0) {
            addMessage(
                'assistant',
                '唔……主人终于来啦~ ❤\n' +
                '香草刚才还在想主人什么时候会出现呢！' +
                '今天想和香草聊些什么呀？（猫耳轻轻晃了晃，开心地抱着尾巴看向屏幕）',
                false
            );
            return;
        }

        history.forEach(msg => {
            addMessage(msg.role, msg.content, false);
        });
    }


    function showTyping() {
        const item = document.createElement('div');

        item.id = 'typing-message';
        item.className = 'message assistant';

        item.innerHTML = `
            <div class="bubble">
                <div class="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        messagesElement.appendChild(item);

        messagesElement.scrollTop =
            messagesElement.scrollHeight;
    }


    function hideTyping() {
        document.getElementById('typing-message')?.remove();
    }


    async function sendMessage() {

        const text = inputElement.value.trim();

        if (!text || sendButton.disabled) {
            return;
        }

        addMessage('user', text);

        inputElement.value = '';
        inputElement.style.height = 'auto';

        sendButton.disabled = true;

        showTyping();

        try {

            /*
             * 只发送最近的对话。
             * system prompt 永远由后端提供，
             * 不允许浏览器修改。
             */
            const recentHistory = history.slice(-20);

            const response = await fetch('api.php', {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    messages: recentHistory
                })
            });

            const data = await response.json();

            hideTyping();

            if (!response.ok) {
                throw new Error(
                    data.error || '服务器请求失败'
                );
            }

            addMessage(
                'assistant',
                data.reply || '（香草疑惑地歪了歪头……）'
            );

        } catch (error) {

            hideTyping();

            addMessage(
                'assistant',
                '呜……好像哪里出问题了：' +
                error.message
            );

        } finally {

            sendButton.disabled = false;
            inputElement.focus();

        }
    }


    function clearConversation() {

        history = [];

        localStorage.removeItem('vanilla_history');

        messagesElement.innerHTML = '';

        showWelcome();
    }


    inputElement.addEventListener('keydown', event => {

        if (
            event.key === 'Enter' &&
            !event.shiftKey
        ) {
            event.preventDefault();
            sendMessage();
        }
    });


    inputElement.addEventListener('input', () => {

        inputElement.style.height = 'auto';

        inputElement.style.height =
            Math.min(
                inputElement.scrollHeight,
                140
            ) + 'px';
    });


    showWelcome();
</script>

</body>
</html>
