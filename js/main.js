// ===== 전역 변수 =====
let allProducts = [];
let currentFilter = 'all';
let currentBirthstoneFilter = null;
let cart = [];

// ===== 제품 데이터 =====
const DEMO_PRODUCTS = [
    {
        id: 1,
        name: '헤마타이트 목걸이',
        category: '목걸이',
        price: 69000,
        description: '강력한 자기력을 가진 헤마타이트 목걸이입니다. 혈액순환을 도와주고 스트레스를 완화시켜줍니다.',
        materials: '천연 헤마타이트',
        benefits: '혈액순환 개선, 스트레스 완화',
        image_url: 'https://placehold.co/400x400/2c5f4f/ffffff?text=Hematite+Necklace',
        featured: true,
        in_stock: true,
        birthstone_months: [1, 10],
        special_occasions: ['일상', '건강']
    },
    {
        id: 2,
        name: '헤마타이트 팔찌',
        category: '팔찌',
        price: 49000,
        description: '일상에서 착용하기 좋은 헤마타이트 팔찌입니다.',
        materials: '천연 헤마타이트',
        benefits: '자기력 에너지, 혈액순환',
        image_url: 'https://placehold.co/400x400/2c5f4f/ffffff?text=Hematite+Bracelet',
        featured: true,
        in_stock: true,
        birthstone_months: [1, 10],
        special_occasions: ['일상']
    },
    {
        id: 3,
        name: '헤마타이트 반지',
        category: '반지',
        price: 39000,
        description: '심플하고 세련된 헤마타이트 반지입니다.',
        materials: '천연 헤마타이트',
        benefits: '집중력 향상, 에너지 균형',
        image_url: 'https://placehold.co/400x400/2c5f4f/ffffff?text=Hematite+Ring',
        featured: false,
        in_stock: true,
        birthstone_months: [1, 10],
        special_occasions: ['일상', '선물']
    },
    {
        id: 4,
        name: '가넷 목걸이 (1월 탄생석)',
        category: '목걸이',
        price: 79000,
        description: '1월 탄생석 가넷이 박힌 아름다운 목걸이입니다.',
        materials: '가넷, 실버',
        benefits: '정열, 생명력 강화',
        image_url: 'https://placehold.co/400x400/8b0000/ffffff?text=Garnet+Necklace',
        featured: true,
        in_stock: true,
        birthstone_months: [1],
        special_occasions: ['생일', '기념일']
    },
    {
        id: 5,
        name: '자수정 팔찌 (2월 탄생석)',
        category: '팔찌',
        price: 59000,
        description: '2월 탄생석 자수정 팔찌입니다. 마음의 평화를 가져다줍니다.',
        materials: '자수정',
        benefits: '평온, 지혜',
        image_url: 'https://placehold.co/400x400/9966cc/ffffff?text=Amethyst+Bracelet',
        featured: false,
        in_stock: true,
        birthstone_months: [2],
        special_occasions: ['생일', '힐링']
    },
    {
        id: 6,
        name: '아쿠아마린 반지 (3월 탄생석)',
        category: '반지',
        price: 89000,
        description: '3월 탄생석 아쿠아마린 반지입니다.',
        materials: '아쿠아마린, 실버',
        benefits: '용기, 평온',
        image_url: 'https://placehold.co/400x400/7fffd4/000000?text=Aquamarine+Ring',
        featured: false,
        in_stock: true,
        birthstone_months: [3],
        special_occasions: ['생일', '여행']
    }
];

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 심석 웹사이트 시작');
    initApp();
});

function initApp() {
    loadProducts();
    setupEventListeners();
    loadCart();
    updateCartBadge();
}

// ===== 제품 로드 =====
function loadProducts() {
    console.log('📦 제품 로드 시작...');
    
    try {
        // localStorage 확인
        const savedProducts = localStorage.getItem('adminProducts') || localStorage.getItem('products');
        
        if (savedProducts) {
            allProducts = JSON.parse(savedProducts);
            console.log(`✅ localStorage에서 ${allProducts.length}개 제품 로드`);
        } else {
            // 데모 데이터 사용
            allProducts = DEMO_PRODUCTS;
            localStorage.setItem('adminProducts', JSON.stringify(DEMO_PRODUCTS));
            console.log(`✅ 데모 데이터 ${allProducts.length}개 제품 로드`);
        }
        
        displayProducts(allProducts);
    } catch (error) {
        console.error('❌ 제품 로드 오류:', error);
        allProducts = DEMO_PRODUCTS;
        displayProducts(allProducts);
    }
}

