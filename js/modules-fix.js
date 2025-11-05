// 為所有缺少 load 方法的模組添加基本的 load 方法

// Chatbot load 方法
if (typeof Chatbot !== 'undefined' && !Chatbot.load) {
    Chatbot.load = function() {
        const contentWrapper = document.getElementById('contentWrapper');
        if (!contentWrapper) return;
        
        contentWrapper.innerHTML = `
            <div style="padding: 20px;">
                <h1><i class="fas fa-robot"></i> 聊天機器人管理</h1>
                <p style="color: #666; margin-top: 10px;">管理您的聊天機器人，設定自動回覆規則。</p>
                <div style="background: white; border-radius: 10px; padding: 30px; margin-top: 20px; text-align: center;">
                    <i class="fas fa-robot" style="font-size: 64px; color: #667eea; margin-bottom: 20px;"></i>
                    <h3>聊天機器人功能開發中</h3>
                    <p style="color: #666;">此功能正在開發中，敬請期待！</p>
                </div>
            </div>
        `;
    };
}

// Users load 方法
if (typeof Users !== 'undefined' && !Users.load) {
    Users.load = function() {
        const contentWrapper = document.getElementById('contentWrapper');
        if (!contentWrapper) return;
        
        contentWrapper.innerHTML = `
            <div style="padding: 20px;">
                <h1><i class="fas fa-users"></i> 用戶管理</h1>
                <p style="color: #666; margin-top: 10px;">管理您的訂閱用戶，查看用戶資料和互動記錄。</p>
                <div style="background: white; border-radius: 10px; padding: 30px; margin-top: 20px; text-align: center;">
                    <i class="fas fa-users" style="font-size: 64px; color: #f093fb; margin-bottom: 20px;"></i>
                    <h3>用戶管理功能開發中</h3>
                    <p style="color: #666;">此功能正在開發中，敬請期待！</p>
                </div>
            </div>
        `;
    };
}

// Ecommerce load 方法
if (typeof Ecommerce !== 'undefined' && !Ecommerce.load) {
    Ecommerce.load = function() {
        const contentWrapper = document.getElementById('contentWrapper');
        if (!contentWrapper) return;
        
        contentWrapper.innerHTML = `
            <div style="padding: 20px;">
                <h1><i class="fas fa-shopping-cart"></i> 電商管理</h1>
                <p style="color: #666; margin-top: 10px;">管理商品、訂單和庫存。</p>
                <div style="background: white; border-radius: 10px; padding: 30px; margin-top: 20px; text-align: center;">
                    <i class="fas fa-shopping-cart" style="font-size: 64px; color: #43e97b; margin-bottom: 20px;"></i>
                    <h3>電商功能開發中</h3>
                    <p style="color: #666;">此功能正在開發中，敬請期待！</p>
                </div>
            </div>
        `;
    };
}

// Broadcast load 方法
if (typeof Broadcast !== 'undefined' && !Broadcast.load) {
    Broadcast.load = function() {
        const contentWrapper = document.getElementById('contentWrapper');
        if (!contentWrapper) return;
        
        contentWrapper.innerHTML = `
            <div style="padding: 20px;">
                <h1><i class="fas fa-bullhorn"></i> 推播訊息</h1>
                <p style="color: #666; margin-top: 10px;">發送推播訊息給您的訂閱用戶。</p>
                <div style="background: white; border-radius: 10px; padding: 30px; margin-top: 20px; text-align: center;">
                    <i class="fas fa-bullhorn" style="font-size: 64px; color: #4facfe; margin-bottom: 20px;"></i>
                    <h3>推播功能開發中</h3>
                    <p style="color: #666;">此功能正在開發中，敬請期待！</p>
                </div>
            </div>
        `;
    };
}

// LiveChat load 方法
if (typeof LiveChat !== 'undefined' && !LiveChat.load) {
    LiveChat.load = function() {
        const contentWrapper = document.getElementById('contentWrapper');
        if (!contentWrapper) return;
        
        contentWrapper.innerHTML = `
            <div style="padding: 20px;">
                <h1><i class="fas fa-comments"></i> LiveChat 管理</h1>
                <p style="color: #666; margin-top: 10px;">即時客服聊天管理。</p>
                <div style="background: white; border-radius: 10px; padding: 30px; margin-top: 20px; text-align: center;">
                    <i class="fas fa-comments" style="font-size: 64px; color: #f5576c; margin-bottom: 20px;"></i>
                    <h3>LiveChat 功能開發中</h3>
                    <p style="color: #666;">此功能正在開發中，敬請期待！</p>
                </div>
            </div>
        `;
    };
}

// Analytics load 方法
if (typeof Analytics !== 'undefined' && !Analytics.load) {
    Analytics.load = function() {
        const contentWrapper = document.getElementById('contentWrapper');
        if (!contentWrapper) return;
        
        contentWrapper.innerHTML = `
            <div style="padding: 20px;">
                <h1><i class="fas fa-chart-line"></i> 數據分析</h1>
                <p style="color: #666; margin-top: 10px;">查看詳細的數據分析和報表。</p>
                <div style="background: white; border-radius: 10px; padding: 30px; margin-top: 20px; text-align: center;">
                    <i class="fas fa-chart-line" style="font-size: 64px; color: #764ba2; margin-bottom: 20px;"></i>
                    <h3>數據分析功能開發中</h3>
                    <p style="color: #666;">此功能正在開發中，敬請期待！</p>
                </div>
            </div>
        `;
    };
}

// Settings load 方法
if (typeof Settings !== 'undefined' && !Settings.load) {
    Settings.load = function() {
        const contentWrapper = document.getElementById('contentWrapper');
        if (!contentWrapper) return;
        
        contentWrapper.innerHTML = `
            <div style="padding: 20px;">
                <h1><i class="fas fa-cog"></i> 系統設定</h1>
                <p style="color: #666; margin-top: 10px;">管理系統設定和偏好。</p>
                <div style="background: white; border-radius: 10px; padding: 30px; margin-top: 20px; text-align: center;">
                    <i class="fas fa-cog" style="font-size: 64px; color: #667eea; margin-bottom: 20px;"></i>
                    <h3>設定功能開發中</h3>
                    <p style="color: #666;">此功能正在開發中，敬請期待！</p>
                </div>
            </div>
        `;
    };
}

console.log('✓ 所有模組 load 方法已修復');
