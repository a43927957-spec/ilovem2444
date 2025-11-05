// Dashboard Module
const Dashboard = {
    charts: {},
    stats: {
        chatbots: 12,
        subscribers: 8547,
        messages: 45289,
        revenue: 128500
    },

    init() {
        console.log('Dashboard initialized');
        this.loadStats();
        this.initCharts();
        this.loadRecentActivity();
        this.bindQuickActions();
    },

    loadStats() {
        // Update statistics cards with animation
        this.animateCounter('stat-chatbots', 0, this.stats.chatbots, 1000);
        this.animateCounter('stat-subscribers', 0, this.stats.subscribers, 1000);
        this.animateCounter('stat-messages', 0, this.stats.messages, 1000);
        this.animateCounter('stat-revenue', 0, this.stats.revenue, 1000);
    },

    animateCounter(elementId, start, end, duration) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }

            if (elementId === 'stat-revenue') {
                element.textContent = Utils.formatCurrency(Math.floor(current));
            } else {
                element.textContent = Utils.formatNumber(Math.floor(current));
            }
        }, 16);
    },

    initCharts() {
        this.initActivityChart();
        this.initPlatformChart();
    },

    initActivityChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.activity) {
            this.charts.activity.destroy();
        }

        // Generate sample data for the last 7 days
        const days = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
        const messageData = [3200, 4100, 3800, 5200, 4800, 6100, 5500];
        const subscriberData = [120, 180, 150, 220, 190, 280, 240];

        this.charts.activity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [
                    {
                        label: '訊息數',
                        data: messageData,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: '新訂閱者',
                        data: subscriberData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 13
                        },
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return Utils.formatNumber(value);
                            }
                        }
                    }
                }
            }
        });
    },

    initPlatformChart() {
        const ctx = document.getElementById('platformChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.platform) {
            this.charts.platform.destroy();
        }

        const platformData = {
            messenger: 4200,
            line: 2800,
            instagram: 1547
        };

        this.charts.platform = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Facebook Messenger', 'LINE', 'Instagram'],
                datasets: [{
                    data: [platformData.messenger, platformData.line, platformData.instagram],
                    backgroundColor: [
                        '#0084ff',
                        '#00c300',
                        '#e4405f'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${Utils.formatNumber(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        // Update platform stats in the HTML
        this.updatePlatformStats(platformData);
    },

    updatePlatformStats(data) {
        const total = data.messenger + data.line + data.instagram;

        const messengerPercent = ((data.messenger / total) * 100).toFixed(1);
        const linePercent = ((data.line / total) * 100).toFixed(1);
        const instagramPercent = ((data.instagram / total) * 100).toFixed(1);

        const platformStatsHTML = `
            <div class="platform-stat-item">
                <div class="platform-stat-header">
                    <span class="platform-name">
                        <i class="fab fa-facebook-messenger" style="color: #0084ff;"></i>
                        Messenger
                    </span>
                    <span class="platform-percent">${messengerPercent}%</span>
                </div>
                <div class="platform-stat-bar">
                    <div class="platform-stat-fill" style="width: ${messengerPercent}%; background: #0084ff;"></div>
                </div>
                <div class="platform-stat-count">${Utils.formatNumber(data.messenger)} 訂閱者</div>
            </div>

            <div class="platform-stat-item">
                <div class="platform-stat-header">
                    <span class="platform-name">
                        <i class="fab fa-line" style="color: #00c300;"></i>
                        LINE
                    </span>
                    <span class="platform-percent">${linePercent}%</span>
                </div>
                <div class="platform-stat-bar">
                    <div class="platform-stat-fill" style="width: ${linePercent}%; background: #00c300;"></div>
                </div>
                <div class="platform-stat-count">${Utils.formatNumber(data.line)} 訂閱者</div>
            </div>

            <div class="platform-stat-item">
                <div class="platform-stat-header">
                    <span class="platform-name">
                        <i class="fab fa-instagram" style="color: #e4405f;"></i>
                        Instagram
                    </span>
                    <span class="platform-percent">${instagramPercent}%</span>
                </div>
                <div class="platform-stat-bar">
                    <div class="platform-stat-fill" style="width: ${instagramPercent}%; background: #e4405f;"></div>
                </div>
                <div class="platform-stat-count">${Utils.formatNumber(data.instagram)} 訂閱者</div>
            </div>
        `;

        const platformStatsContainer = document.getElementById('platformStats');
        if (platformStatsContainer) {
            platformStatsContainer.innerHTML = platformStatsHTML;
        }
    },

    loadRecentActivity() {
        const activities = [
            {
                icon: 'fa-robot',
                iconColor: '#3b82f6',
                title: '新聊天機器人建立',
                description: '「客服助手 Pro」已成功建立',
                time: '5 分鐘前'
            },
            {
                icon: 'fa-user-plus',
                iconColor: '#10b981',
                title: '新訂閱者',
                description: '28 位新用戶訂閱了你的機器人',
                time: '15 分鐘前'
            },
            {
                icon: 'fa-paper-plane',
                iconColor: '#8b5cf6',
                title: '廣播訊息已發送',
                description: '「限時優惠通知」已發送給 5,240 位用戶',
                time: '1 小時前'
            },
            {
                icon: 'fa-shopping-cart',
                iconColor: '#f59e0b',
                title: '新訂單',
                description: '收到 3 筆新訂單，總金額 NT$4,580',
                time: '2 小時前'
            },
            {
                icon: 'fa-chart-line',
                iconColor: '#ef4444',
                title: '流量高峰',
                description: '偵測到訊息量激增 +185%',
                time: '3 小時前'
            }
        ];

        const activityHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon" style="background: ${activity.iconColor}15; color: ${activity.iconColor};">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-time">
                        <i class="far fa-clock"></i>
                        ${activity.time}
                    </div>
                </div>
            </div>
        `).join('');

        const activityFeed = document.getElementById('activityFeed');
        if (activityFeed) {
            activityFeed.innerHTML = activityHTML;
        }
    },

    bindQuickActions() {
        // Create new chatbot
        const createBotBtn = document.getElementById('createBotBtn');
        if (createBotBtn) {
            createBotBtn.addEventListener('click', () => {
                Utils.showToast('正在開啟聊天機器人建立器...', 'info');
                setTimeout(() => {
                    App.loadPage('chatbot');
                }, 500);
            });
        }

        // Send broadcast
        const sendBroadcastBtn = document.getElementById('sendBroadcastBtn');
        if (sendBroadcastBtn) {
            sendBroadcastBtn.addEventListener('click', () => {
                Utils.showToast('正在開啟廣播訊息功能...', 'info');
                setTimeout(() => {
                    App.loadPage('broadcast');
                }, 500);
        });
        }

        // View analytics
        const viewAnalyticsBtn = document.getElementById('viewAnalyticsBtn');
        if (viewAnalyticsBtn) {
            viewAnalyticsBtn.addEventListener('click', () => {
                Utils.showToast('正在載入數據分析...', 'info');
                setTimeout(() => {
                    App.loadPage('analytics');
                }, 500);
            });
        }

        // Manage users
        const manageUsersBtn = document.getElementById('manageUsersBtn');
        if (manageUsersBtn) {
            manageUsersBtn.addEventListener('click', () => {
                Utils.showToast('正在開啟用戶管理...', 'info');
                setTimeout(() => {
                    App.loadPage('users');
                }, 500);
            });
        }
    },

    load() {
        // 渲染儀表板 HTML
        const contentWrapper = document.getElementById('contentWrapper');
        if (!contentWrapper) {
            console.error('找不到 contentWrapper 元素');
            return;
        }

        contentWrapper.innerHTML = `
            <div class="dashboard-container" style="padding: 20px;">
                <div class="page-header" style="margin-bottom: 30px;">
                    <h1 style="font-size: 28px; margin-bottom: 5px;"><i class="fas fa-home"></i> 儀表板</h1>
                    <p style="color: #666;">歡迎回來！這是您的數據概覽</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
                    <div style="background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="width: 60px; height: 60px; border-radius: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div>
                                <h3 id="stat-chatbots" style="font-size: 32px; margin: 0;">0</h3>
                                <p style="margin: 0; color: #666;">聊天機器人</p>
                            </div>
                        </div>
                    </div>

                    <div style="background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="width: 60px; height: 60px; border-radius: 12px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
                                <i class="fas fa-users"></i>
                            </div>
                            <div>
                                <h3 id="stat-subscribers" style="font-size: 32px; margin: 0;">0</h3>
                                <p style="margin: 0; color: #666;">總訂閱數</p>
                            </div>
                        </div>
                    </div>

                    <div style="background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="width: 60px; height: 60px; border-radius: 12px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
                                <i class="fas fa-comments"></i>
                            </div>
                            <div>
                                <h3 id="stat-messages" style="font-size: 32px; margin: 0;">0</h3>
                                <p style="margin: 0; color: #666;">訊息總數</p>
                            </div>
                        </div>
                    </div>

                    <div style="background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="width: 60px; height: 60px; border-radius: 12px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                            <div>
                                <h3 id="stat-revenue" style="font-size: 32px; margin: 0;">NT$ 0</h3>
                                <p style="margin: 0; color: #666;">本月營收</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="background: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
                    <h2 style="font-size: 20px; margin-bottom: 20px;"><i class="fas fa-chart-line"></i> 最近活動</h2>
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div style="display: flex; align-items: center; gap: 15px; padding: 12px; border-radius: 8px; background: #f8f9fa;">
                            <i class="fas fa-user-plus" style="font-size: 20px; color: #667eea;"></i>
                            <div style="flex: 1;">
                                <p style="margin: 0; font-weight: 500;">新訂閱者加入了 Facebook Messenger</p>
                                <span style="font-size: 12px; color: #666;">5 分鐘前</span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px; padding: 12px; border-radius: 8px; background: #f8f9fa;">
                            <i class="fas fa-comment" style="font-size: 20px; color: #4facfe;"></i>
                            <div style="flex: 1;">
                                <p style="margin: 0; font-weight: 500;">收到訊息來自 LINE 用戶</p>
                                <span style="font-size: 12px; color: #666;">12 分鐘前</span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px; padding: 12px; border-radius: 8px; background: #f8f9fa;">
                            <i class="fas fa-shopping-cart" style="font-size: 20px; color: #43e97b;"></i>
                            <div style="flex: 1;">
                                <p style="margin: 0; font-weight: 500;">新訂單 NT$ 1,200</p>
                                <span style="font-size: 12px; color: #666;">25 分鐘前</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="background: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h2 style="font-size: 20px; margin-bottom: 20px;"><i class="fas fa-tasks"></i> 快速操作</h2>
                    <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                        <button style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-plus"></i> 建立機器人
                        </button>
                        <button style="padding: 12px 24px; background: #4facfe; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-paper-plane"></i> 發送推播
                        </button>
                        <button style="padding: 12px 24px; background: #43e97b; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-chart-bar"></i> 查看報表
                        </button>
                    </div>
                </div>
            </div>
        `;

        // 初始化數據動畫
        setTimeout(() => {
            this.loadStats();
        }, 100);
    },

    destroy() {
        // Clean up charts
        if (this.charts.activity) {
            this.charts.activity.destroy();
            this.charts.activity = null;
        }
        if (this.charts.platform) {
            this.charts.platform.destroy();
            this.charts.platform = null;
        }
    }
};

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Dashboard will be initialized by App.loadPage()
    });
} else {
    // DOM already loaded
    // Dashboard will be initialized by App.loadPage()
}
