// Chatbot Management Module
const Chatbot = {
    chatbots: [],
    currentChatbot: null,
    editMode: false,

    init() {
        console.log('Chatbot module initialized');
        this.loadChatbots();
        this.renderChatbotList();
        this.bindEvents();
    },

    loadChatbots() {
        // Load chatbots from localStorage
        const stored = Utils.storage.get('chatbots');
        if (stored) {
            this.chatbots = stored;
        } else {
            // Initialize with sample data
            this.chatbots = [
                {
                    id: 'bot-001',
                    name: '客服助手 Pro',
                    platform: 'messenger',
                    status: 'active',
                    subscribers: 3200,
                    messages: 18500,
                    createdAt: new Date('2024-10-15').getTime(),
                    description: '24小時自動回覆客戶問題',
                    avatar: '🤖'
                },
                {
                    id: 'bot-002',
                    name: '購物小幫手',
                    platform: 'line',
                    status: 'active',
                    subscribers: 2800,
                    messages: 15200,
                    createdAt: new Date('2024-10-20').getTime(),
                    description: '協助客戶完成購物流程',
                    avatar: '🛍️'
                },
                {
                    id: 'bot-003',
                    name: 'Instagram 互動機器人',
                    platform: 'instagram',
                    status: 'inactive',
                    subscribers: 1547,
                    messages: 8900,
                    createdAt: new Date('2024-11-01').getTime(),
                    description: '自動回覆 IG 私訊和留言',
                    avatar: '📸'
                },
                {
                    id: 'bot-004',
                    name: '預約助理',
                    platform: 'messenger',
                    status: 'active',
                    subscribers: 980,
                    messages: 5600,
                    createdAt: new Date('2024-11-03').getTime(),
                    description: '自動化預約管理系統',
                    avatar: '📅'
                }
            ];
            this.saveChatbots();
        }
    },

    saveChatbots() {
        Utils.storage.set('chatbots', this.chatbots);
    },

    renderChatbotList() {
        const container = document.getElementById('chatbotList');
        if (!container) return;

        if (this.chatbots.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-robot"></i>
                    <h3>還沒有聊天機器人</h3>
                    <p>建立你的第一個聊天機器人開始自動化客戶服務</p>
                    <button class="btn-primary" onclick="Chatbot.showCreateModal()">
                        <i class="fas fa-plus"></i>
                        建立機器人
                    </button>
                </div>
            `;
            return;
        }

        const chatbotCards = this.chatbots.map(bot => {
            const platformInfo = this.getPlatformInfo(bot.platform);
            const statusClass = bot.status === 'active' ? 'status-active' : 'status-inactive';
            const statusText = bot.status === 'active' ? '運作中' : '已停用';

            return `
                <div class="chatbot-card" data-bot-id="${bot.id}">
                    <div class="chatbot-card-header">
                        <div class="chatbot-avatar">${bot.avatar}</div>
                        <div class="chatbot-info">
                            <h3 class="chatbot-name">${bot.name}</h3>
                            <div class="chatbot-platform">
                                <i class="${platformInfo.icon}" style="color: ${platformInfo.color};"></i>
                                ${platformInfo.name}
                            </div>
                        </div>
                        <span class="chatbot-status ${statusClass}">${statusText}</span>
                    </div>
                    
                    <p class="chatbot-description">${bot.description}</p>
                    
                    <div class="chatbot-stats">
                        <div class="chatbot-stat-item">
                            <i class="fas fa-users"></i>
                            <div class="chatbot-stat-info">
                                <div class="chatbot-stat-label">訂閱者</div>
                                <div class="chatbot-stat-value">${Utils.formatNumber(bot.subscribers)}</div>
                            </div>
                        </div>
                        <div class="chatbot-stat-item">
                            <i class="fas fa-comment-dots"></i>
                            <div class="chatbot-stat-info">
                                <div class="chatbot-stat-label">訊息數</div>
                                <div class="chatbot-stat-value">${Utils.formatNumber(bot.messages)}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chatbot-actions">
                        <button class="btn-secondary btn-sm" onclick="Chatbot.editBot('${bot.id}')">
                            <i class="fas fa-edit"></i>
                            編輯
                        </button>
                        <button class="btn-secondary btn-sm" onclick="Chatbot.viewAnalytics('${bot.id}')">
                            <i class="fas fa-chart-bar"></i>
                            數據
                        </button>
                        <button class="btn-secondary btn-sm" onclick="Chatbot.toggleStatus('${bot.id}')">
                            <i class="fas fa-power-off"></i>
                            ${bot.status === 'active' ? '停用' : '啟用'}
                        </button>
                        <button class="btn-danger btn-sm" onclick="Chatbot.deleteBot('${bot.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = chatbotCards;
    },

    getPlatformInfo(platform) {
        const platforms = {
            messenger: {
                name: 'Facebook Messenger',
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

    bindEvents() {
        // Create new chatbot button
        const createBtn = document.getElementById('createChatbotBtn');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.showCreateModal());
        }

        // Search chatbots
        const searchInput = document.getElementById('chatbotSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchChatbots(e.target.value));
        }

        // Filter by platform
        const platformFilter = document.getElementById('platformFilter');
        if (platformFilter) {
            platformFilter.addEventListener('change', (e) => this.filterByPlatform(e.target.value));
        }

        // Filter by status
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => this.filterByStatus(e.target.value));
        }
    },

    showCreateModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-robot"></i> 建立新的聊天機器人</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>機器人名稱</label>
                        <input type="text" id="newBotName" class="form-control" placeholder="例如：客服助手">
                    </div>
                    
                    <div class="form-group">
                        <label>選擇平台</label>
                        <select id="newBotPlatform" class="form-control">
                            <option value="messenger">Facebook Messenger</option>
                            <option value="line">LINE</option>
                            <option value="instagram">Instagram</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>描述</label>
                        <textarea id="newBotDescription" class="form-control" rows="3" placeholder="描述這個機器人的功能..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>選擇頭像</label>
                        <div class="avatar-picker">
                            <button class="avatar-option" data-avatar="🤖">🤖</button>
                            <button class="avatar-option" data-avatar="💬">💬</button>
                            <button class="avatar-option" data-avatar="🛍️">🛍️</button>
                            <button class="avatar-option" data-avatar="📸">📸</button>
                            <button class="avatar-option" data-avatar="📅">📅</button>
                            <button class="avatar-option" data-avatar="🎯">🎯</button>
                            <button class="avatar-option" data-avatar="✨">✨</button>
                            <button class="avatar-option" data-avatar="🚀">🚀</button>
                        </div>
                        <input type="hidden" id="newBotAvatar" value="🤖">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">取消</button>
                    <button class="btn-primary" onclick="Chatbot.createBot()">
                        <i class="fas fa-plus"></i>
                        建立機器人
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Avatar picker functionality
        modal.querySelectorAll('.avatar-option').forEach(btn => {
            btn.addEventListener('click', function() {
                modal.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                document.getElementById('newBotAvatar').value = this.dataset.avatar;
            });
        });

        // Set first avatar as active
        modal.querySelector('.avatar-option').classList.add('active');
    },

    createBot() {
        const name = document.getElementById('newBotName').value.trim();
        const platform = document.getElementById('newBotPlatform').value;
        const description = document.getElementById('newBotDescription').value.trim();
        const avatar = document.getElementById('newBotAvatar').value;

        if (!name) {
            Utils.showToast('請輸入機器人名稱', 'error');
            return;
        }

        const newBot = {
            id: 'bot-' + Date.now(),
            name: name,
            platform: platform,
            status: 'active',
            subscribers: 0,
            messages: 0,
            createdAt: Date.now(),
            description: description || '新建立的聊天機器人',
            avatar: avatar
        };

        this.chatbots.unshift(newBot);
        this.saveChatbots();
        this.renderChatbotList();

        document.querySelector('.modal-overlay').remove();
        Utils.showToast('聊天機器人建立成功！', 'success');
    },

    editBot(botId) {
        const bot = this.chatbots.find(b => b.id === botId);
        if (!bot) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-edit"></i> 編輯聊天機器人</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>機器人名稱</label>
                        <input type="text" id="editBotName" class="form-control" value="${bot.name}">
                    </div>
                    
                    <div class="form-group">
                        <label>描述</label>
                        <textarea id="editBotDescription" class="form-control" rows="3">${bot.description}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>選擇頭像</label>
                        <div class="avatar-picker">
                            <button class="avatar-option ${bot.avatar === '🤖' ? 'active' : ''}" data-avatar="🤖">🤖</button>
                            <button class="avatar-option ${bot.avatar === '💬' ? 'active' : ''}" data-avatar="💬">💬</button>
                            <button class="avatar-option ${bot.avatar === '🛍️' ? 'active' : ''}" data-avatar="🛍️">🛍️</button>
                            <button class="avatar-option ${bot.avatar === '📸' ? 'active' : ''}" data-avatar="📸">📸</button>
                            <button class="avatar-option ${bot.avatar === '📅' ? 'active' : ''}" data-avatar="📅">📅</button>
                            <button class="avatar-option ${bot.avatar === '🎯' ? 'active' : ''}" data-avatar="🎯">🎯</button>
                            <button class="avatar-option ${bot.avatar === '✨' ? 'active' : ''}" data-avatar="✨">✨</button>
                            <button class="avatar-option ${bot.avatar === '🚀' ? 'active' : ''}" data-avatar="🚀">🚀</button>
                        </div>
                        <input type="hidden" id="editBotAvatar" value="${bot.avatar}">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">取消</button>
                    <button class="btn-primary" onclick="Chatbot.saveEdit('${botId}')">
                        <i class="fas fa-save"></i>
                        儲存變更
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Avatar picker functionality
        modal.querySelectorAll('.avatar-option').forEach(btn => {
            btn.addEventListener('click', function() {
                modal.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                document.getElementById('editBotAvatar').value = this.dataset.avatar;
            });
        });
    },

    saveEdit(botId) {
        const bot = this.chatbots.find(b => b.id === botId);
        if (!bot) return;

        const name = document.getElementById('editBotName').value.trim();
        const description = document.getElementById('editBotDescription').value.trim();
        const avatar = document.getElementById('editBotAvatar').value;

        if (!name) {
            Utils.showToast('請輸入機器人名稱', 'error');
            return;
        }

        bot.name = name;
        bot.description = description;
        bot.avatar = avatar;

        this.saveChatbots();
        this.renderChatbotList();

        document.querySelector('.modal-overlay').remove();
        Utils.showToast('變更已儲存', 'success');
    },

    toggleStatus(botId) {
        const bot = this.chatbots.find(b => b.id === botId);
        if (!bot) return;

        bot.status = bot.status === 'active' ? 'inactive' : 'active';
        this.saveChatbots();
        this.renderChatbotList();

        const statusText = bot.status === 'active' ? '已啟用' : '已停用';
        Utils.showToast(`機器人${statusText}`, 'success');
    },

    deleteBot(botId) {
        const bot = this.chatbots.find(b => b.id === botId);
        if (!bot) return;

        if (!confirm(`確定要刪除「${bot.name}」嗎？此操作無法復原。`)) {
            return;
        }

        this.chatbots = this.chatbots.filter(b => b.id !== botId);
        this.saveChatbots();
        this.renderChatbotList();

        Utils.showToast('機器人已刪除', 'success');
    },

    viewAnalytics(botId) {
        const bot = this.chatbots.find(b => b.id === botId);
        if (!bot) return;

        Utils.showToast(`正在載入「${bot.name}」的數據分析...`, 'info');
        setTimeout(() => {
            App.loadPage('analytics');
        }, 500);
    },

    searchChatbots(query) {
        const cards = document.querySelectorAll('.chatbot-card');
        const searchTerm = query.toLowerCase();

        cards.forEach(card => {
            const botId = card.dataset.botId;
            const bot = this.chatbots.find(b => b.id === botId);
            
            if (bot) {
                const matchesSearch = bot.name.toLowerCase().includes(searchTerm) ||
                                    bot.description.toLowerCase().includes(searchTerm);
                card.style.display = matchesSearch ? 'block' : 'none';
            }
        });
    },

    filterByPlatform(platform) {
        const cards = document.querySelectorAll('.chatbot-card');

        cards.forEach(card => {
            const botId = card.dataset.botId;
            const bot = this.chatbots.find(b => b.id === botId);
            
            if (bot) {
                const matchesPlatform = platform === 'all' || bot.platform === platform;
                card.style.display = matchesPlatform ? 'block' : 'none';
            }
        });
    },

    filterByStatus(status) {
        const cards = document.querySelectorAll('.chatbot-card');

        cards.forEach(card => {
            const botId = card.dataset.botId;
            const bot = this.chatbots.find(b => b.id === botId);
            
            if (bot) {
                const matchesStatus = status === 'all' || bot.status === status;
                card.style.display = matchesStatus ? 'block' : 'none';
            }
        });
    },

    destroy() {
        // Cleanup if needed
        this.currentChatbot = null;
    }
};
