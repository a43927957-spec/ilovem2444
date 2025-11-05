// ========================================
// 認證系統
// ========================================

const Auth = {
    // 當前用戶
    currentUser: null,
    
    // 初始化
    init() {
        this.checkAuth();
        this.bindEvents();
    },
    
    // 綁定事件
    bindEvents() {
        // 登入表單
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // 註冊表單
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
    },
    
    // 檢查認證狀態
    checkAuth() {
        const user = Utils.storage.get('currentUser');
        const token = Utils.storage.get('authToken');
        
        if (user && token) {
            this.currentUser = user;
            this.showApp();
        } else {
            this.showLogin();
        }
    },
    
    // 處理登入
    async handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // 驗證
        if (!Utils.validateEmail(email)) {
            Utils.showToast('請輸入有效的電子郵件', 'error');
            return;
        }
        
        if (!password) {
            Utils.showToast('請輸入密碼', 'error');
            return;
        }
        
        Utils.showLoading();
        
        // 模擬API請求
        setTimeout(() => {
            // 檢查是否為已註冊用戶
            const users = Utils.storage.get('users') || [];
            const user = users.find(u => u.email === email);
            
            if (!user || user.password !== password) {
                Utils.hideLoading();
                Utils.showToast('電子郵件或密碼錯誤', 'error');
                return;
            }
            
            // 登入成功
            const authUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.createdAt
            };
            
            this.currentUser = authUser;
            
            // 儲存認證信息
            Utils.storage.set('currentUser', authUser);
            Utils.storage.set('authToken', this.generateToken());
            
            if (rememberMe) {
                Utils.storage.set('rememberMe', true);
            }
            
            Utils.hideLoading();
            Utils.showToast(`歡迎回來，${user.name}！`, 'success');
            
            // 顯示應用
            setTimeout(() => {
                this.showApp();
            }, 500);
        }, 1000);
    },
    
    // 處理註冊
    async handleRegister() {
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // 驗證
        if (!name) {
            Utils.showToast('請輸入姓名', 'error');
            return;
        }
        
        if (!Utils.validateEmail(email)) {
            Utils.showToast('請輸入有效的電子郵件', 'error');
            return;
        }
        
        const passwordCheck = Utils.validatePassword(password);
        if (!passwordCheck.valid) {
            let message = '密碼必須符合以下條件：\n';
            if (!passwordCheck.minLength) message += '- 至少8個字元\n';
            if (!passwordCheck.hasLetter) message += '- 包含字母\n';
            if (!passwordCheck.hasNumber) message += '- 包含數字';
            Utils.showToast(message, 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            Utils.showToast('兩次輸入的密碼不一致', 'error');
            return;
        }
        
        if (!agreeTerms) {
            Utils.showToast('請同意服務條款和隱私政策', 'error');
            return;
        }
        
        Utils.showLoading();
        
        // 模擬API請求
        setTimeout(() => {
            // 檢查郵箱是否已註冊
            const users = Utils.storage.get('users') || [];
            if (users.find(u => u.email === email)) {
                Utils.hideLoading();
                Utils.showToast('此電子郵件已被註冊', 'error');
                return;
            }
            
            // 創建新用戶
            const newUser = {
                id: Utils.generateId(),
                name,
                email,
                password, // 實際應用中應該加密
                avatar: null,
                createdAt: new Date().toISOString(),
                plan: 'free',
                chatbots: [],
                subscribers: 0,
                messages: 0
            };
            
            users.push(newUser);
            Utils.storage.set('users', users);
            
            Utils.hideLoading();
            Utils.showToast('註冊成功！請登入', 'success');
            
            // 切換到登入頁面
            setTimeout(() => {
                showLogin();
                // 自動填入郵箱
                document.getElementById('loginEmail').value = email;
            }, 1000);
        }, 1000);
    },
    
    // 登出
    logout() {
        if (confirm('確定要登出嗎？')) {
            this.currentUser = null;
            
            const rememberMe = Utils.storage.get('rememberMe');
            if (!rememberMe) {
                Utils.storage.clear();
            } else {
                Utils.storage.remove('currentUser');
                Utils.storage.remove('authToken');
            }
            
            Utils.showToast('已登出', 'info');
            setTimeout(() => {
                this.showLogin();
            }, 500);
        }
    },
    
    // 顯示登入頁面
    showLogin() {
        document.getElementById('loginPage').classList.add('active');
        document.getElementById('registerPage').classList.remove('active');
        document.getElementById('appPage').classList.remove('active');
    },
    
    // 顯示註冊頁面
    showRegister() {
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('registerPage').classList.add('active');
        document.getElementById('appPage').classList.remove('active');
    },
    
    // 顯示應用
    showApp() {
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('registerPage').classList.remove('active');
        document.getElementById('appPage').classList.add('active');
        
        // 更新用戶信息
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userEmail').textContent = this.currentUser.email;
        }
        
        // 載入儀表板
        if (typeof Dashboard !== 'undefined') {
            Dashboard.load();
        }
    },
    
    // 生成Token
    generateToken() {
        return 'token_' + Utils.generateId() + '_' + Date.now();
    },
    
    // 獲取當前用戶
    getCurrentUser() {
        return this.currentUser;
    },
    
    // 更新用戶資料
    updateUser(updates) {
        if (!this.currentUser) return false;
        
        this.currentUser = { ...this.currentUser, ...updates };
        Utils.storage.set('currentUser', this.currentUser);
        
        // 更新users列表中的用戶資料
        const users = Utils.storage.get('users') || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            Utils.storage.set('users', users);
        }
        
        return true;
    }
    };
    
    console.log('✓ Auth 對象創建成功');
} catch (error) {
    console.error('✗ Auth 對象創建失敗:', error);
    alert('Auth 載入錯誤: ' + error.message);
}

// 全局函數
function showLogin() {
    if (typeof Auth !== 'undefined' && Auth.showLogin) {
        Auth.showLogin();
    } else {
        console.error('Auth.showLogin 未定義');
    }
}

function showRegister() {
    if (typeof Auth !== 'undefined' && Auth.showRegister) {
        Auth.showRegister();
    } else {
        console.error('Auth.showRegister 未定義');
    }
}

function logout() {
    if (typeof Auth !== 'undefined' && Auth.logout) {
        Auth.logout();
    } else {
        console.error('Auth.logout 未定義');
    }
}

// 切換側邊欄
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (typeof Auth !== 'undefined' && Auth.init) {
            console.log('開始初始化 Auth...');
            Auth.init();
            console.log('✓ Auth 初始化成功');
        } else {
            console.error('✗ Auth 對象未定義或缺少 init 方法');
            alert('Auth 初始化失敗：Auth 對象未正確創建');
        }
    } catch (error) {
        console.error('✗ Auth 初始化失敗:', error);
        alert('Auth 初始化錯誤: ' + error.message + '\n請查看控制台了解詳情');
    }
});
