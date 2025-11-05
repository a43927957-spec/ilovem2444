// ========================================
// 主應用邏輯
// ========================================

const App = {
    currentPage: 'dashboard',
    
    // 初始化
    init() {
        this.bindNavigation();
        this.initMobileMenu();
    },
    
    // 綁定導航
    bindNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 移除所有active類
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // 添加active到當前項
                item.classList.add('active');
                
                // 獲取頁面名稱
                const pageName = item.getAttribute('data-page');
                this.loadPage(pageName);
                
                // 在手機上關閉側邊欄
                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('active');
                }
            });
        });
    },
    
    // 載入頁面
    loadPage(pageName) {
        this.currentPage = pageName;
        const contentWrapper = document.getElementById('contentWrapper');
        
        // 顯示載入動畫
        Utils.showLoading();
        
        // 根據頁面名稱載入對應內容
        setTimeout(() => {
            switch(pageName) {
                case 'dashboard':
                    if (typeof Dashboard !== 'undefined') {
                        Dashboard.load();
                    }
                    break;
                case 'chatbot':
                    if (typeof Chatbot !== 'undefined') {
                        Chatbot.load();
                    }
                    break;
                case 'users':
                    if (typeof Users !== 'undefined') {
                        Users.load();
                    }
                    break;
                case 'ecommerce':
                    if (typeof Ecommerce !== 'undefined') {
                        Ecommerce.load();
                    }
                    break;
                case 'broadcast':
                    if (typeof Broadcast !== 'undefined') {
                        Broadcast.load();
                    }
                    break;
                case 'livechat':
                    if (typeof LiveChat !== 'undefined') {
                        LiveChat.load();
                    }
                    break;
                case 'analytics':
                    if (typeof Analytics !== 'undefined') {
                        Analytics.load();
                    }
                    break;
                case 'settings':
                    if (typeof Settings !== 'undefined') {
                        Settings.load();
                    }
                    break;
                default:
                    contentWrapper.innerHTML = `
                        <div style="text-align: center; padding: 60px 20px;">
                            <i class="fas fa-exclamation-triangle" style="font-size: 64px; color: var(--warning-color); margin-bottom: 20px;"></i>
                            <h2>頁面施工中</h2>
                            <p style="color: var(--text-secondary);">此功能正在開發中，敬請期待！</p>
                        </div>
                    `;
            }
            
            Utils.hideLoading();
        }, 300);
    },
    
    // 初始化手機選單
    initMobileMenu() {
        // 點擊外部關閉側邊欄
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            
            if (window.innerWidth <= 768 && 
                sidebar.classList.contains('active') &&
                !sidebar.contains(e.target) &&
                e.target !== menuBtn &&
                !menuBtn.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
};

// 初始化應用
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
