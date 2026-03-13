// ============================================
// 심석 메인 페이지 - localStorage 완벽 버전
// GitHub Pages 전용 (서버 불필요)
// 작성일: 2026-03-11
// ============================================

console.log('✅ 심석 메인 localStorage 완벽 버전 로드 시작...');

// ===== 전역 변수 =====
let allProducts = [];
let currentFilter = 'all';
let currentBirthstoneFilter = null;
let cart = [];

// 페이지네이션 변수
let currentPage = 1;
let productsPerPage = 10;  // 10개씩 표시
let totalPages = 1;

// ===== 초기화 =====
console.log('📱 심석 사이트 시작...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 DOM 로드 완료');
    initApp();
});

function initApp() {
    loadProducts();
    setupEventListeners();
    loadCart();
    updateCartBadge();
}

// ===== 제품 로드 (완벽 버전) =====
function loadProducts() {
    console.log('📦 제품 로드 시작...');
    
    try {
        // ⭐ 3중 복구 시스템
        let loadedProducts = null;
        let loadSource = '';
        
        // 1차: adminProducts 확인
        const adminProducts = localStorage.getItem('adminProducts');
        if (adminProducts) {
            loadedProducts = JSON.parse(adminProducts);
            loadSource = 'adminProducts';
        }
        
        // 2차: products 확인
        if (!loadedProducts) {
            const products = localStorage.getItem('products');
            if (products) {
                loadedProducts = JSON.parse(products);
                loadSource = 'products';
            }
        }
        
        // 3차: 보호된 데이터 확인
        if (!loadedProducts) {
            const protected = localStorage.getItem('PROTECTED_DATA_DO_NOT_DELETE');
            if (protected) {
                loadedProducts = JSON.parse(protected);
                loadSource = 'PROTECTED_DATA_DO_NOT_DELETE';
                
                // 보호된 데이터를 찾았으면 즉시 복구
                localStorage.setItem('adminProducts', protected);
                localStorage.setItem('products', protected);
                console.log('🛡️ 보호된 데이터에서 자동 복구!');
            }
        }
        
        // 4차: 백업 데이터 확인
        if (!loadedProducts) {
            const allKeys = Object.keys(localStorage);
            const backupKeys = allKeys.filter(key => key.startsWith('adminProducts_backup_')).sort().reverse();
            
            if (backupKeys.length > 0) {
                loadedProducts = JSON.parse(localStorage.getItem(backupKeys[0]));
                loadSource = backupKeys[0];
                
                // 백업을 찾았으면 즉시 복구
                const backupData = localStorage.getItem(backupKeys[0]);
                localStorage.setItem('adminProducts', backupData);
                localStorage.setItem('products', backupData);
                console.log('💾 백업 데이터에서 자동 복구!');
            }
        }
        
        // 5차: 영구 백업 확인
        if (!loadedProducts) {
            const permanentKeys = allKeys.filter(key => key.startsWith('backup_permanent_')).sort().reverse();
            
            if (permanentKeys.length > 0) {
                loadedProducts = JSON.parse(localStorage.getItem(permanentKeys[0]));
                loadSource = permanentKeys[0];
                
                const permData = localStorage.getItem(permanentKeys[0]);
                localStorage.setItem('adminProducts', permData);
                localStorage.setItem('products', permData);
                console.log('💎 영구 백업에서 자동 복구!');
            }
        }
        
        if (loadedProducts && loadedProducts.length > 0) {
            allProducts = loadedProducts;
            console.log(`✅ localStorage에서 ${allProducts.length}개 제품 로드 (출처: ${loadSource})`);
            console.log('✅ 첫 번째 제품:', allProducts[0].name, '|', allProducts[0].price.toLocaleString() + '원');
        } else {
            // ⚠️ 데이터 없음 - 빈 배열 사용
            allProducts = [];
            console.log('⚠️ localStorage 완전히 비어있음 - 빈 배열 표시');
            console.log('⚠️ admin.html에서 제품을 등록해주세요!');
        }
        
        // 현재 페이지 확인 (메인 페이지 vs 제품 페이지)
        const isProductsPage = window.location.pathname.includes('products.html');
        
        if (isProductsPage) {
            // 제품 페이지: 모든 제품을 페이지네이션과 함께 표시
            displayProducts(allProducts);
        } else {
            // 메인 페이지: featured 제품 우선, 최대 10개만 표시
            const featuredProducts = allProducts.filter(p => p.featured);
            const displayLimit = 10;
            
            if (featuredProducts.length >= displayLimit) {
                displayProducts(featuredProducts, displayLimit);
            } else {
                displayProducts(allProducts, displayLimit);
            }
        }
    } catch (error) {
        console.error('❌ 제품 로드 오류:', error);
        allProducts = [];
        
        const grid = document.getElementById('productsGrid');
        if (grid) {
            grid.innerHTML = `
                <div class="loading">
                    <i class="fas fa-exclamation-triangle" style="color: #dc3545;"></i>
                    <p style="color: #dc3545;">제품 로드 오류</p>
                    <p style="font-size: 0.9rem; color: #666;">admin.html에서 제품을 등록해주세요</p>
                </div>
            `;
        }
    }
}

