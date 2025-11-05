// Analytics Module
const Analytics = {
    charts: {},
    dateRange: 'week',
    selectedMetric: 'messages',

    init() {
        console.log('Analytics module initialized');
        this.bindEvents();
        this.loadAnalytics();
        this.renderOverviewStats();
        this.initCharts();
    },

    loadAnalytics() {
        // This would normally fetch data from an API
        // For now, we'll use localStorage or generate sample data
        this.data = this.generateAnalyticsData();
    },

    generateAnalyticsData() {
        return {
            overview: {
                totalMessages: 45289,
                totalUsers: 8547,
                activeUsers: 5680,
                conversionRate: 12.8,
                avgResponseTime: 45, // seconds
                satisfactionScore: 4.6
            },
            messageStats: {
                daily: this.generateDailyData(30),
                weekly: this.generateWeeklyData(12),
                monthly: this.generateMonthlyData(12)
            },
            userGrowth: {
                daily: this.generateUserGrowthData(30),
                weekly: this.generateUserGrowthData(12),
                monthly: this.generateUserGrowthData(12)
            },
            platformDistribution: {
                messenger: 4200,
                line: 2800,
                instagram: 1547
            },
            topPerformingBots: [
                { name: '客服助手 Pro', messages: 18500, satisfaction: 4.8 },
                { name: '購物小幫手', messages: 15200, satisfaction: 4.6 },
                { name: 'Instagram 互動機器人', messages: 8900, satisfaction: 4.4 },
                { name: '預約助理', messages: 5600, satisfaction: 4.7 }
            ],
            peakHours: this.generatePeakHoursData(),
            commonQueries: [
                { query: '產品價格', count: 1250 },
                { query: '運送時間', count: 980 },
                { query: '退換貨政策', count: 856 },
                { query: '產品規格', count: 742 },
                { query: '優惠活動', count: 628 }
            ]
        };
    },

    generateDailyData(days) {
        const data = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toISOString().split('T')[0],
                value: Math.floor(Math.random() * 2000) + 1000
            });
        }
        return data;
    },

    generateWeeklyData(weeks) {
        const data = [];
        for (let i = weeks - 1; i >= 0; i--) {
            data.push({
                label: `第 ${weeks - i} 週`,
                value: Math.floor(Math.random() * 10000) + 5000
            });
        }
        return data;
    },

    generateMonthlyData(months) {
        const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        const data = [];
        const currentMonth = new Date().getMonth();
        
        for (let i = months - 1; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            data.push({
                label: monthNames[monthIndex],
                value: Math.floor(Math.random() * 20000) + 10000
            });
        }
        return data;
    },

    generateUserGrowthData(periods) {
        const data = [];
        let cumulative = 5000;
        
        for (let i = 0; i < periods; i++) {
            const growth = Math.floor(Math.random() * 500) + 100;
            cumulative += growth;
            data.push({
                period: i,
                new: growth,
                total: cumulative
            });
        }
        return data;
    },

    generatePeakHoursData() {
        const data = [];
        for (let hour = 0; hour < 24; hour++) {
            let value;
            if (hour >= 9 && hour <= 12) {
                value = Math.floor(Math.random() * 500) + 800; // Morning peak
            } else if (hour >= 14 && hour <= 17) {
                value = Math.floor(Math.random() * 600) + 900; // Afternoon peak
            } else if (hour >= 19 && hour <= 22) {
                value = Math.floor(Math.random() * 700) + 1000; // Evening peak
            } else {
                value = Math.floor(Math.random() * 200) + 100; // Off-peak
            }
            
            data.push({
                hour: hour,
                value: value
            });
        }
        return data;
    },

    renderOverviewStats() {
        const data = this.data.overview;

        document.getElementById('totalMessagesCount').textContent = Utils.formatNumber(data.totalMessages);
        document.getElementById('totalUsersCount').textContent = Utils.formatNumber(data.totalUsers);
        document.getElementById('activeUsersCount').textContent = Utils.formatNumber(data.activeUsers);
        document.getElementById('conversionRateValue').textContent = data.conversionRate + '%';
        document.getElementById('avgResponseTimeValue').textContent = data.avgResponseTime + '秒';
        document.getElementById('satisfactionScoreValue').textContent = data.satisfactionScore + '/5.0';
    },

    initCharts() {
        this.initMessageTrendChart();
        this.initUserGrowthChart();
        this.initPlatformDistributionChart();
        this.initPeakHoursChart();
        this.renderTopPerformingBots();
        this.renderCommonQueries();
    },

    initMessageTrendChart() {
        const ctx = document.getElementById('messageTrendChart');
        if (!ctx) return;

        if (this.charts.messageTrend) {
            this.charts.messageTrend.destroy();
        }

        const data = this.getDataForRange(this.dateRange, 'messages');

        this.charts.messageTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: '訊息數量',
                    data: data.values,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return '訊息數：' + Utils.formatNumber(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return Utils.formatNumber(value);
                            }
                        }
                    }
                }
            }
        });
    },

    initUserGrowthChart() {
        const ctx = document.getElementById('userGrowthChart');
        if (!ctx) return;

        if (this.charts.userGrowth) {
            this.charts.userGrowth.destroy();
        }

        const data = this.getDataForRange(this.dateRange, 'users');

        this.charts.userGrowth = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: '新增用戶',
                    data: data.values,
                    backgroundColor: '#10b981',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return '新增用戶：' + Utils.formatNumber(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return Utils.formatNumber(value);
                            }
                        }
                    }
                }
            }
        });
    },

    initPlatformDistributionChart() {
        const ctx = document.getElementById('platformDistributionChart');
        if (!ctx) return;

        if (this.charts.platformDist) {
            this.charts.platformDist.destroy();
        }

        const data = this.data.platformDistribution;

        this.charts.platformDist = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Facebook Messenger', 'LINE', 'Instagram'],
                datasets: [{
                    data: [data.messenger, data.line, data.instagram],
                    backgroundColor: ['#0084ff', '#00c300', '#e4405f'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
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
    },

    initPeakHoursChart() {
        const ctx = document.getElementById('peakHoursChart');
        if (!ctx) return;

        if (this.charts.peakHours) {
            this.charts.peakHours.destroy();
        }

        const data = this.data.peakHours;
        const labels = data.map(d => d.hour + ':00');
        const values = data.map(d => d.value);

        this.charts.peakHours = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '訊息數',
                    data: values,
                    backgroundColor: function(context) {
                        const value = context.parsed.y;
                        if (value > 1000) return '#ef4444';
                        if (value > 700) return '#f59e0b';
                        return '#3b82f6';
                    },
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return '訊息數：' + Utils.formatNumber(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 10
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return Utils.formatNumber(value);
                            }
                        }
                    }
                }
            }
        });
    },

    renderTopPerformingBots() {
        const container = document.getElementById('topBotsTable');
        if (!container) return;

        const rows = this.data.topPerformingBots.map((bot, index) => `
            <tr>
                <td><strong>#${index + 1}</strong></td>
                <td>${bot.name}</td>
                <td>${Utils.formatNumber(bot.messages)}</td>
                <td>
                    <div class="satisfaction-rating">
                        ${'⭐'.repeat(Math.floor(bot.satisfaction))}
                        <span>${bot.satisfaction}</span>
                    </div>
                </td>
            </tr>
        `).join('');

        container.innerHTML = rows;
    },

    renderCommonQueries() {
        const container = document.getElementById('commonQueriesList');
        if (!container) return;

        const total = this.data.commonQueries.reduce((sum, q) => sum + q.count, 0);

        const items = this.data.commonQueries.map(query => {
            const percentage = ((query.count / total) * 100).toFixed(1);
            
            return `
                <div class="query-item">
                    <div class="query-info">
                        <span class="query-text">${query.query}</span>
                        <span class="query-count">${Utils.formatNumber(query.count)} 次</span>
                    </div>
                    <div class="query-bar">
                        <div class="query-bar-fill" style="width: ${percentage}%;"></div>
                    </div>
                    <div class="query-percentage">${percentage}%</div>
                </div>
            `;
        }).join('');

        container.innerHTML = items;
    },

    getDataForRange(range, metric) {
        let sourceData;
        
        if (metric === 'messages') {
            sourceData = this.data.messageStats[range === 'week' ? 'daily' : range === 'month' ? 'weekly' : 'monthly'];
        } else {
            sourceData = this.data.userGrowth[range === 'week' ? 'daily' : range === 'month' ? 'weekly' : 'monthly'];
        }

        if (range === 'week') {
            // Last 7 days
            const last7 = sourceData.slice(-7);
            return {
                labels: last7.map(d => {
                    if (d.date) {
                        return new Date(d.date).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
                    }
                    return d.label || '';
                }),
                values: last7.map(d => metric === 'users' ? d.new || d.value : d.value)
            };
        } else if (range === 'month') {
            // Last 4 weeks
            const last4 = sourceData.slice(-4);
            return {
                labels: last4.map(d => d.label || ''),
                values: last4.map(d => metric === 'users' ? d.new || d.value : d.value)
            };
        } else {
            // Last 12 months
            return {
                labels: sourceData.map(d => d.label || ''),
                values: sourceData.map(d => metric === 'users' ? d.new || d.value : d.value)
            };
        }
    },

    bindEvents() {
        // Date range selector
        const dateRangeButtons = document.querySelectorAll('.date-range-btn');
        dateRangeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const range = btn.dataset.range;
                this.changeDateRange(range);
            });
        });

        // Export button
        const exportBtn = document.getElementById('exportAnalyticsBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportAnalytics());
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshAnalyticsBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshAnalytics());
        }
    },

    changeDateRange(range) {
        this.dateRange = range;

        // Update active button
        document.querySelectorAll('.date-range-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.range === range) {
                btn.classList.add('active');
            }
        });

        // Update charts
        this.initMessageTrendChart();
        this.initUserGrowthChart();
    },

    refreshAnalytics() {
        Utils.showToast('正在更新數據...', 'info');
        
        // Simulate data refresh
        setTimeout(() => {
            this.data = this.generateAnalyticsData();
            this.renderOverviewStats();
            this.initCharts();
            Utils.showToast('數據已更新', 'success');
        }, 1000);
    },

    exportAnalytics() {
        const data = this.data;
        const reportContent = `
ilovem2444 Analytics Report
Generated: ${new Date().toLocaleString('zh-TW')}

=== Overview Statistics ===
Total Messages: ${Utils.formatNumber(data.overview.totalMessages)}
Total Users: ${Utils.formatNumber(data.overview.totalUsers)}
Active Users: ${Utils.formatNumber(data.overview.activeUsers)}
Conversion Rate: ${data.overview.conversionRate}%
Avg Response Time: ${data.overview.avgResponseTime} seconds
Satisfaction Score: ${data.overview.satisfactionScore}/5.0

=== Platform Distribution ===
Facebook Messenger: ${Utils.formatNumber(data.platformDistribution.messenger)}
LINE: ${Utils.formatNumber(data.platformDistribution.line)}
Instagram: ${Utils.formatNumber(data.platformDistribution.instagram)}

=== Top Performing Bots ===
${data.topPerformingBots.map((bot, i) => 
    `${i + 1}. ${bot.name} - ${Utils.formatNumber(bot.messages)} messages (${bot.satisfaction} stars)`
).join('\n')}

=== Common Queries ===
${data.commonQueries.map((q, i) => 
    `${i + 1}. ${q.query} - ${Utils.formatNumber(q.count)} times`
).join('\n')}
        `.trim();

        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `analytics_report_${Date.now()}.txt`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Utils.showToast('報表已匯出', 'success');
    },

    destroy() {
        // Destroy all charts
        Object.keys(this.charts).forEach(key => {
            if (this.charts[key]) {
                this.charts[key].destroy();
                this.charts[key] = null;
            }
        });
    }
};
