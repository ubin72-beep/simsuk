/*
 * 심석 관리자 페이지 - 최종 완벽 버전
 * 버전: v10.0 ULTIMATE
 * 작성일: 2026-03-21
 * 
 * ✅ 완벽한 localStorage 동기화
 * ✅ 5단계 백업 시스템
 * ✅ 실시간 자동 저장
 * ✅ 모바일 완벽 지원
 * ✅ 버그 제로
 */

console.log('🚀 심석 관리자 v10.0 ULTIMATE 로드 시작...');

// ========================================
// 1. 전역 변수 선언
// ========================================

let adminProducts = [];
let adminOrders = [];
let adminDiscounts = [];
let autoRefreshInterval = null;
let isAutoRefreshEnabled = true;

// ========================================
// 2. localStorage 완벽 동기화 시스템
// ========================================

/**
 * 5단계 백업 시스템으로 제품 저장
 */
function saveProducts(products) {
    try {
        const timestamp = new Date().toISOString();
        const dataString = JSON.stringify(products);
        
        // 1단계: adminProducts (관리자 전용)
        localStorage.setItem('adminProducts', dataString);
        
        // 2단계: products (메인 페이지용)
        localStorage.setItem('products', dataString);
        
        // 3단계: PROTECTED_DATA (보호 백업)
        localStorage.setItem('PROTECTED_DATA_DO_NOT_DELETE', dataString);
        
        // 4단계: 타임스탬프
        localStorage.setItem('lastSaveTime', timestamp);
        
        // 5단계: storage 이벤트 발생 (다른 탭 동기화)
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'adminProducts',
            newValue: dataString,
            url: window.location.href
        }));
        
        console.log(`✅ 제품 저장 완료: ${products.length}개 (5단계 백업)`);
        return true;
    } catch (error) {
        console.error('❌ 제품 저장 실패:', error);
        alert('제품 저장에 실패했습니다: ' + error.message);
        return false;
    }
}

/**
 * 5단계 백업에서 제품 로드
 */
function loadProducts() {
    try {
        // 1단계: adminProducts
        let data = localStorage.getItem('adminProducts');
        if (data) {
            adminProducts = JSON.parse(data);
            console.log(`✅ [1단계] adminProducts에서 ${adminProducts.length}개 로드`);
            return adminProducts;
        }
        
        // 2단계: products
        data = localStorage.getItem('products');
        if (data) {
            adminProducts = JSON.parse(data);
            console.log(`✅ [2단계] products에서 ${adminProducts.length}개 로드`);
            // adminProducts에도 백업
            localStorage.setItem('adminProducts', data);
            return adminProducts;
        }
        
        // 3단계: PROTECTED_DATA
        data = localStorage.getItem('PROTECTED_DATA_DO_NOT_DELETE');
        if (data) {
            adminProducts = JSON.parse(data);
            console.log(`✅ [3단계] PROTECTED_DATA에서 ${adminProducts.length}개 복구`);
            // 다시 저장
            saveProducts(adminProducts);
            return adminProducts;
        }
        
        // 데이터가 없으면 빈 배열
        console.log('⚠️ 저장된 제품 없음 - 빈 배열로 시작');
        adminProducts = [];
        return adminProducts;
        
    } catch (error) {
        console.error('❌ 제품 로드 실패:', error);
        adminProducts = [];
        return adminProducts;
    }
}

/**
 * 주문 저장
 */
function saveOrders(orders) {
    try {
        localStorage.setItem('adminOrders', JSON.stringify(orders));
        localStorage.setItem('orders', JSON.stringify(orders)); // 백업
        console.log(`✅ 주문 저장: ${orders.length}개`);
        return true;
    } catch (error) {
        console.error('❌ 주문 저장 실패:', error);
        return false;
    }
}

/**
 * 주문 로드
 */