// ===== 제품 표시 (페이지네이션 적용) =====
function displayProducts(products, limit = null) {
    console.log(`🎨 제품 표시: ${products.length}개${limit ? ` (제한: ${limit}개)` : ''}`);
    
    const grid = document.getElementById('productsGrid');
    
    if (!grid) {
        console.error('❌ productsGrid를 찾을 수 없습니다!');
        return;
    }
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div class="loading">
                <i class="fas fa-box-open"></i>
                <p>등록된 제품이 없습니다</p>
                <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">
                    <a href="admin.html" style="color: #2c5f4f; text-decoration: underline;">
                        관리자 페이지에서 제품을 등록하세요
                    </a>
                </p>
            </div>
        `;
        return;
    }
    
    // 페이지네이션 계산
    let displayedProducts;
    if (limit) {
        // 메인 페이지: 제한된 수량만 표시
        displayedProducts = products.slice(0, limit);
        totalPages = 1;
    } else {
        // 제품 페이지: 페이지네이션 적용
        totalPages = Math.ceil(products.length / productsPerPage);
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        displayedProducts = products.slice(startIndex, endIndex);
    }
    
    // 제품 카드 HTML 생성
    grid.innerHTML = displayedProducts.map(product => {
        // 이미지 URL (메인 이미지 1개)
        const imageUrl = product.image || product.image_url || `https://placehold.co/400x400/667eea/ffffff?text=${encodeURIComponent(product.name)}`;
        
        // 재고 상태
        const stockBadge = product.in_stock 
            ? '<span class="badge badge-success">재고있음</span>' 
            : '<span class="badge badge-danger">품절</span>';
        
        // 추천 제품 뱃지
        const featuredBadge = product.featured 
            ? '<span class="badge badge-featured">추천</span>' 
            : '';
        
        // 네이버 스마트스토어 뱃지
        const naverBadge = product.naver_link 
            ? '<span class="badge badge-naver" style="background: #03C75A; color: white;"><i class="fas fa-shopping-bag"></i> 네이버 스마트스토어</span>' 
            : '';
        
        return `
            <div class="product-card" onclick="openProduct(${product.id})">
                <div class="product-image">
                    <img src="${imageUrl}" alt="${product.name}" loading="lazy">
                    <div class="product-badges">
                        ${featuredBadge}
                        ${stockBadge}
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${product.price.toLocaleString()}원</p>
                    ${product.description ? `<p class="product-description">${product.description.substring(0, 50)}${product.description.length > 50 ? '...' : ''}</p>` : ''}
                    ${naverBadge}
                </div>
            </div>
        `;
    }).join('');
    
    // 페이지네이션 렌더링 (제품 페이지에서만)
    if (!limit && totalPages > 1) {
        renderPagination(products.length);
    }
    
    console.log('✅ 제품 표시 완료');
}

// ===== 페이지네이션 렌더링 =====
function renderPagination(totalProducts) {
    let paginationContainer = document.getElementById('pagination');
    
    if (!paginationContainer) {
        // 페이지네이션 컨테이너가 없으면 생성
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination';
        grid.parentNode.insertBefore(paginationContainer, grid.nextSibling);
    }
    
    paginationContainer.style.display = 'flex';
    paginationContainer.style.justifyContent = 'center';
    paginationContainer.style.gap = '10px';
    paginationContainer.style.marginTop = '40px';
    
    totalPages = Math.ceil(totalProducts / productsPerPage);
    
    let paginationHTML = '';
    
    // 이전 버튼
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage - 1})"><i class="fas fa-chevron-left"></i></button>`;
    }
    
    // 페이지 번호 버튼
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `<button class="pagination-btn ${activeClass}" onclick="changePage(${i})">${i}</button>`;
    }
    
    // 다음 버튼
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage + 1})"><i class="fas fa-chevron-right"></i></button>`;
    }
    
    paginationContainer.innerHTML = paginationHTML;
}

