/*
 * 심석 관리자 - 단순하고 확실한 버전
 * 모든 함수를 즉시 전역으로 등록
 */

console.log('🚀 관리자 페이지 로드 시작');

// ========================================
// 전역 변수
// ========================================
let adminProducts = [];
let adminOrders = [];
let adminDiscounts = [];
let currentEditId = null;

// ========================================
// localStorage 함수들
// ========================================

function saveProducts(products) {
    try {
        const dataString = JSON.stringify(products);
        localStorage.setItem('adminProducts', dataString);
        localStorage.setItem('products', dataString);
        console.log(`✅ 제품 저장: ${products.length}개`);
        return true;
    } catch (error) {
        console.error('❌ 저장 실패:', error);
        alert('저장 실패: ' + error.message);
        return false;
    }
}

function loadProducts() {
    try {
        const data = localStorage.getItem('adminProducts') || localStorage.getItem('products');
        if (data) {
            adminProducts = JSON.parse(data);
            console.log(`✅ 제품 로드: ${adminProducts.length}개`);
        } else {
            adminProducts = [];
            console.log('⚠️ 저장된 제품 없음');
        }
        return adminProducts;
    } catch (error) {
        console.error('❌ 로드 실패:', error);
        adminProducts = [];
        return adminProducts;
    }
}

// ========================================
// 제품 렌더링
// ========================================

function renderProducts() {
    console.log('📋 제품 렌더링 시작');
    
    const container = document.getElementById('productsTableContainer');
    if (!container) {
        console.error('❌ productsTableContainer 없음');
        return;
    }
    
    // 테이블 생성
    container.innerHTML = `
        <table class="table" style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
            <thead>
                <tr style="background: #f5f5f5;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">ID</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">제품명</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">카테고리</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">가격</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">작업</th>
                </tr>
            </thead>
            <tbody id="productsTableBody"></tbody>
        </table>
    `;
    
    const tbody = document.getElementById('productsTableBody');
    
    if (adminProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #666;">
                    <div style="font-size: 48px; margin-bottom: 10px;">📦</div>
                    <div>등록된 제품이 없습니다</div>
                    <div style="font-size: 14px; margin-top: 10px;">"새 제품 추가" 버튼을 클릭하세요</div>
                </td>
            </tr>
        `;
        return;
    }
    
    adminProducts.forEach(product => {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #eee';
        row.innerHTML = `
            <td style="padding: 12px;">${product.id}</td>
            <td style="padding: 12px; font-weight: 600;">${product.name}</td>
            <td style="padding: 12px;">${product.category || '미분류'}</td>
            <td style="padding: 12px; text-align: right; font-weight: 600;">${(product.price || 0).toLocaleString()}원</td>
            <td style="padding: 12px; text-align: center;">
                <button onclick="editProduct(${product.id})" style="background: #667eea; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px;">수정</button>
                <button onclick="deleteProduct(${product.id})" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">삭제</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    console.log(`✅ ${adminProducts.length}개 제품 렌더링 완료`);
}

// ========================================
// 모달 함수들
// ========================================

function openProductModal(productId = null) {
    console.log('🔧 모달 열기:', productId);
    
    currentEditId = productId;
    const product = productId ? adminProducts.find(p => p.id === productId) : null;
    
    const modalTitle = document.getElementById('productModalTitle');
    if (modalTitle) {
        modalTitle.textContent = product ? '제품 수정' : '새 제품 추가';
    }
    
    if (product) {
        document.getElementById('productName').value = product.name || '';
        document.getElementById('productCategory').value = product.category || '목걸이';
        document.getElementById('productPrice').value = product.price || '';
    } else {
        document.getElementById('productForm').reset();
    }
    
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentEditId = null;
}

function handleProductSubmit(event) {
    event.preventDefault();
    console.log('💾 제품 저장 시작');
    
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const price = parseInt(document.getElementById('productPrice').value);
    
    if (!name || !price) {
        alert('❌ 제품명과 가격을 입력하세요');
        return;
    }
    
    const productData = {
        name: name,
        category: category,
        price: price,
        image_url: null,
        naver_link: 'https://smartstore.naver.com/simsuk',
        coupang_link: 'https://www.coupang.com',
        featured: false,
        stock: '재고있음'
    };
    
    if (currentEditId) {
        // 수정
        const index = adminProducts.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
            adminProducts[index] = { ...adminProducts[index], ...productData };
            console.log('✅ 제품 수정:', name);
        }
    } else {
        // 추가
        const newId = adminProducts.length > 0 ? Math.max(...adminProducts.map(p => p.id)) + 1 : 1;
        productData.id = newId;
        adminProducts.push(productData);
        console.log('✅ 제품 추가:', name);
    }
    
    if (saveProducts(adminProducts)) {
        closeProductModal();
        renderProducts();
        alert('✅ 제품이 저장되었습니다!');
    }
}

function editProduct(productId) {
    openProductModal(productId);
}

function deleteProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;
    
    if (confirm(`"${product.name}"을(를) 삭제하시겠습니까?`)) {
        adminProducts = adminProducts.filter(p => p.id !== productId);
        saveProducts(adminProducts);
        renderProducts();
        alert('✅ 제품이 삭제되었습니다');
    }
}

// ========================================
// 탭 전환
// ========================================

function switchTab(tabName) {
    console.log('🔄 탭 전환:', tabName);
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => {
        return btn.textContent.includes(tabName === 'dashboard' ? '대시보드' : 
                                         tabName === 'products' ? '제품 관리' : 
                                         tabName === 'orders' ? '주문 관리' : '할인 관리');
    });
    
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    const tabContent = document.getElementById(tabName + 'Tab');
    if (tabContent) {
        tabContent.classList.add('active');
    }
    
    if (tabName === 'products') {
        renderProducts();
    }
}

// ========================================
// 기타 함수들
// ========================================

function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        window.location.href = 'index.html';
    }
}

function toggleAutoRefresh() {
    console.log('🔄 자동 새로고침 토글');
}

// ========================================
// 초기화
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM 로드 완료');
    
    loadProducts();
    renderProducts();
    
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }
    
    console.log('✅ 초기화 완료!');
});

// 전역 함수 등록
window.switchTab = switchTab;
window.logout = logout;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.handleProductSubmit = handleProductSubmit;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.toggleAutoRefresh = toggleAutoRefresh;
window.renderProducts = renderProducts;

console.log('✅ 관리자 페이지 로드 완료!');