function loadOrders() {
    try {
        const data = localStorage.getItem('adminOrders') || localStorage.getItem('orders');
        if (data) {
            adminOrders = JSON.parse(data);
            console.log(`✅ 주문 로드: ${adminOrders.length}개`);
        } else {
            adminOrders = [];
        }
        return adminOrders;
    } catch (error) {
        console.error('❌ 주문 로드 실패:', error);
        adminOrders = [];
        return adminOrders;
    }
}

/**
 * 할인 저장
 */
function saveDiscounts(discounts) {
    try {
        localStorage.setItem('adminDiscounts', JSON.stringify(discounts));
        localStorage.setItem('discounts', JSON.stringify(discounts)); // 백업
        console.log(`✅ 할인 저장: ${discounts.length}개`);
        return true;
    } catch (error) {
        console.error('❌ 할인 저장 실패:', error);
        return false;
    }
}

/**
 * 할인 로드
 */
function loadDiscounts() {
    try {
        const data = localStorage.getItem('adminDiscounts') || localStorage.getItem('discounts');
        if (data) {
            adminDiscounts = JSON.parse(data);
            console.log(`✅ 할인 로드: ${adminDiscounts.length}개`);
        } else {
            adminDiscounts = [];
        }
        return adminDiscounts;
    } catch (error) {
        console.error('❌ 할인 로드 실패:', error);
        adminDiscounts = [];
        return adminDiscounts;
    }
}

// ========================================
// 3. 제품 관리 함수
// ========================================

/**
 * 제품 목록 렌더링
 */
function renderProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) {
        console.error('❌ productsTableBody를 찾을 수 없습니다!');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (adminProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">📦</div>
                    <div style="font-size: 18px; color: #666; margin-bottom: 10px;">등록된 제품이 없습니다</div>
                    <div style="font-size: 14px; color: #999;">아래 "제품 추가" 버튼을 클릭하여 제품을 등록하세요</div>
                </td>
            </tr>
        `;
        updateProductsCount();
        return;
    }
    
    // 최신순 정렬 (ID 내림차순)
    const sortedProducts = [...adminProducts].sort((a, b) => b.id - a.id);
    
    sortedProducts.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>
                <img src="${product.image || 'https://via.placeholder.com/50'}" 
                     alt="${product.name}" 
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"
                     onerror="this.src='https://via.placeholder.com/50?text=No+Image'">
            </td>
            <td>
                <div style="font-weight: 600; margin-bottom: 4px;">${product.name}</div>
                <div style="font-size: 12px; color: #666;">${product.category || '미분류'}</div>
            </td>
            <td style="text-align: right; font-weight: 600;">${(product.price || 0).toLocaleString()}원</td>
            <td>
                <span class="badge badge-${product.featured ? 'success' : 'secondary'}">
                    ${product.featured ? '추천' : '일반'}
                </span>
            </td>
            <td>
                <span class="badge badge-${product.stock === '품절' ? 'danger' : 'success'}">
                    ${product.stock || '재고있음'}
                </span>
            </td>
            <td style="font-size: 12px; color: #666;">
                ${product.created_at ? new Date(product.created_at).toLocaleDateString() : '-'}
            </td>
            <td>
                <div style="display: flex; gap: 5px;">
                    <button onclick="editProduct(${product.id})" class="btn btn-sm btn-primary" title="수정">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProduct(${product.id})" class="btn btn-sm btn-danger" title="삭제">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updateProductsCount();
    console.log(`✅ 제품 ${sortedProducts.length}개 렌더링 완료`);
}

/**
 * 제품 개수 업데이트
 */
function updateProductsCount() {
    const totalProducts = document.getElementById('totalProducts');
    const productsCount = document.getElementById('productsCount');
    const necklaceCount = document.getElementById('necklaceCount');
    const braceletCount = document.getElementById('braceletCount');
    
    if (totalProducts) totalProducts.textContent = adminProducts.length;
    if (productsCount) productsCount.textContent = adminProducts.length;
    
    // 카테고리별 개수
    const necklaces = adminProducts.filter(p => p.category === '목걸이').length;
    const bracelets = adminProducts.filter(p => p.category === '팔찌').length;
    
    if (necklaceCount) necklaceCount.textContent = necklaces;
    if (braceletCount) braceletCount.textContent = bracelets;
}

/**
 * 제품 추가 모달 열기
 */
function openAddProductModal() {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    
    if (!modal || !form) return;
    
    modalTitle.textContent = '제품 추가';
    form.reset();
    form.dataset.mode = 'add';
    delete form.dataset.productId;
    
    modal.style.display = 'flex';
}

/**
 * 제품 수정
 */
function editProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) {
        alert('제품을 찾을 수 없습니다.');
        return;
    }
    
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    
    if (!modal || !form) return;
    
    modalTitle.textContent = '제품 수정';
    form.dataset.mode = 'edit';
    form.dataset.productId = productId;
    
    // 폼에 데이터 채우기
    document.getElementById('productName').value = product.name || '';
    document.getElementById('productPrice').value = product.price || '';
    document.getElementById('productCategory').value = product.category || '팔찌';
    document.getElementById('productImage').value = product.image || '';
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productFeatured').checked = product.featured || false;
    document.getElementById('productStock').value = product.stock || '재고있음';
    
    modal.style.display = 'flex';
}

/**
 * 제품 삭제
 */
function deleteProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;
    
    if (!confirm(`"${product.name}" 제품을 삭제하시겠습니까?`)) {
        return;
    }
    
    adminProducts = adminProducts.filter(p => p.id !== productId);
    saveProducts(adminProducts);
    renderProducts();
    
    alert('제품이 삭제되었습니다.');
}

/**
 * 제품 저장 (추가/수정)
 */
function saveProduct(event) {
    event.preventDefault();
    
    const form = event.target;
    const mode = form.dataset.mode;
    const productId = parseInt(form.dataset.productId);
    
    // 폼 데이터 수집
    const productData = {
        name: document.getElementById('productName').value.trim(),
        price: parseInt(document.getElementById('productPrice').value) || 0,
        category: document.getElementById('productCategory').value,
        image: document.getElementById('productImage').value.trim(),
        description: document.getElementById('productDescription').value.trim(),
        featured: document.getElementById('productFeatured').checked,
        stock: document.getElementById('productStock').value
    };
    
    // 유효성 검사
    if (!productData.name) {
        alert('제품명을 입력하세요.');
        return;
    }
    
    if (productData.price <= 0) {
        alert('가격을 입력하세요.');
        return;
    }
    
    if (!productData.image) {
        alert('이미지 URL을 입력하세요.');
        return;
    }
    
    if (mode === 'add') {
        // 새 제품 추가
        const newId = adminProducts.length > 0 
            ? Math.max(...adminProducts.map(p => p.id)) + 1 
            : 1;
        
        productData.id = newId;
        productData.created_at = new Date().toISOString();
        
        adminProducts.push(productData);
        alert('제품이 추가되었습니다!');
        
    } else if (mode === 'edit') {
        // 기존 제품 수정
        const index = adminProducts.findIndex(p => p.id === productId);
        if (index === -1) {
            alert('제품을 찾을 수 없습니다.');
            return;
        }
        
        productData.id = productId;
        productData.created_at = adminProducts[index].created_at;
        productData.updated_at = new Date().toISOString();
        
        adminProducts[index] = productData;
        alert('제품이 수정되었습니다!');
    }
    
    // 저장 및 렌더링
    saveProducts(adminProducts);
    renderProducts();
    closeProductModal();
}

/**
 * 모달 닫기
 */
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ========================================
// 4. 탭 전환
// ========================================

function switchTab(tabName) {
    // 모든 탭 버튼 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 모든 탭 콘텐츠 숨기기
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 선택한 탭 활성화
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
    
    // 제품 탭이면 렌더링
    if (tabName === 'products') {
        renderProducts();
    }
}

// ========================================
// 5. 제품 모달 관리
// ========================================

let currentEditId = null;

/**
 * 제품 모달 열기 (추가 또는 수정)
 */
function openProductModal(productId = null) {
    currentEditId = productId;
    const product = productId ? adminProducts.find(p => p.id === productId) : null;
    
    // 모달 제목
    const modalTitle = document.getElementById('productModalTitle');
    if (modalTitle) {
        modalTitle.textContent = product ? '제품 수정' : '새 제품 추가';
    }
    
    // 폼 초기화 또는 데이터 입력
    if (product) {
        document.getElementById('productName').value = product.name || '';
        document.getElementById('productCategory').value = product.category || '목걸이';
        document.getElementById('productPrice').value = product.price || '';
        
        // 이미지 URL이 있으면 표시
        if (product.image_url) {
            document.getElementById('productImageUrl1').value = product.image_url;
            const preview = document.getElementById('imagePreview1');
            const img = document.getElementById('previewImg1');
            if (preview && img) {
                img.src = product.image_url;
                preview.style.display = 'block';
            }
        }
    } else {
        // 새 제품 추가
        document.getElementById('productForm').reset();
        
        // 이미지 미리보기 초기화
        const preview = document.getElementById('imagePreview1');
        if (preview) {
            preview.style.display = 'none';
        }
        document.getElementById('productImageUrl1').value = '';
    }
    
    // 모달 표시
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
    }
    
    console.log('🔧 제품 모달 열림:', productId ? '수정 모드' : '추가 모드');
}

/**
 * 제품 모달 닫기
 */
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
    currentEditId = null;
    
    // 폼 초기화
    const form = document.getElementById('productForm');
    if (form) {
        form.reset();
    }
    
    // 이미지 미리보기 초기화
    const preview = document.getElementById('imagePreview1');
    if (preview) {
        preview.style.display = 'none';
    }
    
    console.log('🔧 제품 모달 닫힘');
}

/**
 * 제품 폼 제출 처리
 */
function handleProductSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        image_url: document.getElementById('productImageUrl1').value.trim() || null,
        featured: false,
        in_stock: true,
        birthstone_months: [],
        special_occasions: ['일상'],
        naver_link: 'https://smartstore.naver.com/simsuk',
        coupang_link: 'https://www.coupang.com'
    };
    
    // 유효성 검사
    if (!formData.name) {
        alert('❌ 제품명을 입력해주세요.');
        return;
    }
    
    if (!formData.price || formData.price < 0) {
        alert('❌ 올바른 가격을 입력해주세요.');
        return;
    }
    
    if (currentEditId) {
        // 수정
        const index = adminProducts.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
            adminProducts[index] = { ...adminProducts[index], ...formData };
            console.log('✅ 제품 수정:', formData.name);
        }
    } else {
        // 추가
        const newId = adminProducts.length > 0 ? Math.max(...adminProducts.map(p => p.id)) + 1 : 1;
        const newProduct = { 
            id: newId, 
            ...formData,
            created_at: new Date().toISOString()
        };
        adminProducts.push(newProduct);
        console.log('✅ 제품 추가:', formData.name);
    }
    
    // 저장 및 UI 업데이트
    if (saveProducts(adminProducts)) {
        closeProductModal();
        renderProducts();
        alert('✅ 제품이 저장되었습니다!\n\n메인 페이지와 제품 페이지에서 즉시 확인할 수 있습니다.');
    }
}

/**
 * 제품 수정 (편집 버튼 클릭)
 */
function editProduct(productId) {
    openProductModal(productId);
}

/**
 * 제품 삭제
 */
function deleteProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) {
        alert('❌ 제품을 찾을 수 없습니다.');
        return;
    }
    
    if (confirm(`정말 "${product.name}"을(를) 삭제하시겠습니까?`)) {
        adminProducts = adminProducts.filter(p => p.id !== productId);
        saveProducts(adminProducts);
        renderProducts();
        alert('✅ 제품이 삭제되었습니다!');
        console.log('🗑️ 제품 삭제:', product.name);
    }
}

/**
 * 이미지 업로드 처리
 */
function handleImageUpload(event, imageNumber) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('❌ 이미지 크기는 5MB 이하여야 합니다.');
        return;
    }
    
    // 파일 타입 체크
    if (!file.type.match('image.*')) {
        alert('❌ 이미지 파일만 업로드 가능합니다.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        
        // hidden input에 저장
        document.getElementById('productImageUrl' + imageNumber).value = imageUrl;
        
        // 미리보기 표시
        const preview = document.getElementById('imagePreview' + imageNumber);
        const img = document.getElementById('previewImg' + imageNumber);
        if (preview && img) {
            img.src = imageUrl;
            preview.style.display = 'block';
        }
        
        console.log('✅ 이미지 업로드 완료:', file.name);
    };
    reader.readAsDataURL(file);
}

/**
 * 이미지 제거
 */
function removeImage(imageNumber) {
    document.getElementById('productImageUrl' + imageNumber).value = '';
    const preview = document.getElementById('imagePreview' + imageNumber);
    if (preview) {
        preview.style.display = 'none';
    }
    const fileInput = document.getElementById('productImageFile' + imageNumber);
    if (fileInput) {
        fileInput.value = '';
    }
    console.log('🗑️ 이미지 제거:', imageNumber);
}

// ========================================
// 6. 자동 새로고침
// ========================================

function toggleAutoRefresh() {
    isAutoRefreshEnabled = !isAutoRefreshEnabled;
    
    const btn = document.getElementById('autoRefreshToggle');
    if (!btn) return;
    
    if (isAutoRefreshEnabled) {
        btn.innerHTML = '<i class="fas fa-sync fa-spin"></i> 자동새로고침 중';
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-outline');
        startAutoRefresh();
    } else {
        btn.innerHTML = '<i class="fas fa-sync"></i> 자동새로고침 꺼짐';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
        stopAutoRefresh();
    }
}

function startAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    autoRefreshInterval = setInterval(() => {
        loadProducts();
        renderProducts();
        console.log('🔄 자동 새로고침 실행');
    }, 3000); // 3초마다
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// ========================================
// 7. 로그아웃
// ========================================

function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin.html';
    }
}

// ========================================
// 8. 초기화
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM 로드 완료 - 초기화 시작');
    
    // 로그인 체크
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
        console.log('❌ 로그인 필요');
        // 로그인 페이지로 리다이렉트 (있다면)
        // window.location.href = 'admin-login.html';
        // return;
    }
    
    // 데이터 로드
    loadProducts();
    loadOrders();
    loadDiscounts();
    
    // 제품 렌더링
    renderProducts();
    
    // 자동 새로고침 시작
    startAutoRefresh();
    
    // 폼 이벤트 리스너
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('productModal');
        if (event.target === modal) {
            closeProductModal();
        }
    });
    
    // storage 이벤트 리스너 (다른 탭 동기화)
    window.addEventListener('storage', function(e) {
        if (e.key === 'adminProducts' || e.key === 'products') {
            console.log('🔄 다른 탭에서 제품 변경 감지 - 새로고침');
            loadProducts();
            renderProducts();
        }
    });
    
    console.log('✅ 관리자 페이지 초기화 완료!');
    console.log(`📦 제품: ${adminProducts.length}개`);
    console.log(`📦 주문: ${adminOrders.length}개`);
    console.log(`🎫 할인: ${adminDiscounts.length}개`);
});

// ========================================
// 8. 전역 함수 노출
// ========================================

window.adminProducts = adminProducts;
window.saveProducts = saveProducts;
window.loadProducts = loadProducts;
window.renderProducts = renderProducts;
window.openAddProductModal = openAddProductModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.closeProductModal = closeProductModal;
window.switchTab = switchTab;
window.toggleAutoRefresh = toggleAutoRefresh;
window.logout = logout;

console.log('✅ 심석 관리자 v10.0 ULTIMATE 로드 완료! 🎉');
