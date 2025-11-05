// Settings Module
const Settings = {
    settings: {},
    currentSection: 'profile',

    init() {
        console.log('Settings module initialized');
        this.loadSettings();
        this.renderSettings();
        this.bindEvents();
    },

    loadSettings() {
        // Load settings from localStorage
        const stored = Utils.storage.get('app_settings');
        if (stored) {
            this.settings = stored;
        } else {
            // Initialize default settings
            this.settings = {
                profile: {
                    companyName: 'ilovem2444',
                    email: 'admin@ilovem2444.com',
                    phone: '0912-345-678',
                    address: '台北市信義區信義路五段7號',
                    website: 'https://ilovem2444.com',
                    timezone: 'Asia/Taipei',
                    language: 'zh-TW'
                },
                notifications: {
                    emailNotifications: true,
                    pushNotifications: true,
                    smsNotifications: false,
                    newMessageAlert: true,
                    dailyReport: true,
                    weeklyReport: true,
                    systemUpdates: true
                },
                chatbot: {
                    autoReply: true,
                    replyDelay: 2,
                    workingHours: {
                        enabled: true,
                        start: '09:00',
                        end: '18:00'
                    },
                    offlineMessage: '您好！我們目前不在線上，但會盡快回覆您的訊息。',
                    welcomeMessage: '您好！歡迎使用我們的服務，有什麼可以幫助您的嗎？'
                },
                integration: {
                    facebookConnected: true,
                    lineConnected: true,
                    instagramConnected: false,
                    googleAnalytics: false,
                    zapier: false
                },
                security: {
                    twoFactorAuth: false,
                    sessionTimeout: 30,
                    ipWhitelist: false,
                    apiAccess: true
                },
                billing: {
                    plan: 'Professional',
                    price: 1999,
                    billingCycle: 'monthly',
                    nextBillingDate: '2025-01-05',
                    paymentMethod: 'Credit Card ****1234'
                }
            };
            this.saveSettings();
        }
    },

    saveSettings() {
        Utils.storage.set('app_settings', this.settings);
    },

    renderSettings() {
        this.renderProfileSettings();
        this.renderNotificationSettings();
        this.renderChatbotSettings();
        this.renderIntegrationSettings();
        this.renderSecuritySettings();
        this.renderBillingSettings();
    },

    renderProfileSettings() {
        const profile = this.settings.profile;

        document.getElementById('companyName').value = profile.companyName;
        document.getElementById('companyEmail').value = profile.email;
        document.getElementById('companyPhone').value = profile.phone;
        document.getElementById('companyAddress').value = profile.address;
        document.getElementById('companyWebsite').value = profile.website;
        document.getElementById('timezone').value = profile.timezone;
        document.getElementById('language').value = profile.language;
    },

    renderNotificationSettings() {
        const notif = this.settings.notifications;

        document.getElementById('emailNotifications').checked = notif.emailNotifications;
        document.getElementById('pushNotifications').checked = notif.pushNotifications;
        document.getElementById('smsNotifications').checked = notif.smsNotifications;
        document.getElementById('newMessageAlert').checked = notif.newMessageAlert;
        document.getElementById('dailyReport').checked = notif.dailyReport;
        document.getElementById('weeklyReport').checked = notif.weeklyReport;
        document.getElementById('systemUpdates').checked = notif.systemUpdates;
    },

    renderChatbotSettings() {
        const chatbot = this.settings.chatbot;

        document.getElementById('autoReply').checked = chatbot.autoReply;
        document.getElementById('replyDelay').value = chatbot.replyDelay;
        document.getElementById('workingHoursEnabled').checked = chatbot.workingHours.enabled;
        document.getElementById('workingHoursStart').value = chatbot.workingHours.start;
        document.getElementById('workingHoursEnd').value = chatbot.workingHours.end;
        document.getElementById('offlineMessage').value = chatbot.offlineMessage;
        document.getElementById('welcomeMessage').value = chatbot.welcomeMessage;
    },

    renderIntegrationSettings() {
        const integration = this.settings.integration;

        const container = document.getElementById('integrationList');
        if (!container) return;

        container.innerHTML = `
            <div class="integration-item">
                <div class="integration-info">
                    <i class="fab fa-facebook" style="color: #1877f2;"></i>
                    <div>
                        <h4>Facebook Messenger</h4>
                        <p>連接 Facebook 粉絲專頁接收訊息</p>
                    </div>
                </div>
                <button class="btn-${integration.facebookConnected ? 'danger' : 'primary'}" 
                        onclick="Settings.toggleIntegration('facebook')">
                    ${integration.facebookConnected ? '中斷連接' : '連接'}
                </button>
            </div>

            <div class="integration-item">
                <div class="integration-info">
                    <i class="fab fa-line" style="color: #00c300;"></i>
                    <div>
                        <h4>LINE Official Account</h4>
                        <p>連接 LINE 官方帳號接收訊息</p>
                    </div>
                </div>
                <button class="btn-${integration.lineConnected ? 'danger' : 'primary'}" 
                        onclick="Settings.toggleIntegration('line')">
                    ${integration.lineConnected ? '中斷連接' : '連接'}
                </button>
            </div>

            <div class="integration-item">
                <div class="integration-info">
                    <i class="fab fa-instagram" style="color: #e4405f;"></i>
                    <div>
                        <h4>Instagram Business</h4>
                        <p>連接 Instagram 商業帳號接收訊息</p>
                    </div>
                </div>
                <button class="btn-${integration.instagramConnected ? 'danger' : 'primary'}" 
                        onclick="Settings.toggleIntegration('instagram')">
                    ${integration.instagramConnected ? '中斷連接' : '連接'}
                </button>
            </div>

            <div class="integration-item">
                <div class="integration-info">
                    <i class="fab fa-google" style="color: #4285f4;"></i>
                    <div>
                        <h4>Google Analytics</h4>
                        <p>追蹤網站流量和用戶行為</p>
                    </div>
                </div>
                <button class="btn-${integration.googleAnalytics ? 'danger' : 'primary'}" 
                        onclick="Settings.toggleIntegration('googleAnalytics')">
                    ${integration.googleAnalytics ? '中斷連接' : '連接'}
                </button>
            </div>

            <div class="integration-item">
                <div class="integration-info">
                    <i class="fas fa-bolt" style="color: #ff4a00;"></i>
                    <div>
                        <h4>Zapier</h4>
                        <p>自動化工作流程與其他應用程式整合</p>
                    </div>
                </div>
                <button class="btn-${integration.zapier ? 'danger' : 'primary'}" 
                        onclick="Settings.toggleIntegration('zapier')">
                    ${integration.zapier ? '中斷連接' : '連接'}
                </button>
            </div>
        `;
    },

    renderSecuritySettings() {
        const security = this.settings.security;

        document.getElementById('twoFactorAuth').checked = security.twoFactorAuth;
        document.getElementById('sessionTimeout').value = security.sessionTimeout;
        document.getElementById('ipWhitelist').checked = security.ipWhitelist;
        document.getElementById('apiAccess').checked = security.apiAccess;
    },

    renderBillingSettings() {
        const billing = this.settings.billing;

        const container = document.getElementById('billingInfo');
        if (!container) return;

        container.innerHTML = `
            <div class="billing-current-plan">
                <div class="plan-header">
                    <div>
                        <h3>${billing.plan} 方案</h3>
                        <p class="plan-price">${Utils.formatCurrency(billing.price)} / ${billing.billingCycle === 'monthly' ? '月' : '年'}</p>
                    </div>
                    <span class="plan-badge">目前方案</span>
                </div>
                
                <div class="plan-features">
                    <div class="feature-item">
                        <i class="fas fa-check-circle"></i>
                        <span>無限制聊天機器人</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-check-circle"></i>
                        <span>100,000 則訊息 / 月</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-check-circle"></i>
                        <span>進階分析報告</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-check-circle"></i>
                        <span>優先客服支援</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-check-circle"></i>
                        <span>API 存取權限</span>
                    </div>
                </div>

                <div class="billing-details">
                    <div class="billing-detail-item">
                        <span class="detail-label">付款方式</span>
                        <span class="detail-value">${billing.paymentMethod}</span>
                    </div>
                    <div class="billing-detail-item">
                        <span class="detail-label">下次扣款日期</span>
                        <span class="detail-value">${billing.nextBillingDate}</span>
                    </div>
                </div>

                <div class="billing-actions">
                    <button class="btn-secondary" onclick="Settings.showUpgradePlans()">
                        <i class="fas fa-arrow-up"></i>
                        升級方案
                    </button>
                    <button class="btn-secondary" onclick="Settings.updatePaymentMethod()">
                        <i class="fas fa-credit-card"></i>
                        更新付款方式
                    </button>
                    <button class="btn-danger" onclick="Settings.cancelSubscription()">
                        <i class="fas fa-times"></i>
                        取消訂閱
                    </button>
                </div>
            </div>

            <div class="billing-history">
                <h3>帳單記錄</h3>
                <table class="billing-history-table">
                    <thead>
                        <tr>
                            <th>日期</th>
                            <th>描述</th>
                            <th>金額</th>
                            <th>狀態</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2024-12-05</td>
                            <td>Professional 方案 - 月費</td>
                            <td>${Utils.formatCurrency(1999)}</td>
                            <td><span class="status-badge status-active">已付款</span></td>
                            <td><button class="btn-icon" title="下載發票"><i class="fas fa-download"></i></button></td>
                        </tr>
                        <tr>
                            <td>2024-11-05</td>
                            <td>Professional 方案 - 月費</td>
                            <td>${Utils.formatCurrency(1999)}</td>
                            <td><span class="status-badge status-active">已付款</span></td>
                            <td><button class="btn-icon" title="下載發票"><i class="fas fa-download"></i></button></td>
                        </tr>
                        <tr>
                            <td>2024-10-05</td>
                            <td>Professional 方案 - 月費</td>
                            <td>${Utils.formatCurrency(1999)}</td>
                            <td><span class="status-badge status-active">已付款</span></td>
                            <td><button class="btn-icon" title="下載發票"><i class="fas fa-download"></i></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    },

    bindEvents() {
        // Save profile settings
        const saveProfileBtn = document.getElementById('saveProfileBtn');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => this.saveProfile());
        }

        // Save notification settings
        const saveNotificationsBtn = document.getElementById('saveNotificationsBtn');
        if (saveNotificationsBtn) {
            saveNotificationsBtn.addEventListener('click', () => this.saveNotifications());
        }

        // Save chatbot settings
        const saveChatbotBtn = document.getElementById('saveChatbotBtn');
        if (saveChatbotBtn) {
            saveChatbotBtn.addEventListener('click', () => this.saveChatbot());
        }

        // Save security settings
        const saveSecurityBtn = document.getElementById('saveSecurityBtn');
        if (saveSecurityBtn) {
            saveSecurityBtn.addEventListener('click', () => this.saveSecurity());
        }

        // Change password
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => this.showChangePasswordModal());
        }

        // Export data
        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportAllData());
        }

        // Delete account
        const deleteAccountBtn = document.getElementById('deleteAccountBtn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => this.deleteAccount());
        }
    },

    saveProfile() {
        this.settings.profile.companyName = document.getElementById('companyName').value.trim();
        this.settings.profile.email = document.getElementById('companyEmail').value.trim();
        this.settings.profile.phone = document.getElementById('companyPhone').value.trim();
        this.settings.profile.address = document.getElementById('companyAddress').value.trim();
        this.settings.profile.website = document.getElementById('companyWebsite').value.trim();
        this.settings.profile.timezone = document.getElementById('timezone').value;
        this.settings.profile.language = document.getElementById('language').value;

        this.saveSettings();
        Utils.showToast('個人資料已儲存', 'success');
    },

    saveNotifications() {
        this.settings.notifications.emailNotifications = document.getElementById('emailNotifications').checked;
        this.settings.notifications.pushNotifications = document.getElementById('pushNotifications').checked;
        this.settings.notifications.smsNotifications = document.getElementById('smsNotifications').checked;
        this.settings.notifications.newMessageAlert = document.getElementById('newMessageAlert').checked;
        this.settings.notifications.dailyReport = document.getElementById('dailyReport').checked;
        this.settings.notifications.weeklyReport = document.getElementById('weeklyReport').checked;
        this.settings.notifications.systemUpdates = document.getElementById('systemUpdates').checked;

        this.saveSettings();
        Utils.showToast('通知設定已儲存', 'success');
    },

    saveChatbot() {
        this.settings.chatbot.autoReply = document.getElementById('autoReply').checked;
        this.settings.chatbot.replyDelay = parseInt(document.getElementById('replyDelay').value);
        this.settings.chatbot.workingHours.enabled = document.getElementById('workingHoursEnabled').checked;
        this.settings.chatbot.workingHours.start = document.getElementById('workingHoursStart').value;
        this.settings.chatbot.workingHours.end = document.getElementById('workingHoursEnd').value;
        this.settings.chatbot.offlineMessage = document.getElementById('offlineMessage').value.trim();
        this.settings.chatbot.welcomeMessage = document.getElementById('welcomeMessage').value.trim();

        this.saveSettings();
        Utils.showToast('聊天機器人設定已儲存', 'success');
    },

    saveSecurity() {
        this.settings.security.twoFactorAuth = document.getElementById('twoFactorAuth').checked;
        this.settings.security.sessionTimeout = parseInt(document.getElementById('sessionTimeout').value);
        this.settings.security.ipWhitelist = document.getElementById('ipWhitelist').checked;
        this.settings.security.apiAccess = document.getElementById('apiAccess').checked;

        this.saveSettings();
        Utils.showToast('安全性設定已儲存', 'success');
    },

    toggleIntegration(platform) {
        const integrationKey = platform + (platform === 'facebook' || platform === 'line' || platform === 'instagram' ? 'Connected' : '');
        const currentStatus = this.settings.integration[integrationKey];

        this.settings.integration[integrationKey] = !currentStatus;
        this.saveSettings();
        this.renderIntegrationSettings();

        const statusText = this.settings.integration[integrationKey] ? '已連接' : '已中斷連接';
        Utils.showToast(`${platform} ${statusText}`, 'success');
    },

    showChangePasswordModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-key"></i> 變更密碼</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>目前密碼</label>
                        <input type="password" id="currentPassword" class="form-control" placeholder="輸入目前密碼">
                    </div>
                    <div class="form-group">
                        <label>新密碼</label>
                        <input type="password" id="newPassword" class="form-control" placeholder="輸入新密碼">
                    </div>
                    <div class="form-group">
                        <label>確認新密碼</label>
                        <input type="password" id="confirmPassword" class="form-control" placeholder="再次輸入新密碼">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">取消</button>
                    <button class="btn-primary" onclick="Settings.changePassword()">
                        <i class="fas fa-save"></i>
                        變更密碼
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            Utils.showToast('請填寫所有欄位', 'error');
            return;
        }

        if (!Utils.validatePassword(newPassword)) {
            Utils.showToast('密碼必須至少8個字元，包含大小寫字母和數字', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            Utils.showToast('新密碼與確認密碼不符', 'error');
            return;
        }

        // In real app, would verify current password against stored hash
        document.querySelector('.modal-overlay').remove();
        Utils.showToast('密碼已變更', 'success');
    },

    showUpgradePlans() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2><i class="fas fa-arrow-up"></i> 升級方案</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="pricing-plans">
                        <div class="pricing-plan">
                            <h3>Starter</h3>
                            <div class="plan-price">NT$499 <span>/ 月</span></div>
                            <ul class="plan-features">
                                <li><i class="fas fa-check"></i> 3 個聊天機器人</li>
                                <li><i class="fas fa-check"></i> 10,000 則訊息 / 月</li>
                                <li><i class="fas fa-check"></i> 基本分析報告</li>
                                <li><i class="fas fa-check"></i> Email 客服支援</li>
                            </ul>
                            <button class="btn-secondary btn-block">選擇方案</button>
                        </div>

                        <div class="pricing-plan featured">
                            <div class="plan-badge">目前方案</div>
                            <h3>Professional</h3>
                            <div class="plan-price">NT$1,999 <span>/ 月</span></div>
                            <ul class="plan-features">
                                <li><i class="fas fa-check"></i> 無限制聊天機器人</li>
                                <li><i class="fas fa-check"></i> 100,000 則訊息 / 月</li>
                                <li><i class="fas fa-check"></i> 進階分析報告</li>
                                <li><i class="fas fa-check"></i> 優先客服支援</li>
                                <li><i class="fas fa-check"></i> API 存取權限</li>
                            </ul>
                            <button class="btn-primary btn-block" disabled>目前方案</button>
                        </div>

                        <div class="pricing-plan">
                            <h3>Enterprise</h3>
                            <div class="plan-price">NT$4,999 <span>/ 月</span></div>
                            <ul class="plan-features">
                                <li><i class="fas fa-check"></i> 無限制一切</li>
                                <li><i class="fas fa-check"></i> 無限則訊息</li>
                                <li><i class="fas fa-check"></i> 客製化功能</li>
                                <li><i class="fas fa-check"></i> 專屬客服經理</li>
                                <li><i class="fas fa-check"></i> SLA 保證</li>
                                <li><i class="fas fa-check"></i> 白標服務</li>
                            </ul>
                            <button class="btn-primary btn-block">升級</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    updatePaymentMethod() {
        Utils.showToast('正在開啟付款方式更新頁面...', 'info');
        // In real app, would redirect to payment gateway
    },

    cancelSubscription() {
        if (!confirm('確定要取消訂閱嗎？取消後將無法使用進階功能。')) {
            return;
        }

        Utils.showToast('訂閱已取消，將在本期結束後生效', 'success');
    },

    exportAllData() {
        Utils.showToast('正在準備匯出資料...', 'info');

        setTimeout(() => {
            const allData = {
                settings: this.settings,
                chatbots: Utils.storage.get('chatbots'),
                users: Utils.storage.get('users'),
                conversations: Utils.storage.get('conversations'),
                broadcasts: Utils.storage.get('broadcasts'),
                products: Utils.storage.get('products'),
                orders: Utils.storage.get('orders')
            };

            const dataStr = JSON.stringify(allData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `ilovem2444_data_export_${Date.now()}.json`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Utils.showToast('資料已匯出', 'success');
        }, 1500);
    },

    deleteAccount() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 style="color: #ef4444;"><i class="fas fa-exclamation-triangle"></i> 刪除帳號</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p style="color: #ef4444; font-weight: 600; margin-bottom: 16px;">
                        ⚠️ 警告：此操作無法復原！
                    </p>
                    <p style="margin-bottom: 16px;">
                        刪除帳號將會：
                    </p>
                    <ul style="margin-bottom: 16px; padding-left: 20px;">
                        <li>永久刪除所有聊天機器人</li>
                        <li>永久刪除所有用戶資料</li>
                        <li>永久刪除所有對話記錄</li>
                        <li>取消所有訂閱服務</li>
                    </ul>
                    <div class="form-group">
                        <label>請輸入 "DELETE" 確認刪除</label>
                        <input type="text" id="deleteConfirmation" class="form-control" placeholder="輸入 DELETE">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">取消</button>
                    <button class="btn-danger" onclick="Settings.confirmDeleteAccount()">
                        <i class="fas fa-trash"></i>
                        確認刪除帳號
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    confirmDeleteAccount() {
        const confirmation = document.getElementById('deleteConfirmation').value;

        if (confirmation !== 'DELETE') {
            Utils.showToast('請輸入 "DELETE" 確認刪除', 'error');
            return;
        }

        // Clear all data
        Utils.storage.clear();
        
        document.querySelector('.modal-overlay').remove();
        Utils.showToast('帳號已刪除', 'success');

        // Redirect to login after 2 seconds
        setTimeout(() => {
            Auth.showLogin();
        }, 2000);
    },

    destroy() {
        // Cleanup if needed
    }
};

