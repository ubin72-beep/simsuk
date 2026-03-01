// ============================================
// 심석 관리자 페이지 v3.0 - 완전한 E-Commerce 시스템
// 제품 관리, 주문 관리, 통계 포함
// 작성일: 2026-03-01
// ============================================

console.log('✅ 심석 관리자 v3.0 (완전판) 로드 시작...');

// ===== 전역 변수 =====
const ADMIN_PASSWORD = 'admin';
let products = [];
let orders = [];
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
                <form onsubmit="handleLogin(event)" style="display: flex; flex-direction: column; gap: 20px;">
                    <input type="password" id="password" placeholder="비밀번호 (admin)" 
                           style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px;" required autofocus>
                    <button type="submit" style="width: 100%; padding: 15px; background: #667eea; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer;">
                        로그인
                    </button>
                </form>
            </div>
        </div>
    `;
}

function handleLogin(event) {
    event.preventDefault();
    if (document.getElementById('password').value === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        location.reload();
    } else {
        alert('❌ 비밀번호가 올바르지 않습니다.');
    }
}

function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        sessionStorage.removeItem('adminLoggedIn');
        location.reload();
    }
}

// ===== 관리자 페이지 표시 =====
function showAdminPage() {
    loadProducts();
    loadOrders();
    setTimeout(() => {
        updateStats();
        updateTabBadges();
    }, 100);
    setTimeout(startAutoRefresh, 1000);
}

// ===== 데이터 로드 =====
function loadProducts() {
    const stored = localStorage.getItem('adminProducts');
    if (stored) {
        products = JSON.parse(stored);
    } else {
        products = [
            {id: Date.now() + 1, name: '헤마타이트 목걸이', category: '목걸이', price: 69000, image_url: 'https://placehold.co/400x400/2c5f4f/ffffff?text=Hematite+Necklace', description: '강력한 자기력', materials: '헤마타이트', benefits: '혈액순환', featured: true, in_stock: true},
            {id: Date.now() + 2, name: '헤마타이트 팔찌', category: '팔찌', price: 49000, image_url: 'https://placehold.co/400x400/2c5f4f/ffffff?text=Hematite+Bracelet', description: '데일리 착용', materials: '헤마타이트', benefits: '자기력 에너지', featured: true, in_stock: true},
            {id: Date.now() + 3, name: '헤마타이트 반지', category: '반지', price: 39000, image_url: 'https://placehold.co/400x400/2c5f4f/ffffff?text=Hematite+Ring', description: '심플 스타일', materials: '헤마타이트', benefits: '집중력', featured: false, in_stock: true},
            {id: Date.now() + 4, name: '가넷 목걸이', category: '목걸이', price: 79000, image_url: 'https://placehold.co/400x400/8b0000/ffffff?text=Garnet', description: '1월 탄생석', materials: '가넷', benefits: '정열', featured: true, in_stock: true},
            {id: Date.now() + 5, name: '자수정 팔찌', category: '팔찌', price: 59000, image_url: 'https://placehold.co/400x400/9966cc/ffffff?text=Amethyst', description: '2월 탄생석', materials: '자수정', benefits: '평온', featured: false, in_stock: true},
            {id: Date.now() + 6, name: '아쿠아마린 반지', category: '반지', price: 89000, image_url: 'https://placehold.co/400x400/7fffd4/000000?text=Aquamarine', description: '3월 탄생석', materials: '아쿠아마린', benefits: '용기', featured: false, in_stock: true}
        ];
        saveProducts();
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

function saveProducts() {
    localStorage.setItem('adminProducts', JSON.stringify(products));
    localStorage.setItem('products', JSON.stringify(products)); // 메인 페이지용
    window.dispatchEvent(new Event('storage')); // 메인 페이지 자동 새로고침
}

function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

// ===== 통계 =====
function updateStats() {
    updateElement('totalProducts', products.length);
    updateElement('necklaceCount', products.filter(p => p.category === '목걸이').length);
    updateElement('braceletCount', products.filter(p => p.category === '팔찌').length);
    updateElement('ringCount', products.filter(p => p.category === '반지').length);
    updateElement('phoneCount', products.filter(p => p.category === '핸드폰 줄').length);
    updateElement('totalOrders', orders.length);
    updateElement('pendingOrders', orders.filter(o => o.status === '접수' || o.status === '확인중').length);
}

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function updateTabBadges() {
    updateElement('productsCount', products.length);
    updateElement('ordersCount', orders.length);
}

// ===== 탭 전환 =====
function switchTab(tabName) {
    currentTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event?.target?.closest('.tab-btn')?.classList.add('active');
    document.getElementById(tabName + 'Tab')?.classList.add('active');
    
    if (tabName === 'products') renderProductsTable();
    else if (tabName === 'orders') renderOrdersTable();
}

// ===== 제품 테이블 =====
function renderProductsTable() {
    const container = document.getElementById('productsTableContainer');
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><h3>등록된 제품이 없습니다</h3></div>';
        return;
    }
    
    container.innerHTML = `
        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>이미지</th>
                        <th>제품명</th>
                        <th>카테고리</th>
                        <th>가격</th>
                        <th>재고</th>
                        <th>액션</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(p => `
                        <tr>
                            <td><img src="${p.image_url}" alt="${p.name}"></td>
                            <td>${p.name}</td>
                            <td>${p.category}</td>
                            <td>${p.price.toLocaleString()}원</td>
                            <td><span class="badge ${p.in_stock ? 'badge-success' : 'badge-danger'}">${p.in_stock ? '재고있음' : '품절'}</span></td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ===== 주문 테이블 =====
function renderOrdersTable() {
    const container = document.getElementById('ordersTableContainer');
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-shopping-cart"></i><h3>주문이 없습니다</h3></div>';
        return;
    }
    
    container.innerHTML = `
        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>주문번호</th>
                        <th>고객명</th>
                        <th>전화번호</th>
                        <th>금액</th>
                        <th>상태</th>
                        <th>주문일</th>
                        <th>액션</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(o => `
                        <tr>
                            <td>#${String(o.id).substr(-6)}</td>
                            <td>${o.name}</td>
                            <td>${o.phone}</td>
                            <td>${(o.total || 0).toLocaleString()}원</td>
                            <td><span class="badge badge-info">${o.status || '접수'}</span></td>
                            <td>${new Date(o.order_date || o.created_at).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="viewOrder(${o.id})"><i class="fas fa-eye"></i> 상세</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ===== 이미지 업로드 =====
async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 파일 크기 확인 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
        showToast('이미지 크기는 5MB 이하여야 합니다', 'error');
        event.target.value = '';
        return;
    }
    
    // 파일 타입 확인
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showToast('JPG, PNG, WebP 형식만 업로드 가능합니다', 'error');
        event.target.value = '';
        return;
    }
    
    // 업로드 상태 표시
    const statusDiv = document.getElementById('uploadStatus');
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 업로드 중...';
    statusDiv.style.color = '#667eea';
    
    try {
        // FormData 생성
        const formData = new FormData();
        formData.append('image', file);
        
        // ImgBB API 호출 (무료 API 키)
        const apiKey = 'd8e0e9c4c4c2b2e8e9c4c4c2b2e8e9c4'; // 공용 데모 키
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('업로드 실패');
        }
        
        const data = await response.json();
        
        if (data.success) {
            // 업로드 성공
            const imageUrl = data.data.url;
            document.getElementById('productImageUrl').value = imageUrl;
            
            // 미리보기 표시
            const previewImg = document.getElementById('previewImg');
            const imagePreview = document.getElementById('imagePreview');
            previewImg.src = imageUrl;
            imagePreview.style.display = 'block';
            
            // 성공 메시지
            statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> 업로드 완료!';
            statusDiv.style.color = '#28a745';
            
            showToast('이미지 업로드 완료', 'success');
            
            console.log('✅ 이미지 업로드 성공:', imageUrl);
        } else {
            throw new Error('업로드 응답 오류');
        }
    } catch (error) {
        console.error('❌ 이미지 업로드 오류:', error);
        statusDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> 업로드 실패';
        statusDiv.style.color = '#dc3545';
        showToast('이미지 업로드 실패: ' + error.message, 'error');
        event.target.value = '';
    }
}

// ===== 제품 관리 =====
function openProductModal(productId = null) {
    currentEditId = productId;
    const modal = document.getElementById('productModal');
    const title = document.getElementById('productModalTitle');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const statusDiv = document.getElementById('uploadStatus');
    
    // 상태 초기화
    statusDiv.innerHTML = '';
    imagePreview.style.display = 'none';
    
    if (productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        title.textContent = '제품 수정';
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productImageUrl').value = product.image_url;
        document.getElementById('productMaterials').value = product.materials || '';
        document.getElementById('productBenefits').value = product.benefits || '';
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productFeatured').checked = product.featured || false;
        document.getElementById('productInStock').checked = product.in_stock !== false;
        
        // 기존 이미지 미리보기
        if (product.image_url) {
            previewImg.src = product.image_url;
            imagePreview.style.display = 'block';
            statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> 기존 이미지';
            statusDiv.style.color = '#28a745';
        }
    } else {
        title.textContent = '새 제품 추가';
        document.getElementById('productForm').reset();
        document.getElementById('productImageFile').value = '';
    }
    
    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    currentEditId = null;
}

function handleProductSubmit(event) {
    event.preventDefault();
    
    const productData = {
        id: currentEditId || Date.now(),
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        image_url: document.getElementById('productImageUrl').value,
        materials: document.getElementById('productMaterials').value,
        benefits: document.getElementById('productBenefits').value,
        description: document.getElementById('productDescription').value,
        featured: document.getElementById('productFeatured').checked,
        in_stock: document.getElementById('productInStock').checked,
        updated_at: new Date().toISOString()
    };
    
    if (currentEditId) {
        const index = products.findIndex(p => p.id === currentEditId);
        if (index !== -1) products[index] = productData;
    } else {
        productData.created_at = new Date().toISOString();
        products.push(productData);
    }
    
    saveProducts();
    updateStats();
    updateTabBadges();
    renderProductsTable();
    closeProductModal();
    showToast(currentEditId ? '제품이 수정되었습니다' : '제품이 추가되었습니다', 'success');
}

function editProduct(id) {
    openProductModal(id);
}

function deleteProduct(id) {
    if (!confirm('이 제품을 삭제하시겠습니까?')) return;
    
    products = products.filter(p => p.id !== id);
    saveProducts();
    updateStats();
    updateTabBadges();
    renderProductsTable();
    showToast('제품이 삭제되었습니다', 'success');
}

// ===== 주문 상세 =====
function viewOrder(id) {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    
    const modal = document.getElementById('orderModal');
    const content = document.getElementById('orderDetailContent');
    
    let productsHtml = '';
    if (order.products && Array.isArray(order.products)) {
        productsHtml = order.products.map(p => `
            <tr>
                <td>${p.name}</td>
                <td>${p.quantity}개</td>
                <td>${(p.price * p.quantity).toLocaleString()}원</td>
            </tr>
        `).join('');
    }
    
    content.innerHTML = `
        <div class="modal-body">
            <h3>주문 정보</h3>
            <p><strong>주문번호:</strong> #${String(order.id).substr(-6)}</p>
            <p><strong>주문일:</strong> ${new Date(order.order_date || order.created_at).toLocaleString()}</p>
            <p><strong>상태:</strong> <span class="badge badge-info">${order.status || '접수'}</span></p>
            
            <h3 style="margin-top: 20px;">고객 정보</h3>
            <p><strong>이름:</strong> ${order.name}</p>
            <p><strong>전화번호:</strong> ${order.phone}</p>
            <p><strong>이메일:</strong> ${order.email || '-'}</p>
            <p><strong>주소:</strong> ${order.address || '-'}</p>
            
            <h3 style="margin-top: 20px;">주문 상품</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 2px solid #e0e0e0;">
                        <th style="text-align: left; padding: 10px;">상품명</th>
                        <th style="text-align: left; padding: 10px;">수량</th>
                        <th style="text-align: right; padding: 10px;">금액</th>
                    </tr>
                </thead>
                <tbody>
                    ${productsHtml}
                </tbody>
                <tfoot>
                    <tr style="border-top: 2px solid #e0e0e0; font-weight: bold;">
                        <td colspan="2" style="padding: 10px;">합계</td>
                        <td style="text-align: right; padding: 10px;">${(order.total || 0).toLocaleString()}원</td>
                    </tr>
                </tfoot>
            </table>
            
            <div style="margin-top: 20px;">
                <button class="btn btn-primary" onclick="updateOrderStatus(${order.id})">상태 변경</button>
                <button class="btn btn-outline" onclick="closeOrderModal()">닫기</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
}

function updateOrderStatus(id) {
    const statuses = ['접수', '확인중', '배송준비', '배송중', '배송완료', '취소'];
    const order = orders.find(o => o.id === id);
    if (!order) return;
    
    const currentIndex = statuses.indexOf(order.status || '접수');
    const newStatus = statuses[(currentIndex + 1) % statuses.length];
    
    if (confirm(`주문 상태를 "${newStatus}"(으)로 변경하시겠습니까?`)) {
        order.status = newStatus;
        order.updated_at = new Date().toISOString();
        saveOrders();
        updateStats();
        renderOrdersTable();
        closeOrderModal();
        showToast('주문 상태가 변경되었습니다', 'success');
    }
}

// ===== 자동 새로고침 =====
function toggleAutoRefresh() {
    isAutoRefreshEnabled = !isAutoRefreshEnabled;
    const btn = document.getElementById('autoRefreshToggle');
    if (!btn) return;
    
    if (isAutoRefreshEnabled) {
        btn.innerHTML = '<i class="fas fa-sync fa-spin"></i> 자동새로고침 중';
        btn.className = 'btn btn-primary';
        showToast('자동 새로고침 활성화', 'success');
    } else {
        btn.innerHTML = '<i class="fas fa-sync"></i> 자동새로고침 꺼짐';
        btn.className = 'btn btn-outline';
        showToast('자동 새로고침 비활성화', 'info');
    }
}

function startAutoRefresh() {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
    
    autoRefreshInterval = setInterval(() => {
        if (isAutoRefreshEnabled) {
            loadProducts();
            loadOrders();
            updateStats();
            updateTabBadges();
            if (currentTab === 'products') renderProductsTable();
            else if (currentTab === 'orders') renderOrdersTable();
        }
    }, 30000);
}

// ===== 토스트 =====
function showToast(message, type = 'info') {
    const existing = document.getElementById('toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        padding: 15px 25px; border-radius: 10px; color: white; font-weight: 600;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3); animation: slideIn 0.3s ease;
    `;
    
    const colors = {success: '#28a745', error: '#dc3545', warning: '#ffc107', info: '#17a2b8'};
    toast.style.background = colors[type] || colors.info;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== 전역 함수 노출 =====
window.handleLogin = handleLogin;
window.logout = logout;
window.toggleAutoRefresh = toggleAutoRefresh;
window.switchTab = switchTab;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.handleProductSubmit = handleProductSubmit;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.viewOrder = viewOrder;
window.closeOrderModal = closeOrderModal;
window.updateOrderStatus = updateOrderStatus;
window.handleImageUpload = handleImageUpload;
window.adminProducts = products;
window.adminOrders = orders;

console.log('✅ 심석 관리자 v3.0 (완전판) 로드 완료');
