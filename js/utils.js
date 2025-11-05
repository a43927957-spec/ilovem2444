// ========================================
// 工具函數庫
// ========================================

const Utils = {
    // Toast 通知
    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        }[type];
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    // 載入動畫
    showLoading() {
        document.getElementById('loadingOverlay').classList.add('active');
    },
    
    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    },
    
    // 格式化日期
    formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    },
    
    // 格式化日期時間
    formatDateTime(date) {
        const d = new Date(date);
        return d.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // 格式化數字
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    // 格式化金額
    formatCurrency(amount, currency = 'NT$') {
        return `${currency} ${this.formatNumber(amount)}`;
    },
    
    // 生成唯一ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // 防抖函數
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 節流函數
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // 深拷貝
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // 驗證Email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // 驗證密碼強度
    validatePassword(password) {
        // 至少8個字符，包含字母和數字
        const minLength = password.length >= 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        
        return {
            valid: minLength && hasLetter && hasNumber,
            minLength,
            hasLetter,
            hasNumber
        };
    },
    
    // LocalStorage 操作
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        },
        
        get(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Storage get error:', e);
                return null;
            }
        },
        
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Storage remove error:', e);
                return false;
            }
        },
        
        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('Storage clear error:', e);
                return false;
            }
        }
    },
    
    // API 請求封裝
    async apiRequest(endpoint, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const config = { ...defaultOptions, ...options };
        
        // 添加認證token
        const token = this.storage.get('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(endpoint, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || '請求失敗');
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('API request error:', error);
            return { success: false, error: error.message };
        }
    },
    
    // 檢查設備類型
    device: {
        isMobile: () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
        isIOS: () => /iPhone|iPad|iPod/i.test(navigator.userAgent),
        isAndroid: () => /Android/i.test(navigator.userAgent),
        isIPhone: () => /iPhone/i.test(navigator.userAgent),
        
        // 檢測iPhone型號
        getIOSVersion: () => {
            const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
            return match ? parseInt(match[1], 10) : null;
        }
    },
    
    // 剪貼簿操作
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('已複製到剪貼簿', 'success');
            return true;
        } catch (err) {
            console.error('Copy failed:', err);
            this.showToast('複製失敗', 'error');
            return false;
        }
    },
    
    // 文件下載
    downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },
    
    // 圖片壓縮
    async compressImage(file, maxWidth = 1200, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, file.type, quality);
                };
                
                img.onerror = reject;
            };
            
            reader.onerror = reject;
        });
    }
};

// 全局錯誤處理
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // 在開發環境中顯示錯誤
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('sandbox')) {
        alert('JavaScript Error: ' + e.message + '\nFile: ' + e.filename + '\nLine: ' + e.lineno);
    }
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled rejection:', e.reason);
});

// 檢測網路狀態
window.addEventListener('online', () => {
    Utils.showToast('網路已連接', 'success');
});

window.addEventListener('offline', () => {
    Utils.showToast('網路已斷線', 'warning');
});
