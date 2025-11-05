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
```