// ===== 제품 표시 =====
function displayProducts(products) {
    console.log(`🎨 제품 표시: ${products.length}개`);
    
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
            </div>
        `;
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="openProduct(${product.id})">
            <div class="product-image">
                <img src="${product.image_url}" alt="${product.name}">
                ${product.featured ? '<span class="product-badge">추천</span>' : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">${formatPrice(product.price)}원</div>
                <div class="product-materials">
                    <i class="fas fa-gem"></i> ${product.materials}
                </div>
                <div class="product-benefits">${product.benefits}</div>
                <div class="product-footer">
                    <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-shopping-bag"></i> 장바구니
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log('✅ 제품 표시 완료');
}

// ===== 필터링 =====
function filterProducts(category) {
    currentFilter = category;
    currentBirthstoneFilter = null;
    
    // 버튼 활성화 업데이트
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(category === 'all' ? '전체' : category)) {
            btn.classList.add('active');
        }
    });
    
    // 탄생석 필터 초기화
    document.querySelectorAll('.birthstone-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes('전체')) {
            btn.classList.add('active');
        }
    });
    
    const filtered = category === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.category === category);
    
    displayProducts(filtered);
}

function filterByBirthstone(month) {
    // 버튼 활성화 업데이트
    document.querySelectorAll('.birthstone-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (month === 'all') {
        currentBirthstoneFilter = null;
        filterProducts(currentFilter);
        return;
    }
    
    currentBirthstoneFilter = parseInt(month);
    
    let filtered = allProducts.filter(p => {
        const hasMonth = p.birthstone_months && p.birthstone_months.includes(currentBirthstoneFilter);
        const matchesCategory = currentFilter === 'all' || p.category === currentFilter;
        return hasMonth && matchesCategory;
    });
    
    displayProducts(filtered);
}

// ===== 제품 상세 =====
function openProduct(productId) {
    console.log('🔍 제품 상세:', productId);
    window.location.href = `product-detail.html?id=${productId}`;
}

// ===== 장바구니 =====
function loadCart() {
    try {
        const savedCart = localStorage.getItem('cart');
        cart = savedCart ? JSON.parse(savedCart) : [];
        console.log(`🛒 장바구니 로드: ${cart.length}개 품목`);
    } catch (error) {
        console.error('❌ 장바구니 로드 오류:', error);
        cart = [];
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
    console.log('🛒 장바구니 추가:', productId);
    
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
        console.error('❌ 제품을 찾을 수 없습니다:', productId);
        showNotification('제품을 찾을 수 없습니다', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartBadge();
    showNotification(`${product.name}이(가) 장바구니에 추가되었습니다!`, 'success');
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
    }
}

function showCart() {
    const modal = document.getElementById('cartModal');
    const modalBody = document.getElementById('cartModalBody');
    
    if (cart.length === 0) {
        modalBody.innerHTML = '<p>장바구니가 비어있습니다</p>';
    } else {
        const cartHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image_url}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${formatPrice(item.price)}원</p>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        modalBody.innerHTML = `
            ${cartHTML}
            <div class="cart-total">
                <h3>총 금액: ${formatPrice(total)}원</h3>
                <button class="btn btn-primary" onclick="checkout()">주문하기</button>
            </div>
        `;
    }
    
    modal.classList.add('active');
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.remove('active');
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        
        saveCart();
        updateCartBadge();
        showCart();
    }
}

function checkout() {
    showNotification('주문 기능은 곧 추가될 예정입니다', 'info');
}

// ===== 이벤트 리스너 =====
function setupEventListeners() {
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', showCart);
    }
    
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            showNotification('검색 기능은 곧 추가될 예정입니다', 'info');
        });
    }
}

// ===== 유틸리티 =====
function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR').format(price);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== 전역 함수 노출 =====
window.filterProducts = filterProducts;
window.filterByBirthstone = filterByBirthstone;
window.openProduct = openProduct;
window.addToCart = addToCart;
window.showCart = showCart;
window.closeCart = closeCart;
window.updateQuantity = updateQuantity;
window.checkout = checkout;

console.log('✅ main.js 로드 완료');
