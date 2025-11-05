// Users Management Module
const Users = {
    users: [],
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
    filters: {
        search: '',
        platform: 'all',
        status: 'all'
    },

    init() {
        console.log('Users module initialized');
        this.loadUsers();
        this.renderUserList();
        this.bindEvents();
        this.updateStats();
    },

    loadUsers() {
        // Load users from localStorage
        const stored = Utils.storage.get('users');
        if (stored) {
            this.users = stored;
        } else {
            // Initialize with sample data
            this.users = this.generateSampleUsers(50);
            this.saveUsers();
        }
        this.calculatePagination();
    },

    generateSampleUsers(count) {
        const platforms = ['messenger', 'line', 'instagram'];
        const statuses = ['active', 'inactive', 'blocked'];
        const names = [
            '王小明', '李美麗', '張志豪', '陳雅婷', '林建國',
            '黃淑芬', '吳俊傑', '劉怡君', '蔡明宏', '鄭雅文',
            '許志強', '楊淑惠', '謝宗翰', '賴佳玲', '洪明哲',
            '周雅雯', '江志偉', '葉美玉', '施俊豪', '呂雅萍'
        ];

        const users = [];
        for (let i = 0; i < count; i++) {
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
            const randomStatus = i < 40 ? 'active' : statuses[Math.floor(Math.random() * statuses.length)];
            const daysAgo = Math.floor(Math.random() * 90);
            const messageCount = Math.floor(Math.random() * 500) + 10;
            const lastActive = Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000);

            users.push({
                id: 'user-' + (1000 + i),
                name: randomName + i,
                platform: randomPlatform,
                status: randomStatus,
                subscribedAt: Date.now() - (daysAgo * 24 * 60 * 60 * 1000),
                lastActive: lastActive,
                messageCount: messageCount,
                tags: this.generateRandomTags(),
                email: `user${i}@example.com`,
                phone: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
            });
        }
        return users;
    },

    generateRandomTags() {
        const allTags = ['VIP', '新用戶', '活躍用戶', '潛在客戶', '已購買', '高價值'];
        const tagCount = Math.floor(Math.random() * 3);
        const tags = [];
        
        for (let i = 0; i < tagCount; i++) {
            const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
            if (!tags.includes(randomTag)) {
                tags.push(randomTag);
            }
        }
        return tags;
    },

    saveUsers() {
        Utils.storage.set('users', this.users);
    },

    calculatePagination() {
        const filteredUsers = this.getFilteredUsers();
        this.totalPages = Math.ceil(filteredUsers.length / this.itemsPerPage);
        if (this.currentPage > this.totalPages) {
            this.currentPage = Math.max(1, this.totalPages);
        }
    },

    getFilteredUsers() {
        return this.users.filter(user => {
            const matchesSearch = !this.filters.search || 
                user.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                user.email.toLowerCase().includes(this.filters.search.toLowerCase());
            
            const matchesPlatform = this.filters.platform === 'all' || 
                user.platform === this.filters.platform;
            
            const matchesStatus = this.filters.status === 'all' || 
                user.status === this.filters.status;

            return matchesSearch && matchesPlatform && matchesStatus;
        });
    },

    renderUserList() {
        const container = document.getElementById('userTableBody');
        if (!container) return;

        const filteredUsers = this.getFilteredUsers();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageUsers = filteredUsers.slice(startIndex, endIndex);

        if (pageUsers.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <i class="fas fa-users" style="font-size: 48px; color: #ddd; margin-bottom: 16px;"></i>
                        <p style="color: #666;">找不到符合條件的用戶</p>
                    </td>
                </tr>
            `;
            this.renderPagination(0);
            return;
        }

        const userRows = pageUsers.map(user => {
            const platformInfo = this.getPlatformInfo(user.platform);
            const statusInfo = this.getStatusInfo(user.status);
            const lastActiveText = this.getTimeAgo(user.lastActive);
            const tagsHTML = user.tags.map(tag => 
                `<span class="user-tag">${tag}</span>`
            ).join('');

            return `
                <tr>
                    <td>
                        <div class="user-info">
                            <div class="user-avatar">${user.name.charAt(0)}</div>
                            <div>
                                <div class="user-name">${user.name}</div>
                                <div class="user-email">${user.email}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="platform-badge" style="background: ${platformInfo.color}15; color: ${platformInfo.color};">
                            <i class="${platformInfo.icon}"></i>
                            ${platformInfo.name}
                        </span>
                    </td>
                    <td>
                        <span class="status-badge status-${user.status}">
                            ${statusInfo}
                        </span>
                    </td>
                    <td>${Utils.formatNumber(user.messageCount)}</td>
                    <td>${lastActiveText}</td>
                    <td>
                        <div class="user-tags">
                            ${tagsHTML || '<span style="color: #999;">-</span>'}
                        </div>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-icon" onclick="Users.viewUser('${user.id}')" title="查看詳情">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon" onclick="Users.editUser('${user.id}')" title="編輯">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon" onclick="Users.sendMessage('${user.id}')" title="發送訊息">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                            <button class="btn-icon btn-icon-danger" onclick="Users.deleteUser('${user.id}')" title="刪除">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        container.innerHTML = userRows;
        this.renderPagination(filteredUsers.length);
    },

    renderPagination(totalItems) {
        const container = document.getElementById('userPagination');
        if (!container) return;

        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const startItem = totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);

        let paginationHTML = `
            <div class="pagination-info">
                顯示 ${startItem} - ${endItem} 筆，共 ${totalItems} 筆
            </div>
            <div class="pagination-buttons">
        `;

        // Previous button
        paginationHTML += `
            <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                    onclick="Users.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            paginationHTML += `
                <button class="pagination-btn" onclick="Users.goToPage(1)">1</button>
                ${startPage > 2 ? '<span class="pagination-ellipsis">...</span>' : ''}
            `;
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="Users.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            paginationHTML += `
                ${endPage < totalPages - 1 ? '<span class="pagination-ellipsis">...</span>' : ''}
                <button class="pagination-btn" onclick="Users.goToPage(${totalPages})">${totalPages}</button>
            `;
        }

        // Next button
        paginationHTML += `
            <button class="pagination-btn" ${this.currentPage === totalPages || totalPages === 0 ? 'disabled' : ''} 
                    onclick="Users.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        paginationHTML += `
            </div>
        `;

        container.innerHTML = paginationHTML;
    },

    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.renderUserList();
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

    getStatusInfo(status) {
        const statuses = {
            active: '活躍',
            inactive: '非活躍',
            blocked: '已封鎖'
        };
        return statuses[status] || status;
    },

    getTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        if (seconds < 60) return '剛剛';
        if (seconds < 3600) return Math.floor(seconds / 60) + ' 分鐘前';
        if (seconds < 86400) return Math.floor(seconds / 3600) + ' 小時前';
        if (seconds < 2592000) return Math.floor(seconds / 86400) + ' 天前';
        if (seconds < 31536000) return Math.floor(seconds / 2592000) + ' 個月前';
        return Math.floor(seconds / 31536000) + ' 年前';
    },

    updateStats() {
        const totalUsers = this.users.length;
        const activeUsers = this.users.filter(u => u.status === 'active').length;
        const newUsersThisMonth = this.users.filter(u => {
            const monthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            return u.subscribedAt > monthAgo;
        }).length;

        document.getElementById('totalUsersCount').textContent = Utils.formatNumber(totalUsers);
        document.getElementById('activeUsersCount').textContent = Utils.formatNumber(activeUsers);
        document.getElementById('newUsersCount').textContent = Utils.formatNumber(newUsersThisMonth);
    },

    bindEvents() {
        // Search
        const searchInput = document.getElementById('userSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.currentPage = 1;
                this.calculatePagination();
                this.renderUserList();
            });
        }

        // Platform filter
        const platformFilter = document.getElementById('platformFilter');
        if (platformFilter) {
            platformFilter.addEventListener('change', (e) => {
                this.filters.platform = e.target.value;
                this.currentPage = 1;
                this.calculatePagination();
                this.renderUserList();
            });
        }

        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.currentPage = 1;
                this.calculatePagination();
                this.renderUserList();
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportUsersBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportUsers());
        }
    },

    viewUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const platformInfo = this.getPlatformInfo(user.platform);
        const statusInfo = this.getStatusInfo(user.status);
        const subscribedDate = new Date(user.subscribedAt).toLocaleDateString('zh-TW');
        const lastActiveText = this.getTimeAgo(user.lastActive);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2><i class="fas fa-user"></i> 用戶詳情</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="user-detail-grid">
                        <div class="user-detail-section">
                            <h3>基本資訊</h3>
                            <div class="detail-item">
                                <label>姓名</label>
                                <div>${user.name}</div>
                            </div>
                            <div class="detail-item">
                                <label>Email</label>
                                <div>${user.email}</div>
                            </div>
                            <div class="detail-item">
                                <label>電話</label>
                                <div>${user.phone}</div>
                            </div>
                            <div class="detail-item">
                                <label>平台</label>
                                <div>
                                    <span class="platform-badge" style="background: ${platformInfo.color}15; color: ${platformInfo.color};">
                                        <i class="${platformInfo.icon}"></i>
                                        ${platformInfo.name}
                                    </span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <label>狀態</label>
                                <div>
                                    <span class="status-badge status-${user.status}">${statusInfo}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="user-detail-section">
                            <h3>活動統計</h3>
                            <div class="detail-item">
                                <label>訂閱日期</label>
                                <div>${subscribedDate}</div>
                            </div>
                            <div class="detail-item">
                                <label>最後活動</label>
                                <div>${lastActiveText}</div>
                            </div>
                            <div class="detail-item">
                                <label>訊息數量</label>
                                <div>${Utils.formatNumber(user.messageCount)}</div>
                            </div>
                            <div class="detail-item">
                                <label>標籤</label>
                                <div class="user-tags">
                                    ${user.tags.map(tag => `<span class="user-tag">${tag}</span>`).join('') || '-'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">關閉</button>
                    <button class="btn-primary" onclick="Users.editUser('${userId}'); this.closest('.modal-overlay').remove();">
                        <i class="fas fa-edit"></i>
                        編輯用戶
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-edit"></i> 編輯用戶</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>姓名</label>
                        <input type="text" id="editUserName" class="form-control" value="${user.name}">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="editUserEmail" class="form-control" value="${user.email}">
                    </div>
                    <div class="form-group">
                        <label>電話</label>
                        <input type="tel" id="editUserPhone" class="form-control" value="${user.phone}">
                    </div>
                    <div class="form-group">
                        <label>狀態</label>
                        <select id="editUserStatus" class="form-control">
                            <option value="active" ${user.status === 'active' ? 'selected' : ''}>活躍</option>
                            <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>非活躍</option>
                            <option value="blocked" ${user.status === 'blocked' ? 'selected' : ''}>已封鎖</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">取消</button>
                    <button class="btn-primary" onclick="Users.saveUserEdit('${userId}')">
                        <i class="fas fa-save"></i>
                        儲存變更
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    saveUserEdit(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        user.name = document.getElementById('editUserName').value.trim();
        user.email = document.getElementById('editUserEmail').value.trim();
        user.phone = document.getElementById('editUserPhone').value.trim();
        user.status = document.getElementById('editUserStatus').value;

        this.saveUsers();
        this.renderUserList();
        this.updateStats();

        document.querySelector('.modal-overlay').remove();
        Utils.showToast('用戶資訊已更新', 'success');
    },

    sendMessage(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        Utils.showToast(`正在開啟與 ${user.name} 的對話...`, 'info');
        setTimeout(() => {
            App.loadPage('livechat');
        }, 500);
    },

    deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        if (!confirm(`確定要刪除用戶「${user.name}」嗎？此操作無法復原。`)) {
            return;
        }

        this.users = this.users.filter(u => u.id !== userId);
        this.saveUsers();
        this.calculatePagination();
        this.renderUserList();
        this.updateStats();

        Utils.showToast('用戶已刪除', 'success');
    },

    exportUsers() {
        const filteredUsers = this.getFilteredUsers();
        const csv = this.convertToCSV(filteredUsers);
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `users_export_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Utils.showToast('用戶資料已匯出', 'success');
    },

    convertToCSV(users) {
        const headers = ['ID', '姓名', 'Email', '電話', '平台', '狀態', '訂閱日期', '訊息數量'];
        const rows = users.map(user => [
            user.id,
            user.name,
            user.email,
            user.phone,
            user.platform,
            this.getStatusInfo(user.status),
            new Date(user.subscribedAt).toLocaleDateString('zh-TW'),
            user.messageCount
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        return csvContent;
    },

    destroy() {
        // Cleanup if needed
    }
};
```
