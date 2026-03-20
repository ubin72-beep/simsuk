// ============================================
// 심석 관리자 페이지 v8.0 COMPLETE - localStorage 완벽 동기화
// 제품 추가 시 메인/제품/모바일 모든 페이지에 즉시 반영
// 작성일: 2026-03-17
// ============================================

console.log('✅ 심석 관리자 v8.0 COMPLETE 로드 시작...');

// ===== 전역 변수 =====
const ADMIN_ACCOUNTS = [
    { username: 'admin', password: 'simsuk2026' },
    { username: 'simsuk', password: 'admin1234' }
];

let products = [];
let orders = [];
let discounts = [];
let currentEditId = null;
let currentTab = 'dashboard';
let autoRefreshInterval = null;
let isAutoRefreshEnabled = true;

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 DOM 로드 완료');
    checkAuth();
});

// ===== 인증 =====
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showAdminPage();
    } else {
        showLoginForm();
    }
}

function showLoginForm() {
    document.body.innerHTML = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 50px rgba(0,0,0,0.3); max-width: 400px; width: 90%;">
                <h1 style="text-align: center; color: #2c5f4f; margin-bottom: 30px;">
                    <i class="fas fa-gem"></i> 심석 관리자
                </h1>
                <form onsubmit="handleLogin(event)" style="display: flex; flex-direction: column; gap: 15px;">
                    <input type="text" id="username" placeholder="아이디" 
                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px;" 
                           required autofocus>
                    <input type="password" id="password" placeholder="비밀번호" 
                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px;" 
                           required>
                    <button type="submit" 
                            style="width: 100%; padding: 15px; background: #667eea; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer;">
                        <i class="fas fa-sign-in-alt"></i> 로그인
                    </button>
                </form>
            </div>
        </div>
    `;
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    const account = ADMIN_ACCOUNTS.find(acc => 
        acc.username === username && acc.password === password
    );
    
    if (account) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminUsername', username);
        location.reload();
    } else {
        alert('❌ 아이디 또는 비밀번호가 올바르지 않습니다.');
    }
}

function logout() {
    sessionStorage.clear();
    location.reload();
}

// ===== 관리자 페이지 표시 =====
function showAdminPage() {
    console.log('🎨 관리자 페이지 로드...');
    loadProducts();
    loadOrders();
    loadDiscounts();
    updateStats();
    updateTabBadges();
    startAutoRefresh();
}

// ===== 데이터 로드 =====
function loadProducts() {
    const stored = localStorage.getItem('adminProducts') || localStorage.getItem('products');
    
    if (stored) {
        try {
            products = JSON.parse(stored);
            console.log('✅ 제품 로드:', products.length, '개');
        } catch (error) {
            console.error('❌ 제품 파싱 오류:', error);
            products = [];
        }
    } else {
        products = [];
        console.log('⚠️ localStorage 비어있음 - 빈 배열로 시작');
    }
    
    window.adminProducts = products;
    return products;
}

function loadOrders() {
    const stored = localStorage.getItem('orders');
    orders = stored ? JSON.parse(stored) : [];
    window.adminOrders = orders;
    return orders;
}

function loadDiscounts() {
    const stored = localStorage.getItem('discounts');
    discounts = stored ? JSON.parse(stored) : [];
    return discounts;
}

// ===== 데이터 저장 (완벽한 동기화) =====
function saveProducts() {
    try {
        const dataStr = JSON.stringify(products);
        
        // 1. 관리자용 저장소
        localStorage.setItem('adminProducts', dataStr);
        
        // 2. 메인/제품 페이지용 저장소
        localStorage.setItem('products', dataStr);
        
        // 3. 보호된 백업
        localStorage.setItem('PROTECTED_DATA_DO_NOT_DELETE', dataStr);
        
        // 4. 타임스탬프 백업
        const timestamp = Date.now();
        localStorage.setItem(`adminProducts_backup_${timestamp}`, dataStr);
        
        // 오래된 백업 삭제 (최근 5개만 유지)
        const allKeys = Object.keys(localStorage);
        const backupKeys = allKeys.filter(key => key.startsWith('adminProducts_backup_')).sort().reverse();
        backupKeys.slice(5).forEach(key => localStorage.removeItem(key));
        
        // 5. 다른 탭에 변경 알림
        window.dispatchEvent(new Event('storage'));
        
        console.log('✅ 제품 저장 완료:', products.length, '개');
        
        return true;
    } catch (error) {
        console.error('❌ 제품 저장 오류:', error);
        alert('⚠️ 제품 저장 중 오류가 발생했습니다!\n\n' + error.message);
        return false;
    }
}

function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function saveDiscounts() {
    localStorage.setItem('discounts', JSON.stringify(discounts));
}

// ===== 통계 업데이트 =====
function updateStats() {
    updateElement('totalProducts', products.length);
    updateElement('necklaceCount', products.filter(p => p.category === '목걸이').length);
    updateElement('braceletCount', products.filter(p => p.category === '팔찌').length);
    updateElement('ringCount', products.filter(p => p.category === '반지').length);
    updateElement('phoneStrapCount', products.filter(p => p.category === '핸드폰 줄').length);
    updateElement('totalOrders', orders.length);
    updateElement('pendingOrders', orders.filter(o => o.status === 'pending').length);
    updateElement('completedOrders', orders.filter(o => o.status === 'completed').length);
}

function updateTabBadges() {
    updateElement('productsCount', products.length);
    updateElement('ordersCount', orders.length);
    updateElement('discountsTabBadge', discounts.length);
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

// ===== 탭 전환 =====
function switchTab(tabName) {
    // 모든 탭 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // 선택된 탭 활성화
    event.target.closest('.tab-btn').classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    currentTab = tabName;
    
    // 제품 탭이면 제품 목록 렌더링
    if (tabName === 'products') {
        renderProductList();
    }
    
    // 주문 탭이면 주문 목록 렌더링
    if (tabName === 'orders') {
        renderOrderList();
    }
    
    // 할인 탭이면 할인 목록 렌더링
    if (tabName === 'discounts') {
        renderDiscountList();
    }
}

// ===== 제품 관리 =====
function renderProductList() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">등록된 제품이 없습니다</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>
                <img src="${product.image_url || 'https://placehold.co/50x50/2c5f4f/ffffff?text=No+Image'}" 
                     alt="${product.name}" 
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
            </td>
            <td><strong>${product.name}</strong></td>
            <td>${product.category}</td>
            <td>${product.price.toLocaleString()}원</td>
            <td>
                <span class="badge ${product.in_stock ? 'badge-success' : 'badge-danger'}">
                    ${product.in_stock ? '재고 있음' : '품절'}
                </span>
            </td>
            <td>
                <button onclick="editProduct(${product.id})" class="btn btn-sm btn-primary">
                    <i class="fas fa-edit"></i> 수정
                </button>
                <button onclick="deleteProduct(${product.id})" class="btn btn-sm btn-danger">
                    <i class="fas fa-trash"></i> 삭제
                </button>
            </td>
        </tr>
    `).join('');
}

