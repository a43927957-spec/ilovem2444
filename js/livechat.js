// Live Chat Module
const LiveChat = {
    conversations: [],
    currentConversation: null,
    messages: {},
    typingTimeout: null,

    init() {
        console.log('Live Chat module initialized');
        this.loadConversations();
        this.renderConversationList();
        this.bindEvents();
        this.startAutoUpdate();
    },

    loadConversations() {
        // Load conversations from localStorage
        const stored = Utils.storage.get('conversations');
        if (stored) {
            this.conversations = stored;
        } else {
            this.conversations = this.generateSampleConversations();
            this.saveConversations();
        }

        // Load messages from localStorage
        const storedMessages = Utils.storage.get('chat_messages');
        if (storedMessages) {
            this.messages = storedMessages;
        } else {
            this.messages = this.generateSampleMessages();
            this.saveMessages();
        }
    },

    generateSampleConversations() {
        const now = Date.now();
        return [
            {
                id: 'conv-001',
                userId: 'user-1001',
                userName: '王小明',
                userAvatar: '👤',
                platform: 'messenger',
                lastMessage: '好的，我想了解更多關於產品的資訊',
                lastMessageTime: now - (5 * 60 * 1000),
                unreadCount: 2,
                status: 'active',
                tags: ['潛在客戶', '產品諮詢']
            },
            {
                id: 'conv-002',
                userId: 'user-1015',
                userName: '李美麗',
                userAvatar: '👩',
                platform: 'line',
                lastMessage: '謝謝你的幫助！',
                lastMessageTime: now - (15 * 60 * 1000),
                unreadCount: 0,
                status: 'resolved',
                tags: ['已處理']
            },
            {
                id: 'conv-003',
                userId: 'user-1028',
                userName: '張志豪',
                userAvatar: '👨',
                platform: 'instagram',
                lastMessage: '請問現在有優惠活動嗎？',
                lastMessageTime: now - (30 * 60 * 1000),
                unreadCount: 1,
                status: 'active',
                tags: ['促銷諮詢']
            },
            {
                id: 'conv-004',
                userId: 'user-1042',
                userName: '陳雅婷',
                userAvatar: '👩',
                platform: 'messenger',
                lastMessage: '我的訂單什麼時候會到？',
                lastMessageTime: now - (1 * 60 * 60 * 1000),
                unreadCount: 3,
                status: 'active',
                tags: ['訂單查詢', 'VIP']
            },
            {
                id: 'conv-005',
                userId: 'user-1055',
                userName: '林建國',
                userAvatar: '👤',
                platform: 'line',
                lastMessage: '可以退貨嗎？',
                lastMessageTime: now - (2 * 60 * 60 * 1000),
                unreadCount: 0,
                status: 'pending',
                tags: ['退換貨']
            },
            {
                id: 'conv-006',
                userId: 'user-1067',
                userName: '黃淑芬',
                userAvatar: '👩',
                platform: 'instagram',
                lastMessage: '你好，我想詢問產品規格',
                lastMessageTime: now - (3 * 60 * 60 * 1000),
                unreadCount: 1,
                status: 'active',
                tags: ['產品諮詢']
            }
        ];
    },

    generateSampleMessages() {
        const now = Date.now();
        return {
            'conv-001': [
                {
                    id: 'msg-001',
                    sender: 'user',
                    message: '你好，請問這個產品有現貨嗎？',
                    timestamp: now - (30 * 60 * 1000)
                },
                {
                    id: 'msg-002',
                    sender: 'agent',
                    message: '您好！是的，我們目前有現貨。請問您想了解哪個型號呢？',
                    timestamp: now - (28 * 60 * 1000)
                },
                {
                    id: 'msg-003',
                    sender: 'user',
                    message: 'iPhone 16 Pro Max 256GB',
                    timestamp: now - (25 * 60 * 1000)
                },
                {
                    id: 'msg-004',
                    sender: 'agent',
                    message: 'iPhone 16 Pro Max 256GB 目前所有顏色都有現貨！價格是 NT$45,900，現在購買還享有免運優惠 🎁',
                    timestamp: now - (23 * 60 * 1000)
                },
                {
                    id: 'msg-005',
                    sender: 'user',
                    message: '好的，我想了解更多關於產品的資訊',
                    timestamp: now - (5 * 60 * 1000)
                }
            ],
            'conv-002': [
                {
                    id: 'msg-006',
                    sender: 'user',
                    message: '我的訂單已經收到了',
                    timestamp: now - (20 * 60 * 1000)
                },
                {
                    id: 'msg-007',
                    sender: 'agent',
                    message: '太好了！很高興您收到了。產品使用上如果有任何問題，隨時可以聯繫我們 😊',
                    timestamp: now - (18 * 60 * 1000)
                },
                {
                    id: 'msg-008',
                    sender: 'user',
                    message: '謝謝你的幫助！',
                    timestamp: now - (15 * 60 * 1000)
                }
            ],
            'conv-003': [
                {
                    id: 'msg-009',
                    sender: 'user',
                    message: '請問現在有優惠活動嗎？',
                    timestamp: now - (30 * 60 * 1000)
                }
            ],
            'conv-004': [
                {
                    id: 'msg-010',
                    sender: 'user',
                    message: '訂單編號 #12345',
                    timestamp: now - (90 * 60 * 1000)
                },
                {
                    id: 'msg-011',
                    sender: 'agent',
                    message: '讓我幫您查詢一下...',
                    timestamp: now - (88 * 60 * 1000)
                },
                {
                    id: 'msg-012',
                    sender: 'user',
                    message: '我的訂單什麼時候會到？',
                    timestamp: now - (1 * 60 * 60 * 1000)
                }
            ]
        };
    },

    saveConversations() {
        Utils.storage.set('conversations', this.conversations);
    },

    saveMessages() {
        Utils.storage.set('chat_messages', this.messages);
    },

    renderConversationList() {
        const container = document.getElementById('conversationList');
        if (!container) return;

        if (this.conversations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <h3>沒有對話</h3>
                    <p>當有用戶傳送訊息時，對話會顯示在這裡</p>
                </div>
            `;
            return;
        }

        const conversationItems = this.conversations.map(conv => {
            const platformInfo = this.getPlatformInfo(conv.platform);
            const timeText = this.getTimeAgo(conv.lastMessageTime);
            const isActive = this.currentConversation && this.currentConversation.id === conv.id;

            return `
                <div class="conversation-item ${isActive ? 'active' : ''} ${conv.unreadCount > 0 ? 'unread' : ''}" 
                     onclick="LiveChat.selectConversation('${conv.id}')">
                    <div class="conversation-avatar">${conv.userAvatar}</div>
                    <div class="conversation-info">
                        <div class="conversation-header">
                            <span class="conversation-name">${conv.userName}</span>
                            <span class="conversation-time">${timeText}</span>
                        </div>
                        <div class="conversation-last-message">${conv.lastMessage}</div>
                        <div class="conversation-footer">
                            <span class="conversation-platform" style="color: ${platformInfo.color};">
                                <i class="${platformInfo.icon}"></i>
                            </span>
                            ${conv.unreadCount > 0 ? `<span class="conversation-badge">${conv.unreadCount}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = conversationItems;
    },

    renderChatWindow() {
        const container = document.getElementById('chatWindow');
        if (!container) return;

        if (!this.currentConversation) {
            container.innerHTML = `
                <div class="chat-placeholder">
                    <i class="fas fa-comments"></i>
                    <h3>選擇一個對話開始聊天</h3>
                    <p>從左側列表選擇對話，開始與客戶互動</p>
                </div>
            `;
            return;
        }

        const platformInfo = this.getPlatformInfo(this.currentConversation.platform);
        const messages = this.messages[this.currentConversation.id] || [];
        
        const messagesHTML = messages.map(msg => {
            const time = new Date(msg.timestamp).toLocaleTimeString('zh-TW', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });

            return `
                <div class="message ${msg.sender === 'agent' ? 'message-sent' : 'message-received'}">
                    <div class="message-bubble">
                        <div class="message-text">${msg.message}</div>
                        <div class="message-time">${time}</div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="chat-header">
                <div class="chat-user-info">
                    <div class="chat-avatar">${this.currentConversation.userAvatar}</div>
                    <div>
                        <div class="chat-user-name">${this.currentConversation.userName}</div>
                        <div class="chat-user-status">
                            <span class="platform-badge" style="background: ${platformInfo.color}15; color: ${platformInfo.color};">
                                <i class="${platformInfo.icon}"></i>
                                ${platformInfo.name}
                            </span>
                            ${this.currentConversation.tags.map(tag => 
                                `<span class="chat-tag">${tag}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                <div class="chat-actions">
                    <button class="btn-icon" onclick="LiveChat.viewUserInfo()" title="用戶資訊">
                        <i class="fas fa-user"></i>
                    </button>
                    <button class="btn-icon" onclick="LiveChat.resolveConversation()" title="標記為已處理">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-icon" onclick="LiveChat.archiveConversation()" title="封存">
                        <i class="fas fa-archive"></i>
                    </button>
                </div>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                ${messagesHTML}
            </div>
            
            <div class="chat-input-container">
                <button class="chat-input-btn" onclick="LiveChat.showQuickReplies()" title="快速回覆">
                    <i class="fas fa-bolt"></i>
                </button>
                <button class="chat-input-btn" onclick="LiveChat.showEmojis()" title="表情符號">
                    <i class="far fa-smile"></i>
                </button>
                <input type="text" class="chat-input" id="chatInput" placeholder="輸入訊息..." 
                       onkeypress="if(event.key==='Enter') LiveChat.sendMessage()">
                <button class="chat-send-btn" onclick="LiveChat.sendMessage()">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;

        // Scroll to bottom
        this.scrollToBottom();
    },

    selectConversation(convId) {
        this.currentConversation = this.conversations.find(c => c.id === convId);
        if (!this.currentConversation) return;

        // Mark as read
        this.currentConversation.unreadCount = 0;
        this.saveConversations();

        this.renderConversationList();
        this.renderChatWindow();
    },

    sendMessage() {
        const input = document.getElementById('chatInput');
        if (!input) return;

        const message = input.value.trim();
        if (!message || !this.currentConversation) return;

        const newMessage = {
            id: 'msg-' + Date.now(),
            sender: 'agent',
            message: message,
            timestamp: Date.now()
        };

        // Add message to conversation
        if (!this.messages[this.currentConversation.id]) {
            this.messages[this.currentConversation.id] = [];
        }
        this.messages[this.currentConversation.id].push(newMessage);

        // Update last message in conversation list
        this.currentConversation.lastMessage = message;
        this.currentConversation.lastMessageTime = Date.now();

        this.saveMessages();
        this.saveConversations();

        // Clear input
        input.value = '';

        // Re-render
        this.renderConversationList();
        this.renderChatWindow();

        // Simulate user response after 3-5 seconds
        this.simulateUserResponse();
    },

    simulateUserResponse() {
        const responses = [
            '謝謝你的回覆！',
            '了解了',
            '好的，我知道了',
            '還有其他問題想請教',
            '這個價格可以再優惠嗎？',
            '請問還有其他顏色嗎？',
            '請幫我保留，我稍後再決定',
            '太好了，謝謝你的幫助！'
        ];

        setTimeout(() => {
            if (!this.currentConversation) return;

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            const userMessage = {
                id: 'msg-' + Date.now(),
                sender: 'user',
                message: randomResponse,
                timestamp: Date.now()
            };

            this.messages[this.currentConversation.id].push(userMessage);
            this.currentConversation.lastMessage = randomResponse;
            this.currentConversation.lastMessageTime = Date.now();

            this.saveMessages();
            this.saveConversations();

            this.renderChatWindow();
        }, Math.random() * 3000 + 2000);
    },

    scrollToBottom() {
        setTimeout(() => {
            const messagesContainer = document.getElementById('chatMessages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 100);
    },

    showQuickReplies() {
        const quickReplies = [
            '您好！很高興為您服務 😊',
            '請稍等，讓我為您查詢...',
            '感謝您的耐心等待',
            '您的訂單已經在處理中',
            '如有其他問題，歡迎隨時詢問',
            '謝謝您的購買！',
            '我們會盡快為您處理',
            '請問還有其他需要協助的嗎？'
        ];

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-bolt"></i> 快速回覆</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="quick-replies-grid">
                        ${quickReplies.map(reply => `
                            <button class="quick-reply-btn" onclick="LiveChat.useQuickReply('${reply}'); this.closest('.modal-overlay').remove();">
                                ${reply}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    useQuickReply(reply) {
        const input = document.getElementById('chatInput');
        if (input) {
            input.value = reply;
            input.focus();
        }
    },

    showEmojis() {
        const emojis = ['😊', '👍', '❤️', '🎉', '✨', '🙏', '💯', '🔥', '👏', '💪', '😄', '😃', '🤗', '🎁', '⭐', '✅', '💰', '🛍️'];
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="far fa-smile"></i> 表情符號</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="emoji-grid">
                        ${emojis.map(emoji => `
                            <button class="emoji-btn" onclick="LiveChat.insertEmoji('${emoji}'); this.closest('.modal-overlay').remove();">
                                ${emoji}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    insertEmoji(emoji) {
        const input = document.getElementById('chatInput');
        if (input) {
            input.value += emoji;
            input.focus();
        }
    },

    viewUserInfo() {
        if (!this.currentConversation) return;

        const conv = this.currentConversation;
        const platformInfo = this.getPlatformInfo(conv.platform);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-user"></i> 用戶資訊</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="user-info-section">
                        <div class="user-info-avatar">${conv.userAvatar}</div>
                        <h3>${conv.userName}</h3>
                        <div class="user-info-platform">
                            <i class="${platformInfo.icon}" style="color: ${platformInfo.color};"></i>
                            ${platformInfo.name}
                        </div>
                    </div>
                    <div class="user-info-details">
                        <div class="detail-item">
                            <label>用戶ID</label>
                            <div>${conv.userId}</div>
                        </div>
                        <div class="detail-item">
                            <label>狀態</label>
                            <div>
                                <span class="status-badge status-${conv.status}">
                                    ${conv.status === 'active' ? '進行中' : conv.status === 'resolved' ? '已處理' : '待處理'}
                                </span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <label>標籤</label>
                            <div>
                                ${conv.tags.map(tag => `<span class="user-tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                        <div class="detail-item">
                            <label>訊息數</label>
                            <div>${this.messages[conv.id] ? this.messages[conv.id].length : 0} 則</div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">關閉</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    resolveConversation() {
        if (!this.currentConversation) return;

        this.currentConversation.status = 'resolved';
        this.saveConversations();
        this.renderConversationList();
        this.renderChatWindow();

        Utils.showToast('對話已標記為已處理', 'success');
    },

    archiveConversation() {
        if (!this.currentConversation) return;

        if (!confirm('確定要封存此對話嗎？')) return;

        const convId = this.currentConversation.id;
        this.conversations = this.conversations.filter(c => c.id !== convId);
        this.currentConversation = null;

        this.saveConversations();
        this.renderConversationList();
        this.renderChatWindow();

        Utils.showToast('對話已封存', 'success');
    },

    getPlatformInfo(platform) {
        const platforms = {
            messenger: {
                name: 'Messenger',
                icon: 'fab fa-facebook-messenger',
                color: '#0084ff'
            },
            line: {
                name: 'LINE',
                icon: 'fab fa-line',
                color: '#00c300'
            },
            instagram: {
                name: 'Instagram',
                icon: 'fab fa-instagram',
                color: '#e4405f'
            }
        };
        return platforms[platform] || platforms.messenger;
    },

    getTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        if (seconds < 60) return '剛剛';
        if (seconds < 3600) return Math.floor(seconds / 60) + ' 分鐘前';
        if (seconds < 86400) return Math.floor(seconds / 3600) + ' 小時前';
        if (seconds < 2592000) return Math.floor(seconds / 86400) + ' 天前';
        return new Date(timestamp).toLocaleDateString('zh-TW');
    },

    bindEvents() {
        // Filter buttons
        const filterAll = document.getElementById('filterAll');
        const filterActive = document.getElementById('filterActive');
        const filterUnread = document.getElementById('filterUnread');

        if (filterAll) {
            filterAll.addEventListener('click', () => this.filterConversations('all'));
        }
        if (filterActive) {
            filterActive.addEventListener('click', () => this.filterConversations('active'));
        }
        if (filterUnread) {
            filterUnread.addEventListener('click', () => this.filterConversations('unread'));
        }

        // Search
        const searchInput = document.getElementById('conversationSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchConversations(e.target.value));
        }
    },

    filterConversations(filter) {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('filter' + filter.charAt(0).toUpperCase() + filter.slice(1)).classList.add('active');

        // Filter logic would go here
        // For now, just re-render
        this.renderConversationList();
    },

    searchConversations(query) {
        const items = document.querySelectorAll('.conversation-item');
        const searchTerm = query.toLowerCase();

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
        });
    },

    startAutoUpdate() {
        // Simulate new messages every 30 seconds
        setInterval(() => {
            // Only simulate if not on current conversation
            if (Math.random() > 0.7) {
                this.simulateNewMessage();
            }
        }, 30000);
    },

    simulateNewMessage() {
        // Randomly select a conversation (not current)
        const otherConvs = this.conversations.filter(c => 
            !this.currentConversation || c.id !== this.currentConversation.id
        );
        
        if (otherConvs.length === 0) return;

        const randomConv = otherConvs[Math.floor(Math.random() * otherConvs.length)];
        randomConv.unreadCount++;
        randomConv.lastMessageTime = Date.now();
        
        this.saveConversations();
        this.renderConversationList();
    },

    destroy() {
        this.currentConversation = null;
    }
};
```
