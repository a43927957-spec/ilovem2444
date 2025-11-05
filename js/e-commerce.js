// E-commerce Module
const Ecommerce = {
    products: [],
    orders: [],
    currentView: 'products',
    stats: {
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        pendingOrders: 0
    },

    init() {
        console.log('E-commerce module initialized');
        this.loadData();
        this.calculateStats();
        this.renderStats();
        this.showProductsView();
        this.bindEvents();
    },

    loadData() {
        // Load products from localStorage
        const storedProducts = Utils.storage.get('products');
        if (storedProducts) {
            this.products = storedProducts;
        } else {
            this.products = this.generateSampleProducts();
            this.saveProducts();
        }

        // Load orders from localStorage
        const storedOrders = Utils.storage.get('orders');
        if (storedOrders) {
            this.orders = storedOrders;
        } else {
            this.orders = this.generateSampleOrders();
            this.saveOrders();
        }
    },

    generateSampleProducts() {
        return [
            {
                id: 'prod-001',
                name: 'iPhone 16 Pro Max',
                description: '最新款 iPhone，搭載 A18 Pro 晶片',
                price: 45900,
                stock: 25,
                category: '3C電子',
                image: '📱',
                status: 'active',
                createdAt: Date.now() - (30 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'prod-002',
                name: 'AirPods Pro 第二代',
                description: '主動降噪無線耳機',
                price: 7490,
                stock: 50,
                category: '3C電子',
                image: '🎧',
                status: 'active',
                createdAt: Date.now() - (25 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'prod-003',
                name: 'MacBook Air M3',
                description: '輕薄高效能筆記型電腦',
                price: 36900,
                stock: 15,
                category: '3C電子',
                image: '💻',
                status: 'active',
                createdAt: Date.now() - (20 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'prod-004',
                name: 'Apple Watch Series 9',
                description: '健康監測智慧手錶',
                price: 12900,
                stock: 30,
                category: '穿戴裝置',
                image: '⌚',
                status: 'active',
                createdAt: Date.now() - (15 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'prod-005',
                name: 'iPad Pro 12.9"',
                description: 'M2 晶片專業平板電腦',
                price: 35900,
                stock: 20,
                category: '3C電子',
                image: '📲',
                status: 'active',
                createdAt: Date.now() - (10 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'prod-006',
                name: '無線充電板',
                description: '快速無線充電座',
                price: 1290,
                stock: 0,
                category: '配件',
                image: '🔌',
                status: 'inactive',
                createdAt: Date.now() - (5 * 24 * 60 * 60 * 1000)
            }
        ];
    },

    generateSampleOrders() {
        const orders = [];
        const statuses = ['pending', 'processing', 'completed', 'cancelled'];
        const products = this.products;

        for (let i = 0; i < 30; i++) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const status = i < 5 ? 'pending' : i < 10 ? 'processing' : i < 25 ? 'completed' : 'cancelled';
            const daysAgo = Math.floor(Math.random() * 60);

            orders.push({
                id: 'order-' + (10000 + i),
                customerName: '客戶 ' + (i + 1),
                customerId: 'user-' + (1000 + Math.floor(Math.random() * 50)),
                product: randomProduct.name,
                productId: randomProduct.id,
                quantity: quantity,
                totalAmount: randomProduct.price * quantity,
                status: status,
                createdAt: Date.now() - (daysAgo * 24 * 60 * 60 * 1000),
                shippingAddress: '台北市信義區信義路五段7號',
                phone: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
            });
        }

        return orders;
    },

    saveProducts() {
        Utils.storage.set('products', this.products);
    },

    saveOrders() {
        Utils.storage.set('orders', this.orders);
    },

    calculateStats() {
        this.stats.totalProducts = this.products.length;
        this.stats.totalOrders = this.orders.length;
        this.stats.pendingOrders = this.orders.filter(o => o.status === 'pending').length;
        this.stats.totalRevenue = this.orders
            .filter(o => o.status === 'completed')
            .reduce((sum, order) => sum + order.totalAmount, 0);
    },

    renderStats() {
        document.getElementById('totalRevenueAmount').textContent = Utils.formatCurrency(this.stats.totalRevenue);
        document.getElementById('totalOrdersCount').textContent = Utils.formatNumber(this.stats.totalOrders);
        document.getElementById('totalProductsCount').textContent = Utils.formatNumber(this.stats.totalProducts);
        document.getElementById('pendingOrdersCount').textContent = Utils.formatNumber(this.stats.pendingOrders);
    },

    bindEvents() {
        // View switcher
        const productsTab = document.getElementById('showProductsTab');
        const ordersTab = document.getElementById('showOrdersTab');

        if (productsTab) {
            productsTab.addEventListener('click', () => {
                this.currentView = 'products';
                this.showProductsView();
            });
        }

        if (ordersTab) {
            ordersTab.addEventListener('click', () => {
                this.currentView = 'orders';
                this.showOrdersView();
            });
        }

        // Add product button
        const addProductBtn = document.getElementById('addProductBtn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => this.showAddProductModal());
        }
    },

    showProductsView() {
        document.getElementById('showProductsTab').classList.add('active');
        document.getElementById('showOrdersTab').classList.remove('active');
        document.getElementById('productsView').style.display = 'block';
        document.getElementById('ordersView').style.display = 'none';
        this.renderProducts();
    },

    showOrdersView() {
        document.getElementById('showProductsTab').classList.remove('active');
        document.getElementById('showOrdersTab').classList.add('active');
        document.getElementById('productsView').style.display = 'none';
        document.getElementById('ordersView').style.display = 'block';
        this.renderOrders();
    },

    renderProducts() {
        const container = document.getElementById('productsGrid');
        if (!container) return;

        if (this.products.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box"></i>
                    <h3>還沒有商品</h3>
                    <p>新增你的第一個商品開始銷售</p>
                    <button class="btn-primary" onclick="Ecommerce.showAddProductModal()">
                        <i class="fas fa-plus"></i>
                        新增商品
                    </button>
                </div>
            `;
            return;
        }

        const productCards = this.products.map(product => {
            const stockStatus = product.stock > 0 ? 'in-stock' : 'out-of-stock';
            const stockText = product.stock > 0 ? `庫存 ${product.stock}` : '缺貨';
            const statusClass = product.status === 'active' ? 'status-active' : 'status-inactive';
            const statusText = product.status === 'active' ? '上架中' : '已下架';

            return `
                <div class="product-card">
                    <div class="product-image">${product.image}</div>
                    <div class="product-info">
                        <div class="product-header">
                            <h3 class="product-name">${product.name}</h3>
                            <span class="product-status ${statusClass}">${statusText}</span>
                        </div>
                        <p class="product-description">${product.description}</p>
                        <div class="product-meta">
                            <span class="product-category">
                                <i class="fas fa-tag"></i>
                                ${product.category}
                            </span>
                            <span class="product-stock ${stockStatus}">
                                <i class="fas fa-box"></i>
                                ${stockText}
                            </span>
                        </div>
                        <div class="product-footer">
                            <div class="product-price">${Utils.formatCurrency(product.price)}</div>
                            <div class="product-actions">
                                <button class="btn-icon" onclick="Ecommerce.editProduct('${product.id}')" title="編輯">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon" onclick="Ecommerce.toggleProductStatus('${product.id}')" title="${product.status === 'active' ? '下架' : '上架'}">
                                    <i class="fas fa-${product.status === 'active' ? 'eye-slash' : 'eye'}"></i>
                                </button>
                                <button class="btn-icon btn-icon-danger" onclick="Ecommerce.deleteProduct('${product.id}')" title="刪除">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = productCards;
    },

    renderOrders() {
        const container = document.getElementById('ordersTableBody');
        if (!container) return;

        if (this.orders.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <i class="fas fa-shopping-cart" style="font-size: 48px; color: #ddd; margin-bottom: 16px;"></i>
                        <p style="color: #666;">還沒有訂單</p>
                    </td>
                </tr>
            `;
            return;
        }

        const orderRows = this.orders.map(order => {
            const statusInfo = this.getOrderStatusInfo(order.status);
            const orderDate = new Date(order.createdAt).toLocaleDateString('zh-TW');

            return `
                <tr>
                    <td><strong>${order.id}</strong></td>
                    <td>${order.customerName}</td>
                    <td>${order.product} × ${order.quantity}</td>
                    <td>${Utils.formatCurrency(order.totalAmount)}</td>
                    <td>
                        <span class="order-status status-${order.status}">
                            <i class="${statusInfo.icon}"></i>
                            ${statusInfo.text}
                        </span>
                    </td>
                    <td>${orderDate}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-icon" onclick="Ecommerce.viewOrder('${order.id}')" title="查看詳情">
                                <i class="fas fa-eye"></i>
                            </button>
                            ${order.status === 'pending' ? `
                                <button class="btn-icon" onclick="Ecommerce.processOrder('${order.id}')" title="處理訂單">
                                    <i class="fas fa-check"></i>
                                </button>
                            ` : ''}
                            ${order.status !== 'cancelled' && order.status !== 'completed' ? `
                                <button class="btn-icon btn-icon-danger" onclick="Ecommerce.cancelOrder('${order.id}')" title="取消訂單">
                                    <i class="fas fa-times"></i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        container.innerHTML = orderRows;
    },

    getOrderStatusInfo(status) {
        const statuses = {
            pending: { text: '待處理', icon: 'fas fa-clock' },
            processing: { text: '處理中', icon: 'fas fa-spinner' },
            completed: { text: '已完成', icon: 'fas fa-check-circle' },
            cancelled: { text: '已取消', icon: 'fas fa-times-circle' }
        };
        return statuses[status] || statuses.pending;
    },

    showAddProductModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-plus"></i> 新增商品</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>商品名稱</label>
                        <input type="text" id="newProductName" class="form-control" placeholder="輸入商品名稱">
                    </div>
                    <div class="form-group">
                        <label>商品描述</label>
                        <textarea id="newProductDescription" class="form-control" rows="3" placeholder="描述商品特色..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>價格 (NT$)</label>
                        <input type="number" id="newProductPrice" class="form-control" placeholder="0" min="0">
                    </div>
                    <div class="form-group">
                        <label>庫存數量</label>
                        <input type="number" id="newProductStock" class="form-control" placeholder="0" min="0">
                    </div>
                    <div class="form-group">
                        <label>分類</label>
                        <input type="text" id="newProductCategory" class="form-control" placeholder="例如：3C電子">
                    </div>
                    <div class="form-group">
                        <label>商品圖示</label>
                        <div class="emoji-picker">
                            <button class="emoji-option" data-emoji="📱">📱</button>
                            <button class="emoji-option" data-emoji="💻">💻</button>
                            <button class="emoji-option" data-emoji="⌚">⌚</button>
                            <button class="emoji-option" data-emoji="🎧">🎧</button>
                            <button class="emoji-option" data-emoji="📷">📷</button>
                            <button class="emoji-option" data-emoji="🎮">🎮</button>
                            <button class="emoji-option" data-emoji="📲">📲</button>
                            <button class="emoji-option" data-emoji="🔌">🔌</button>
                            <button class="emoji-option" data-emoji="🛍️">🛍️</button>
                            <button class="emoji-option" data-emoji="📦">📦</button>
                        </div>
                        <input type="hidden" id="newProductImage" value="📱">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">取消</button>
                    <button class="btn-primary" onclick="Ecommerce.createProduct()">
                        <i class="fas fa-plus"></i>
                        新增商品
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Emoji picker functionality
        modal.querySelectorAll('.emoji-option').forEach(btn => {
            btn.addEventListener('click', function() {
                modal.querySelectorAll('.emoji-option').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                document.getElementById('newProductImage').value = this.dataset.emoji;
            });
        });

        modal.querySelector('.emoji-option').classList.add('active');
    },

    createProduct() {
        const name = document.getElementById('newProductName').value.trim();
        const description = document.getElementById('newProductDescription').value.trim();
        const price = parseFloat(document.getElementById('newProductPrice').value);
        const stock = parseInt(document.getElementById('newProductStock').value);
        const category = document.getElementById('newProductCategory').value.trim();
        const image = document.getElementById('newProductImage').value;

        if (!name) {
            Utils.showToast('請輸入商品名稱', 'error');
            return;
        }

        if (!price || price <= 0) {
            Utils.showToast('請輸入有效的價格', 'error');
            return;
        }

        if (!stock || stock < 0) {
            Utils.showToast('請輸入有效的庫存數量', 'error');
            return;
        }

        const newProduct = {
            id: 'prod-' + Date.now(),
            name: name,
            description: description || '新商品',
            price: price,
            stock: stock,
            category: category || '未分類',
            image: image,
            status: 'active',
            createdAt: Date.now()
        };

        this.products.unshift(newProduct);
        this.saveProducts();
        this.calculateStats();
        this.renderStats();
        this.renderProducts();

        document.querySelector('.modal-overlay').remove();
        Utils.showToast('商品已新增', 'success');
    },

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-edit"></i> 編輯商品</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>商品名稱</label>
                        <input type="text" id="editProductName" class="form-control" value="${product.name}">
                    </div>
                    <div class="form-group">
                        <label>商品描述</label>
                        <textarea id="editProductDescription" class="form-control" rows="3">${product.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>價格 (NT$)</label>
                        <input type="number" id="editProductPrice" class="form-control" value="${product.price}" min="0">
                    </div>
                    <div class="form-group">
                        <label>庫存數量</label>
                        <input type="number" id="editProductStock" class="form-control" value="${product.stock}" min="0">
                    </div>
                    <div class="form-group">
                        <label>分類</label>
                        <input type="text" id="editProductCategory" class="form-control" value="${product.category}">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">取消</button>
                    <button class="btn-primary" onclick="Ecommerce.saveProductEdit('${productId}')">
                        <i class="fas fa-save"></i>
                        儲存變更
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    saveProductEdit(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        product.name = document.getElementById('editProductName').value.trim();
        product.description = document.getElementById('editProductDescription').value.trim();
        product.price = parseFloat(document.getElementById('editProductPrice').value);
        product.stock = parseInt(document.getElementById('editProductStock').value);
        product.category = document.getElementById('editProductCategory').value.trim();

        this.saveProducts();
        this.renderProducts();

        document.querySelector('.modal-overlay').remove();
        Utils.showToast('商品已更新', 'success');
    },

    toggleProductStatus(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        product.status = product.status === 'active' ? 'inactive' : 'active';
        this.saveProducts();
        this.renderProducts();

        const statusText = product.status === 'active' ? '已上架' : '已下架';
        Utils.showToast(`商品${statusText}`, 'success');
    },

    deleteProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        if (!confirm(`確定要刪除商品「${product.name}」嗎？此操作無法復原。`)) {
            return;
        }

        this.products = this.products.filter(p => p.id !== productId);
        this.saveProducts();
        this.calculateStats();
        this.renderStats();
        this.renderProducts();

        Utils.showToast('商品已刪除', 'success');
    },

    viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const statusInfo = this.getOrderStatusInfo(order.status);
        const orderDate = new Date(order.createdAt).toLocaleString('zh-TW');

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2><i class="fas fa-shopping-cart"></i> 訂單詳情</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="order-detail-grid">
                        <div class="order-detail-section">
                            <h3>訂單資訊</h3>
                            <div class="detail-item">
                                <label>訂單編號</label>
                                <div><strong>${order.id}</strong></div>
                            </div>
                            <div class="detail-item">
                                <label>訂單狀態</label>
                                <div>
                                    <span class="order-status status-${order.status}">
                                        <i class="${statusInfo.icon}"></i>
                                        ${statusInfo.text}
                                    </span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <label>訂單日期</label>
                                <div>${orderDate}</div>
                            </div>
                        </div>
                        
                        <div class="order-detail-section">
                            <h3>客戶資訊</h3>
                            <div class="detail-item">
                                <label>客戶姓名</label>
                                <div>${order.customerName}</div>
                            </div>
                            <div class="detail-item">
                                <label>聯絡電話</label>
                                <div>${order.phone}</div>
                            </div>
                            <div class="detail-item">
                                <label>配送地址</label>
                                <div>${order.shippingAddress}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="order-detail-section">
                        <h3>訂單明細</h3>
                        <table class="order-items-table">
                            <thead>
                                <tr>
                                    <th>商品名稱</th>
                                    <th>數量</th>
                                    <th>金額</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${order.product}</td>
                                    <td>${order.quantity}</td>
                                    <td>${Utils.formatCurrency(order.totalAmount)}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2"><strong>總計</strong></td>
                                    <td><strong>${Utils.formatCurrency(order.totalAmount)}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">關閉</button>
                    ${order.status === 'pending' ? `
                        <button class="btn-primary" onclick="Ecommerce.processOrder('${orderId}'); this.closest('.modal-overlay').remove();">
                            <i class="fas fa-check"></i>
                            處理訂單
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    processOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        order.status = 'processing';
        this.saveOrders();
        this.calculateStats();
        this.renderStats();
        this.renderOrders();

        Utils.showToast('訂單已開始處理', 'success');
    },

    cancelOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        if (!confirm(`確定要取消訂單 ${orderId} 嗎？`)) {
            return;
        }

        order.status = 'cancelled';
        this.saveOrders();
        this.calculateStats();
        this.renderStats();
        this.renderOrders();

        Utils.showToast('訂單已取消', 'success');
    },

    destroy() {
        // Cleanup if needed
    }
};
```