function openProductModal(productId = null) {
    currentEditId = productId;
    const product = productId ? products.find(p => p.id === productId) : null;
    
    // 모달 제목
    document.getElementById('modalTitle').textContent = product ? '제품 수정' : '제품 추가';
    
    // 폼 초기화 또는 데이터 입력
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productMaterials').value = product.materials || '';
        document.getElementById('productBenefits').value = product.benefits || '';
        document.getElementById('productImageUrl').value = product.image_url || '';
        document.getElementById('productFeatured').checked = product.featured || false;
        document.getElementById('productInStock').checked = product.in_stock !== false;
    } else {
        document.getElementById('productForm').reset();
        document.getElementById('productInStock').checked = true;
    }
    
    // 모달 표시
    document.getElementById('productModal').style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
    currentEditId = null;
}

function saveProductFromForm(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value.trim(),
        materials: document.getElementById('productMaterials').value.trim(),
        benefits: document.getElementById('productBenefits').value.trim(),
        image_url: document.getElementById('productImageUrl').value.trim(),
        featured: document.getElementById('productFeatured').checked,
        in_stock: document.getElementById('productInStock').checked,
        birthstone_months: [],
        special_occasions: ['일상'],
        naver_link: 'https://smartstore.naver.com/simsuk',
        coupang_link: 'https://www.coupang.com'
    };
    
    if (currentEditId) {
        // 수정
        const index = products.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
            products[index] = { ...products[index], ...formData };
            console.log('✅ 제품 수정:', formData.name);
        }
    } else {
        // 추가
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, ...formData });
        console.log('✅ 제품 추가:', formData.name);
    }
    
    // 저장 및 UI 업데이트
    if (saveProducts()) {
        closeProductModal();
        renderProductList();
        updateStats();
        updateTabBadges();
        alert('✅ 제품이 저장되었습니다!\n\n메인 페이지와 제품 페이지에서 즉시 확인할 수 있습니다.');
    }
}

