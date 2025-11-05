// Broadcast Module
const Broadcast = {
    broadcasts: [],
    templates: [],
    selectedRecipients: [],

    init() {
        console.log('Broadcast module initialized');
        this.loadData();
        this.renderBroadcastList();
        this.renderTemplates();
        this.bindEvents();
    },

    loadData() {
        // Load broadcasts from localStorage
        const storedBroadcasts = Utils.storage.get('broadcasts');
        if (storedBroadcasts) {
            this.broadcasts = storedBroadcasts;
        } else {
            this.broadcasts = this.generateSampleBroadcasts();
            this.saveBroadcasts();
        }

        // Load templates from localStorage
        const storedTemplates = Utils.storage.get('broadcast_templates');
        if (storedTemplates) {
            this.templates = storedTemplates;
        } else {
            this.templates = this.generateSampleTemplates();
            this.saveTemplates();
        }
    },

    generateSampleBroadcasts() {
        return [
            {
                id: 'broadcast-001',
                name: '限時優惠通知',
                message: '🎉 限時優惠！全館商品8折起，活動只到本週日！立即搶購：https://example.com/sale',
                platform: 'all',
                recipients: 5240,
                sent: 5240,
                delivered: 5180,
                read: 3890,
                clicked: 1250,
                status: 'completed',
                scheduledAt: null,
                sentAt: Date.now() - (2 * 60 * 60 * 1000),
                createdAt: Date.now() - (3 * 60 * 60 * 1000)
            },
            {
                id: 'broadcast-002',
                name: '新品上市預告',
                message: '✨ 新品即將上市！iPhone 16 Pro Max 現正開放預購，首批限量優惠中！',
                platform: 'messenger',
                recipients: 3200,
                sent: 3200,
                delivered: 3150,
                read: 2400,
                clicked: 980,
                status: 'completed',
                scheduledAt: null,
                sentAt: Date.now() - (24 * 60 * 60 * 1000),
                createdAt: Date.now() - (25 * 60 * 60 * 1000)
            },
            {
                id: 'broadcast-003',
                name: '每週電子報',
                message: '📰 本週精選內容：\n1. 最新科技趨勢\n2. 產品使用技巧\n3. 客戶成功案例\n\n點擊查看更多：https://example.com/newsletter',
                platform: 'line',
                recipients: 2800,
                sent: 0,
                delivered: 0,
                read: 0,
                clicked: 0,
                status: 'scheduled',
                scheduledAt: Date.now() + (24 * 60 * 60 * 1000),
                sentAt: null,
                createdAt: Date.now() - (12 * 60 * 60 * 1000)
            },
            {
                id: 'broadcast-004',
                name: '會員專屬優惠',
                message: '💎 VIP會員專屬！享有額外95折優惠，使用優惠碼：VIP95',
                platform: 'instagram',
                recipients: 1547,
                sent: 0,
                delivered: 0,
                read: 0,
                clicked: 0,
                status: 'draft',
                scheduledAt: null,
                sentAt: null,
                createdAt: Date.now() - (6 * 60 * 60 * 1000)
            }
        ];
    },

    generateSampleTemplates() {
        return [
            {
                id: 'template-001',
                name: '歡迎新訂閱者',
                message: '👋 歡迎加入我們！感謝您的訂閱，我們將定期為您提供最新資訊和優惠活動。',
                category: '歡迎訊息'
            },
            {
                id: 'template-002',
                name: '訂單確認',
                message: '✅ 訂單已確認！您的訂單編號：{order_id}，預計 {delivery_date} 送達。',
                category: '交易通知'
            },
            {
                id: 'template-003',
                name: '促銷活動',
                message: '🎁 限時優惠！{product_name} 現正特價 {discount}% off！活動只到 {end_date}',
                category: '促銷訊息'
            },
            {
                id: 'template-004',
                name: '問卷調查',
                message: '📊 我們很重視您的意見！請花一分鐘填寫問卷，幫助我們提供更好的服務：{survey_link}',
                category: '互動訊息'
            },
            {
                id: 'template-005',
                name: '生日祝福',
                message: '🎂 生日快樂！{name}，祝您生日愉快！這是我們送給您的生日禮物：{gift_code}',
                category: '節慶訊息'
            }
        ];
    },

    saveBroadcasts() {
        Utils.storage.set('broadcasts', this.broadcasts);
    },

    saveTemplates() {
        Utils.storage.set('broadcast_templates', this.templates);
    },

    renderBroadcastList() {
        const container = document.getElementById('broadcastList');
        if (!container) return;

        if (this.broadcasts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-broadcast-tower"></i>
                    <h3>還沒有廣播訊息</h3>
                    <p>建立你的第一個廣播訊息，觸及所有訂閱者</p>
                    <button class="btn-primary" onclick="Broadcast.showCreateModal()">
                        <i class="fas fa-plus"></i>
                        建立廣播
                    </button>
                </div>
            `;
            return;
        }

        const broadcastCards = this.broadcasts.map(broadcast => {
            const platformInfo = this.getPlatformInfo(broadcast.platform);
            const statusInfo = this.getStatusInfo(broadcast.status);
            const dateText = this.getDateText(broadcast);

            let statsHTML = '';
            if (broadcast.status === 'completed') {
                const deliveryRate = ((broadcast.delivered / broadcast.sent) * 100).toFixed(1);
                const readRate = ((broadcast.read / broadcast.delivered) * 100).toFixed(1);
                const clickRate = ((broadcast.clicked / broadcast.read) * 100).toFixed(1);

                statsHTML = `
                    <div class="broadcast-stats">
                        <div class="broadcast-stat">
                            <i class="fas fa-paper-plane"></i>
                            <div>
                                <div class="stat-label">發送</div>
                                <div class="stat-value">${Utils.formatNumber(broadcast.sent)}</div>
                            </div>
                        </div>
                        <div class="broadcast-stat">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <div class="stat-label">送達率</div>
                                <div class="stat-value">${deliveryRate}%</div>
                            </div>
                        </div>
                        <div class="broadcast-stat">
                            <i class="fas fa-eye"></i>
                            <div>
                                <div class="stat-label">閱讀率</div>
                                <div class="stat-value">${readRate}%</div>
                            </div>
                        </div>
                        <div class="broadcast-stat">
                            <i class="fas fa-mouse-pointer"></i>
                            <div>
                                <div class="stat-label">點擊率</div>
                                <div class="stat-value">${clickRate}%</div>
                            </div>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="broadcast-card">
                    <div class="broadcast-header">
                        <div class="broadcast-title-section">
                            <h3 class="broadcast-name">${broadcast.name}</h3>
                            <div class="broadcast-meta">
                                <span class="broadcast-platform" style="color: ${platformInfo.color};">
                                    <i class="${platformInfo.icon}"></i>
                                    ${platformInfo.name}
                                </span>
                                <span class="broadcast-recipients">
                                    <i class="fas fa-users"></i>
                                    ${Utils.formatNumber(broadcast.recipients)} 收件者
                                </span>
                            </div>
                        </div>
                        <span class="broadcast-status status-${broadcast.status}">
                            <i class="${statusInfo.icon}"></i>
                            ${statusInfo.text}
                        </span>
                    </div>
                    
                    <div class="broadcast-message">${broadcast.message}</div>
                    
                    ${statsHTML}
                    
                    <div class="broadcast-footer">
                        <span class="broadcast-date">
                            <i class="far fa-clock"></i>
                            ${dateText}
                        </span>
                        <div class="broadcast-actions">
                            ${broadcast.status === 'draft' ? `
                                <button class="btn-primary btn-sm" onclick="Broadcast.sendBroadcast('${broadcast.id}')">
                                    <i class="fas fa-paper-plane"></i>
                                    發送
                                </button>
                                <button class="btn-secondary btn-sm" onclick="Broadcast.editBroadcast('${broadcast.id}')">
                                    <i class="fas fa-edit"></i>
                                    編輯
                                </button>
                            ` : ''}
                            ${broadcast.status === 'scheduled' ? `
                                <button class="btn-secondary btn-sm" onclick="Broadcast.editBroadcast('${broadcast.id}')">
                                    <i class="fas fa-edit"></i>
                                    編輯
                                </button>
                                <button class="btn-danger btn-sm" onclick="Broadcast.cancelBroadcast('${broadcast.id}')">
                                    <i class="fas fa-times"></i>
                                    取消
                                </button>
                            ` : ''}
                            ${broadcast.status === 'completed' ? `
                                <button class="btn-secondary btn-sm" onclick="Broadcast.viewAnalytics('${broadcast.id}')">
                                    <i class="fas fa-chart-bar"></i>
                                    詳細數據
                                </button>
                                <button class="btn-secondary btn-sm" onclick="Broadcast.duplicateBroadcast('${broadcast.id}')">
                                    <i class="fas fa-copy"></i>
                                    複製
                                </button>
                            ` : ''}
                            <button class="btn-icon btn-icon-danger" onclick="Broadcast.deleteBroadcast('${broadcast.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = broadcastCards;
    },

    renderTemplates() {
        const container = document.getElementById('templateList');
        if (!container) return;

        const templateCards = this.templates.map(template => `
            <div class="template-card" onclick="Broadcast.useTemplate('${template.id}')">
                <div class="template-header">
                    <h4 class="template-name">${template.name}</h4>
                    <span class="template-category">${template.category}</span>
                </div>
                <p class="template-message">${template.message}</p>
                <button class="btn-primary btn-sm btn-block">
                    <i class="fas fa-magic"></i>
                    使用此範本
                </button>
            </div>
        `).join('');

        container.innerHTML = templateCards;
    },

    getPlatformInfo(platform) {
        const platforms = {
            all: {
                name: '所有平台',
                icon: 'fas fa-globe',
                color: '#6b7280'
            },
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
        return platforms[platform] || platforms.all;
    },

    getStatusInfo(status) {
        const statuses = {
            draft: { text: '草稿', icon: 'fas fa-file' },
            scheduled: { text: '已排程', icon: 'fas fa-clock' },
            sending: { text: '發送中', icon: 'fas fa-spinner fa-spin' },
            completed: { text: '已完成', icon: 'fas fa-check-circle' },
            failed: { text: '失敗', icon: 'fas fa-exclamation-circle' }
        };
        return statuses[status] || statuses.draft;
    },

    getDateText(broadcast) {
        if (broadcast.status === 'scheduled' && broadcast.scheduledAt) {
            return '排程於 ' + new Date(broadcast.scheduledAt).toLocaleString('zh-TW');
        }
        if (broadcast.status === 'completed' && broadcast.sentAt) {
            return '已發送於 ' + new Date(broadcast.sentAt).toLocaleString('zh-TW');
        }
        return '建立於 ' + new Date(broadcast.createdAt).toLocaleString('zh-TW');
    },

    bindEvents() {
        // Create broadcast button
        const createBtn = document.getElementById('createBroadcastBtn');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.showCreateModal());
        }
    },

    showCreateModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2><i class="fas fa-broadcast-tower"></i> 建立廣播訊息</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>廣播名稱</label>
                        <input type="text" id="newBroadcastName" class="form-control" placeholder="例如：週年慶促銷通知">
                    </div>
                    
                    <div class="form-group">
                        <label>選擇平台</label>
                        <select id="newBroadcastPlatform" class="form-control">
                            <option value="all">所有平台</option>
                            <option value="messenger">Facebook Messenger</option>
                            <option value="line">LINE</option>
                            <option value="instagram">Instagram</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>訊息內容</label>
                        <textarea id="newBroadcastMessage" class="form-control" rows="6" placeholder="輸入要發送的訊息內容..."></textarea>
                        <small class="form-text">提示：可以使用 emoji 和換行讓訊息更生動</small>
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="scheduleBroadcast">
                            排程發送
                        </label>
                    </div>
                    
                    <div class="form-group" id="scheduleTimeGroup" style="display: none;">
                        <label>發送時間</label>
                        <input type="datetime-local" id="scheduleTime" class="form-control">
                    </div>
                    
                    <div class="broadcast-preview">
                        <h4>預覽</h4>
                        <div class="message-preview" id="messagePreview">
                            <div class="preview-bubble">輸入訊息內容以查看預覽</div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">取消</button>
                    <button class="btn-secondary" onclick="Broadcast.saveDraft()">
                        <i class="fas fa-save"></i>
                        儲存草稿
                    </button>
                    <button class="btn-primary" onclick="Broadcast.createBroadcast()">
                        <i class="fas fa-paper-plane"></i>
                        立即發送
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Schedule checkbox toggle
        const scheduleCheckbox = document.getElementById('scheduleBroadcast');
        const scheduleTimeGroup = document.getElementById('scheduleTimeGroup');
        scheduleCheckbox.addEventListener('change', function() {
            scheduleTimeGroup.style.display = this.checked ? 'block' : 'none';
        });

        // Message preview
        const messageTextarea = document.getElementById('newBroadcastMessage');
        const messagePreview = document.getElementById('messagePreview');
        messageTextarea.addEventListener('input', function() {
            const text = this.value.trim();
            if (text) {
                messagePreview.innerHTML = `<div class="preview-bubble">${text.replace(/\n/g, '<br>')}</div>`;
            } else {
                messagePreview.innerHTML = `<div class="preview-bubble">輸入訊息內容以查看預覽</div>`;
            }
        });
    },

    createBroadcast() {
        const name = document.getElementById('newBroadcastName').value.trim();
        const platform = document.getElementById('newBroadcastPlatform').value;
        const message = document.getElementById('newBroadcastMessage').value.trim();
        const isScheduled = document.getElementById('scheduleBroadcast').checked;
        const scheduleTime = isScheduled ? document.getElementById('scheduleTime').value : null;

        if (!name) {
            Utils.showToast('請輸入廣播名稱', 'error');
            return;
        }

        if (!message) {
            Utils.showToast('請輸入訊息內容', 'error');
            return;
        }

        if (isScheduled && !scheduleTime) {
            Utils.showToast('請選擇發送時間', 'error');
            return;
        }

        // Calculate recipients based on platform
        const recipients = this.calculateRecipients(platform);

        const newBroadcast = {
            id: 'broadcast-' + Date.now(),
            name: name,
            message: message,
            platform: platform,
            recipients: recipients,
            sent: isScheduled ? 0 : recipients,
            delivered: isScheduled ? 0 : Math.floor(recipients * 0.98),
            read: 0,
            clicked: 0,
            status: isScheduled ? 'scheduled' : 'completed',
            scheduledAt: isScheduled ? new Date(scheduleTime).getTime() : null,
            sentAt: isScheduled ? null : Date.now(),
            createdAt: Date.now()
        };

        // Simulate read and click stats for completed broadcasts
        if (!isScheduled) {
            setTimeout(() => {
                newBroadcast.read = Math.floor(newBroadcast.delivered * 0.65);
                newBroadcast.clicked = Math.floor(newBroadcast.read * 0.25);
                this.saveBroadcasts();
                this.renderBroadcastList();
            }, 2000);
        }

        this.broadcasts.unshift(newBroadcast);
        this.saveBroadcasts();
        this.renderBroadcastList();

        document.querySelector('.modal-overlay').remove();
        
        if (isScheduled) {
            Utils.showToast('廣播已排程', 'success');
        } else {
            Utils.showToast('廣播發送中...', 'info');
        }
    },

    saveDraft() {
        const name = document.getElementById('newBroadcastName').value.trim();
        const platform = document.getElementById('newBroadcastPlatform').value;
        const message = document.getElementById('newBroadcastMessage').value.trim();

        if (!name) {
            Utils.showToast('請輸入廣播名稱', 'error');
            return;
        }

        const recipients = this.calculateRecipients(platform);

        const newBroadcast = {
            id: 'broadcast-' + Date.now(),
            name: name,
            message: message || '(未填寫內容)',
            platform: platform,
            recipients: recipients,
            sent: 0,
            delivered: 0,
            read: 0,
            clicked: 0,
            status: 'draft',
            scheduledAt: null,
            sentAt: null,
            createdAt: Date.now()
        };

        this.broadcasts.unshift(newBroadcast);
        this.saveBroadcasts();
        this.renderBroadcastList();

        document.querySelector('.modal-overlay').remove();
        Utils.showToast('草稿已儲存', 'success');
    },

    calculateRecipients(platform) {
        // Simulate recipient count based on platform
        const counts = {
            all: 8547,
            messenger: 4200,
            line: 2800,
            instagram: 1547
        };
        return counts[platform] || counts.all;
    },

    editBroadcast(broadcastId) {
        const broadcast = this.broadcasts.find(b => b.id === broadcastId);
        if (!broadcast) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2><i class="fas fa-edit"></i> 編輯廣播訊息</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>廣播名稱</label>
                        <input type="text" id="editBroadcastName" class="form-control" value="${broadcast.name}">
                    </div>
                    
                    <div class="form-group">
                        <label>選擇平台</label>
                        <select id="editBroadcastPlatform" class="form-control">
                            <option value="all" ${broadcast.platform === 'all' ? 'selected' : ''}>所有平台</option>
                            <option value="messenger" ${broadcast.platform === 'messenger' ? 'selected' : ''}>Facebook Messenger</option>
                            <option value="line" ${broadcast.platform === 'line' ? 'selected' : ''}>LINE</option>
                            <option value="instagram" ${broadcast.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>訊息內容</label>
                        <textarea id="editBroadcastMessage" class="form-control" rows="6">${broadcast.message}</textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">取消</button>
                    <button class="btn-primary" onclick="Broadcast.saveEdit('${broadcastId}')">
                        <i class="fas fa-save"></i>
                        儲存變更
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    saveEdit(broadcastId) {
        const broadcast = this.broadcasts.find(b => b.id === broadcastId);
        if (!broadcast) return;

        broadcast.name = document.getElementById('editBroadcastName').value.trim();
        broadcast.platform = document.getElementById('editBroadcastPlatform').value;
        broadcast.message = document.getElementById('editBroadcastMessage').value.trim();
        broadcast.recipients = this.calculateRecipients(broadcast.platform);

        this.saveBroadcasts();
        this.renderBroadcastList();

        document.querySelector('.modal-overlay').remove();
        Utils.showToast('廣播已更新', 'success');
    },

    sendBroadcast(broadcastId) {
        const broadcast = this.broadcasts.find(b => b.id === broadcastId);
        if (!broadcast) return;

        if (!confirm(`確定要發送廣播「${broadcast.name}」給 ${Utils.formatNumber(broadcast.recipients)} 位收件者嗎？`)) {
            return;
        }

        broadcast.status = 'completed';
        broadcast.sent = broadcast.recipients;
        broadcast.delivered = Math.floor(broadcast.recipients * 0.98);
        broadcast.sentAt = Date.now();

        // Simulate read and click stats
        setTimeout(() => {
            broadcast.read = Math.floor(broadcast.delivered * 0.65);
            broadcast.clicked = Math.floor(broadcast.read * 0.25);
            this.saveBroadcasts();
            this.renderBroadcastList();
        }, 2000);

        this.saveBroadcasts();
        this.renderBroadcastList();

        Utils.showToast('廣播發送中...', 'info');
    },

    cancelBroadcast(broadcastId) {
        const broadcast = this.broadcasts.find(b => b.id === broadcastId);
        if (!broadcast) return;

        if (!confirm(`確定要取消排程的廣播「${broadcast.name}」嗎？`)) {
            return;
        }

        broadcast.status = 'draft';
        broadcast.scheduledAt = null;

        this.saveBroadcasts();
        this.renderBroadcastList();

        Utils.showToast('排程已取消', 'success');
    },

    duplicateBroadcast(broadcastId) {
        const broadcast = this.broadcasts.find(b => b.id === broadcastId);
        if (!broadcast) return;

        const newBroadcast = {
            ...broadcast,
            id: 'broadcast-' + Date.now(),
            name: broadcast.name + ' (副本)',
            status: 'draft',
            sent: 0,
            delivered: 0,
            read: 0,
            clicked: 0,
            scheduledAt: null,
            sentAt: null,
            createdAt: Date.now()
        };

        this.broadcasts.unshift(newBroadcast);
        this.saveBroadcasts();
        this.renderBroadcastList();

        Utils.showToast('廣播已複製', 'success');
    },

    deleteBroadcast(broadcastId) {
        const broadcast = this.broadcasts.find(b => b.id === broadcastId);
        if (!broadcast) return;

        if (!confirm(`確定要刪除廣播「${broadcast.name}」嗎？此操作無法復原。`)) {
            return;
        }

        this.broadcasts = this.broadcasts.filter(b => b.id !== broadcastId);
        this.saveBroadcasts();
        this.renderBroadcastList();

        Utils.showToast('廣播已刪除', 'success');
    },

    viewAnalytics(broadcastId) {
        const broadcast = this.broadcasts.find(b => b.id === broadcastId);
        if (!broadcast) return;

        Utils.showToast(`正在載入「${broadcast.name}」的詳細數據...`, 'info');
        setTimeout(() => {
            App.loadPage('analytics');
        }, 500);
    },

    useTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return;

        document.getElementById('newBroadcastName').value = template.name;
        document.getElementById('newBroadcastMessage').value = template.message;
        
        // Trigger preview update
        const event = new Event('input');
        document.getElementById('newBroadcastMessage').dispatchEvent(event);

        Utils.showToast('範本已套用', 'success');
    },

    destroy() {
        // Cleanup if needed
    }
};