// ===== 페이지 변경 =====
function changePage(page) {
    currentPage = page;
    displayProducts(allProducts);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== 제품 클릭 (네이버/쿠팡 링크로 이동) =====
function openProduct(productId) {
    console.log('🔗 제품 클릭:', productId);
    
    const product = allProducts.find(p => p.id == productId);
    
    if (!product) {
        console.error('❌ 제품을 찾을 수 없습니다:', productId);
        return;
    }
    
    // 네이버 스마트스토어 링크 우선
    if (product.naver_link) {
        console.log('✅ 네이버 스마트스토어로 이동:', product.naver_link);
        window.open(product.naver_link, '_blank');
        return;
    }
    
    // 쿠팡 링크 차선책
    if (product.coupang_link) {
        console.log('✅ 쿠팡으로 이동:', product.coupang_link);
        window.open(product.coupang_link, '_blank');
        return;
    }
    
    // 링크가 없으면 상세 페이지로
    console.log('⚠️ 외부 링크 없음 - 상세 페이지로 이동');
    window.location.href = `product-detail.html?id=${productId}`;
}

// ===== 이벤트 리스너 설정 =====
function setupEventListeners() {
    // 카테고리 필터
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.dataset.category;
            filterProducts();
        });
    });
    
    // 탄생석 필터
    const birthstoneSelect = document.getElementById('birthstoneFilter');
    if (birthstoneSelect) {
        birthstoneSelect.addEventListener('change', function() {
            currentBirthstoneFilter = this.value === 'all' ? null : parseInt(this.value);
            filterProducts();
        });
    }
}

// ===== 필터링 =====
function filterProducts() {
    let filtered = allProducts;
    
    // 카테고리 필터
    if (currentFilter !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilter);
    }
    
    // 탄생석 필터
    if (currentBirthstoneFilter) {
        filtered = filtered.filter(p => 
            p.birthstone_months && p.birthstone_months.includes(currentBirthstoneFilter)
        );
    }
    
    currentPage = 1;
    displayProducts(filtered);
}

// ===== 장바구니 =====
function loadCart() {
    try {
        const saved = localStorage.getItem('cart');
        cart = saved ? JSON.parse(saved) : [];
        console.log('🛒 장바구니 로드:', cart.length, '개 아이템');
    } catch (error) {
        console.error('❌ 장바구니 로드 오류:', error);
        cart = [];
    }
}

function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('❌ 장바구니 저장 오류:', error);
    }
}

function addToCart(productId) {
    console.log('🛒 장바구니에 추가:', productId);
    
    const product = allProducts.find(p => p.id == productId);
    
    if (!product) {
        console.error('❌ 제품을 찾을 수 없습니다');
        alert('제품을 찾을 수 없습니다');
        return;
    }
    
    // 이미 장바구니에 있는지 확인
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || product.image_url,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartBadge();
    showNotification('장바구니에 추가되었습니다!');
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function showCart() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    
    if (cart.length === 0) {
        alert('장바구니가 비어있습니다');
        return;
    }
    
    // 장바구니 내용 표시
    const cartItems = document.getElementById('cartItems');
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1;">
                    <h4>${item.name}</h4>
                    <p>${item.price.toLocaleString()}원</p>
                </div>
                <div>
                    <span>수량: ${item.quantity}</span>
                    <button onclick="removeFromCart(${item.id})">삭제</button>
                </div>
            </div>
        `).join('');
    }
    
    modal.classList.add('active');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    saveCart();
    updateCartBadge();
    showCart(); // 새로고침
}

// ===== 알림 =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== 전역 함수 등록 =====
window.openProduct = openProduct;
window.addToCart = addToCart;
window.showCart = showCart;
window.removeFromCart = removeFromCart;
window.changePage = changePage;

console.log('✅ 심석 메인 localStorage 완벽 버전 로드 완료!');

// 페이지 로드 완료 시간 측정
window.addEventListener('load', () => {
    const loadTime = performance.now() / 1000;
    console.log(`⚡ 페이지 로드 완료: ${loadTime.toFixed(2)}초`);
});