function editProduct(productId) {
    openProductModal(productId);
}

function deleteProduct(productId) {
    if (confirm('정말 이 제품을 삭제하시겠습니까?')) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        renderProductList();
        updateStats();
        updateTabBadges();
        alert('✅ 제품이 삭제되었습니다!');
    }
}

// ===== 주문 관리 =====
function renderOrderList() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">등록된 주문이 없습니다</td></tr>';
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer_name}</td>
            <td>${order.product_name}</td>
            <td>${order.total_price.toLocaleString()}원</td>
            <td>${order.order_date}</td>
            <td>
                <select onchange="updateOrderStatus(${order.id}, this.value)" class="form-control">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>대기중</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>처리중</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>완료</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>취소</option>
                </select>
            </td>
            <td>
                <button onclick="viewOrder(${order.id})" class="btn btn-sm btn-info">
                    <i class="fas fa-eye"></i> 상세
                </button>
            </td>
        </tr>
    `).join('');
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        saveOrders();
        updateStats();
        alert('✅ 주문 상태가 업데이트되었습니다!');
    }
}

// ===== 할인 관리 =====
function renderDiscountList() {
    const tbody = document.getElementById('discountsTableBody');
    if (!tbody) return;
    
    if (discounts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">등록된 할인이 없습니다</td></tr>';
        return;
    }
    
    tbody.innerHTML = discounts.map(discount => `
        <tr>
            <td>${discount.id}</td>
            <td><strong>${discount.code}</strong></td>
            <td>${discount.type === 'percentage' ? discount.value + '%' : discount.value.toLocaleString() + '원'}</td>
            <td>${discount.min_purchase.toLocaleString()}원</td>
            <td>
                <span class="badge ${discount.active ? 'badge-success' : 'badge-danger'}">
                    ${discount.active ? '활성' : '비활성'}
                </span>
            </td>
            <td>
                <button onclick="deleteDiscount(${discount.id})" class="btn btn-sm btn-danger">
                    <i class="fas fa-trash"></i> 삭제
                </button>
            </td>
        </tr>
    `).join('');
}

// ===== 자동 새로고침 =====
function startAutoRefresh() {
    if (isAutoRefreshEnabled) {
        autoRefreshInterval = setInterval(() => {
            loadProducts();
            loadOrders();
            updateStats();
            updateTabBadges();
            
            if (currentTab === 'products') renderProductList();
            if (currentTab === 'orders') renderOrderList();
            if (currentTab === 'discounts') renderDiscountList();
        }, 30000); // 30초마다
    }
}

function toggleAutoRefresh() {
    isAutoRefreshEnabled = !isAutoRefreshEnabled;
    const btn = document.getElementById('autoRefreshToggle');
    
    if (isAutoRefreshEnabled) {
        startAutoRefresh();
        btn.innerHTML = '<i class="fas fa-sync fa-spin"></i> 자동새로고침 중';
        btn.classList.add('btn-primary');
    } else {
        clearInterval(autoRefreshInterval);
        btn.innerHTML = '<i class="fas fa-sync"></i> 자동새로고침 꺼짐';
        btn.classList.remove('btn-primary');
    }
}

// ===== 전역 함수 노출 =====
window.checkAuth = checkAuth;
window.handleLogin = handleLogin;
window.logout = logout;
window.switchTab = switchTab;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.saveProductFromForm = saveProductFromForm;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.updateOrderStatus = updateOrderStatus;
window.toggleAutoRefresh = toggleAutoRefresh;

console.log('✅ 심석 관리자 v8.0 COMPLETE 로드 완료!');
