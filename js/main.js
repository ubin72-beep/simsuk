// ===== Global Variables =====
let allProducts = [];
let currentFilter = 'all';
let currentBirthstoneFilter = null;
let cart = [];
let autoRefreshInterval = null;

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Content Loaded - Initializing app...');
    initApp();
});

async function initApp() {
    console.log('🔧 Starting app initialization...');
    
    // Load products
    console.log('📦 Step 1: Loading products...');
    await loadProducts();
    
    // Setup event listeners
    console.log('🎯 Step 2: Setting up event listeners...');
    setupEventListeners();
    
    // Initialize smooth scrolling
    console.log('📜 Step 3: Initializing smooth scroll...');
    initSmoothScroll();
    
    // Initialize header scroll effect
    console.log('📍 Step 4: Initializing header scroll...');
    initHeaderScroll();
    
    // Start auto-refresh (every 30 seconds)
    console.log('🔄 Step 5: Starting auto-refresh...');
    startAutoRefresh();
    
    console.log('✅ App initialization complete!');
}

// ===== Auto Refresh =====
function startAutoRefresh() {
    // Clear any existing interval
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    // Refresh products every 30 seconds
    autoRefreshInterval = setInterval(async () => {
        const currentProductCount = allProducts.length;
        await loadProducts(true); // Silent refresh
        const newProductCount = allProducts.length;
        
        // Show notification if products changed
        if (newProductCount !== currentProductCount) {
            console.log('Products updated automatically');
        }
    }, 30000); // 30 seconds
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// ===== Load Products from API =====
async function loadProducts(silent = false) {
    try {
        console.log('🔄 Loading products from API...');
        
        // GitHub Pages는 서버 API를 지원하지 않으므로
        // 데모 데이터를 사용합니다
        console.log('⚠️ Using demo data (GitHub Pages static hosting)');
        
        // 데모 제품 데이터
        const demoProducts = [
            {
                id: '1',
                name: '헤마타이트 목걸이',
                category: '목걸이',
                price: 69000,
                description: '강력한 자기력을 가진 헤마타이트 목걸이입니다. 혈액순환을 도와주고 스트레스를 완화시켜줍니다.',
                materials: '헤마타이트',
                benefits: '혈액순환 개선, 스트레스 완화',
                image_url: 'https://via.placeholder.com/400x400/2c5f4f/ffffff?text=Hematite+Necklace',
                featured: true,
                in_stock: true,
                birthstone_months: [1, 10],
                special_occasions: ['일상', '건강']
            },
            {
                id: '2',
                name: '헤마타이트 팔찌',
                category: '팔찌',
                price: 49000,
                description: '일상에서 착용하기 좋은 헤마타이트 팔찌입니다.',
                materials: '헤마타이트',
                benefits: '자기력 에너지, 혈액순환',
                image_url: 'https://via.placeholder.com/400x400/2c5f4f/ffffff?text=Hematite+Bracelet',
                featured: true,
                in_stock: true,
                birthstone_months: [1, 10],
                special_occasions: ['일상']
            },
            {
                id: '3',
                name: '헤마타이트 반지',
                category: '반지',
                price: 39000,
                description: '심플하고 세련된 헤마타이트 반지입니다.',
                materials: '헤마타이트',
                benefits: '집중력 향상, 에너지 균형',
                image_url: 'https://via.placeholder.com/400x400/2c5f4f/ffffff?text=Hematite+Ring',
                featured: false,
                in_stock: true,
                birthstone_months: [1, 10],
                special_occasions: ['일상', '선물']
            },
            {
                id: '4',
                name: '가넷 목걸이 (1월 탄생석)',
                category: '목걸이',
                price: 79000,
                description: '1월 탄생석 가넷이 박힌 아름다운 목걸이입니다.',
                materials: '가넷, 실버',
                benefits: '정열, 생명력 강화',
                image_url: 'https://via.placeholder.com/400x400/8b0000/ffffff?text=Garnet+Necklace',
                featured: true,
                in_stock: true,
                birthstone_months: [1],
                special_occasions: ['생일', '기념일']
            },
            {
                id: '5',
                name: '자수정 팔찌 (2월 탄생석)',
                category: '팔찌',
                price: 59000,
                description: '2월 탄생석 자수정 팔찌입니다. 마음의 평화를 가져다줍니다.',
                materials: '자수정',
                benefits: '평온, 지혜',
                image_url: 'https://via.placeholder.com/400x400/9966cc/ffffff?text=Amethyst+Bracelet',
                featured: false,
                in_stock: true,
                birthstone_months: [2],
                special_occasions: ['생일', '힐링']
            },
            {
                id: '6',
                name: '아쿠아마린 반지 (3월 탄생석)',
                category: '반지',
                price: 89000,
                description: '3월 탄생석 아쿠아마린 반지입니다.',
                materials: '아쿠아마린, 실버',
                benefits: '용기, 평온',
                image_url: 'https://via.placeholder.com/400x400/7fffd4/000000?text=Aquamarine+Ring',
                featured: false,
                in_stock: true,
                birthstone_months: [3],
                special_occasions: ['생일', '여행']
            }
        ];
        
        const result = {
            data: demoProducts,
            total: demoProducts.length
        };
        
        console.log('📦 Products data loaded (demo):', result);
        
        if (result.data && result.data.length > 0) {
            allProducts = result.data;
            console.log(`✅ Loaded ${allProducts.length} products`);
            
            // Only update display if not silent or filter is active
            if (!silent || currentFilter !== 'all') {
                const filteredProducts = currentFilter === 'all' 
                    ? allProducts 
                    : allProducts.filter(p => p.category === currentFilter);
                displayProducts(filteredProducts);
            } else {
                displayProducts(allProducts);
            }
        } else {
            console.warn('⚠️ No products found in response');
            // Show empty state
            if (!silent) {
                showEmptyState();
            }
        }
    } catch (error) {
        console.error('❌ Error loading products:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        if (!silent) {
            showErrorState();
            showNotification('제품을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요');
        }
    }
}

// ===== Display Products =====
function displayProducts(products) {
    console.log('🎨 Displaying products:', products.length);
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) {
        console.error('❌ productsGrid element not found!');
        showNotification('페이지 구성 요소를 찾을 수 없습니다. 페이지를 새로고침해주세요');
        return;
    }
    
    console.log('✅ productsGrid element found');
    
    if (products.length === 0) {
        console.log('⚠️ No products to display');
        productsGrid.innerHTML = `
            <div class="loading">
                <i class="fas fa-box-open"></i>
                <p>표시할 제품이 없습니다</p>
            </div>
        `;
        return;
    }
    
    console.log(`📋 Rendering ${products.length} product cards...`);
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}" onclick="openProductModal('${product.id}')">
            <div class="product-image">
                <img src="${product.image_url}" alt="${product.name}">
                ${product.featured ? '<span class="product-badge">추천</span>' : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-materials"><i class="fas fa-gem"></i> ${product.materials}</div>
                <div class="product-benefits">${product.benefits}</div>
                <div class="product-footer">
                    <div class="product-price">${formatPrice(product.price)}원</div>
                    <button class="add-to-cart-btn" onclick="addToCart(event, '${product.id}')">
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    console.log('✅ Products rendered successfully');
}

// ===== Filter Products =====
function filterProducts(category) {
    currentFilter = category;
    currentBirthstoneFilter = null; // 카테고리 필터 시 탄생석 필터 초기화
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Reset birthstone filter
    document.querySelectorAll('.birthstone-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Filter products
    const filteredProducts = category === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.category === category);
    
    displayProducts(filteredProducts);
}

// ===== Filter By Birthstone =====
function filterByBirthstone(month) {
    // Update active birthstone button
    document.querySelectorAll('.birthstone-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (month === 'all') {
        currentBirthstoneFilter = null;
        // Show all products based on current category filter
        const filteredProducts = currentFilter === 'all' 
            ? allProducts 
            : allProducts.filter(p => p.category === currentFilter);
        displayProducts(filteredProducts);
        return;
    }
    
    event.target.classList.add('active');
    currentBirthstoneFilter = parseInt(month);
    
    // Filter by birthstone and current category
    let filteredProducts = allProducts.filter(p => {
        const hasMonth = p.birthstone_months && Array.isArray(p.birthstone_months) && 
                         p.birthstone_months.includes(currentBirthstoneFilter);
        const matchesCategory = currentFilter === 'all' || p.category === currentFilter;
        return hasMonth && matchesCategory;
    });
    
    displayProducts(filteredProducts);
    
    // Show message if no products found
    if (filteredProducts.length === 0) {
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = `
            <div class="loading" style="grid-column: 1 / -1;">
                <i class="fas fa-gem" style="font-size: 3rem; color: #667eea; margin-bottom: 15px;"></i>
                <h3 style="color: #2c5f4f; margin-bottom: 10px;">${month}월 탄생석 제품 준비 중</h3>
                <p>곧 멋진 ${month}월 탄생석 제품들을 선보일 예정입니다</p>
                <p style="font-size: 0.9rem; margin-top: 10px; color: #666;">
                    다른 탄생석이나 전체 제품을 확인해보세요
                </p>
            </div>
        `;
    }
}

// ===== Filter By Special Occasion =====
let currentOccasionFilter = null;

// 기념일별 추천 제품 매핑
const occasionRecommendations = {
    valentine: ['목걸이', '반지'],          // 발렌타인데이: 로맨틱한 목걸이, 반지
    whiteday: ['팔찌', '목걸이'],          // 화이트데이: 답례용 팔찌, 목걸이
    parents: ['목걸이', '팔찌'],           // 어버이날: 건강을 위한 목걸이, 팔찌
    birthday: ['all'],                     // 생일: 모든 제품
    anniversary: ['목걸이', '반지'],       // 결혼기념일: 고급스러운 목걸이, 반지
    graduation: ['팔찌', '목걸이'],        // 졸업: 새 출발을 위한 팔찌, 목걸이
    christmas: ['all']                     // 크리스마스: 모든 제품
};

function filterByOccasion(occasion) {
    // Update active occasion button
    document.querySelectorAll('.occasion-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Reset other filters
    document.querySelectorAll('.birthstone-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (occasion === 'all') {
        currentOccasionFilter = null;
        currentFilter = 'all';
        currentBirthstoneFilter = null;
        displayProducts(allProducts);
        return;
    }
    
    event.target.classList.add('active');
    currentOccasionFilter = occasion;
    
    // Filter products by special_occasions field
    let filteredProducts = allProducts.filter(p => {
        // 제품에 special_occasions 필드가 있고, 해당 occasion이 포함되어 있는지 확인
        if (p.special_occasions && Array.isArray(p.special_occasions)) {
            return p.special_occasions.includes(occasion);
        }
        return false;
    });
    
    // If no products with special_occasions, fall back to category-based filtering
    if (filteredProducts.length === 0) {
        const recommendedCategories = occasionRecommendations[occasion] || ['all'];
        if (recommendedCategories.includes('all')) {
            filteredProducts = allProducts;
        } else {
            filteredProducts = allProducts.filter(p => 
                recommendedCategories.includes(p.category)
            );
        }
    }
    
    // Sort by featured first, then by price
    filteredProducts.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.price - a.price; // Higher price first for gift
    });
    
    displayProducts(filteredProducts);
    
    // Show occasion message
    if (filteredProducts.length > 0) {
        const productsGrid = document.getElementById('productsGrid');
        const occasionNames = {
            valentine: '발렌타인데이',
            whiteday: '화이트데이',
            parents: '어버이날',
            birthday: '생일',
            anniversary: '결혼기념일',
            graduation: '졸업',
            christmas: '크리스마스'
        };
        
        const occasionTips = {
            valentine: '사랑하는 사람에게 마음을 전하는 특별한 선물',
            whiteday: '달콤한 답례, 진심을 담은 선물',
            parents: '부모님 건강과 행복을 기원하는 선물',
            birthday: '특별한 날을 더욱 빛나게 할 선물',
            anniversary: '소중한 추억을 함께하는 의미 있는 선물',
            graduation: '새로운 시작을 응원하는 축하 선물',
            christmas: '따뜻한 마음을 전하는 연말 선물'
        };
        
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = 'grid-column: 1 / -1; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 20px; text-align: center; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);';
        messageDiv.innerHTML = `
            <i class="fas fa-gift" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <h3 style="margin-bottom: 10px; font-size: 1.5rem;">${occasionNames[occasion]} 특별 선물</h3>
            <p style="font-size: 1.1rem; margin-bottom: 15px; opacity: 0.95;">${occasionTips[occasion]}</p>
            <p style="font-size: 0.9rem; opacity: 0.9;">
                💝 ${filteredProducts.length}개의 추천 제품을 확인해보세요
            </p>
        `;
        productsGrid.insertBefore(messageDiv, productsGrid.firstChild);
    }
}

// ===== Open Product Modal =====
function openProductModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-product">
            <div class="modal-product-image">
                <img src="${product.image_url}" alt="${product.name}">
            </div>
            <div class="modal-product-info">
                <div class="product-category">${product.category}</div>
                <h2>${product.name}</h2>
                <div class="product-price">${formatPrice(product.price)}원</div>
                
                <div class="modal-product-section">
                    <h3><i class="fas fa-gem"></i> 재료</h3>
                    <p>${product.materials}</p>
                </div>
                
                <div class="modal-product-section">
                    <h3><i class="fas fa-heart-pulse"></i> 건강 효능</h3>
                    <p>${product.benefits}</p>
                </div>
                
                <div class="modal-product-section">
                    <h3><i class="fas fa-info-circle"></i> 상세 설명</h3>
                    <p>${product.description || '이 제품은 천연 헤마타이트와 원석을 사용하여 정성스럽게 제작되었습니다. 각 제품은 고유한 특성을 가지고 있으며, 건강과 아름다움을 동시에 선사합니다.'}</p>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="addToCart(event, '${product.id}', true)">
                        <i class="fas fa-shopping-bag"></i> 장바구니 담기
                    </button>
                    <button class="btn btn-secondary" onclick="closeProductModal()">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== Close Product Modal =====
function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Add to Cart =====
function addToCart(event, productId, closeModal = false) {
    event.stopPropagation();
    
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartBadge();
    showNotification(`${product.name}이(가) 장바구니에 추가되었습니다`);
    
    if (closeModal) {
        closeProductModal();
    }
}

// ===== Update Cart Badge =====
function updateCartBadge() {
    const badge = document.querySelector('.badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
}

// ===== Show Notification =====
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #2c5f4f;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i> ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== Format Price =====
function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR').format(price);
}

// ===== Scroll to Top =====
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== Show Empty State =====
function showEmptyState() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = `
        <div class="loading">
            <i class="fas fa-box-open"></i>
            <p>아직 등록된 제품이 없습니다</p>
            <p style="font-size: 0.9rem; margin-top: 10px;">곧 멋진 제품들을 선보일 예정입니다</p>
        </div>
    `;
}

// ===== Show Error State =====
function showErrorState() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = `
        <div class="loading">
            <i class="fas fa-exclamation-triangle"></i>
            <p>제품을 불러오는 중 오류가 발생했습니다</p>
            <button class="btn btn-primary" onclick="loadProducts()" style="margin-top: 20px;">
                다시 시도
            </button>
        </div>
    `;
}

// ===== Setup Event Listeners =====
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
        });
    });
    
    // Birthstone filter buttons
    document.querySelectorAll('.birthstone-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const month = this.getAttribute('data-month');
            filterByBirthstone(month);
        });
    });
    
    // Special occasion buttons
    document.querySelectorAll('.occasion-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const occasion = this.getAttribute('data-occasion');
            filterByOccasion(occasion);
        });
    });
    
    // Modal close events
    const modal = document.getElementById('productModal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    
    modalOverlay.addEventListener('click', closeProductModal);
    modalClose.addEventListener('click', closeProductModal);
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleContactForm);
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', handleNewsletterForm);
    
    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.addEventListener('click', showCart);
    
    // Search button
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', openSearchModal);
    
    // Search modal close events
    const searchModal = document.getElementById('searchModal');
    const searchOverlay = searchModal.querySelector('.modal-overlay');
    const searchClose = searchModal.querySelector('.modal-close');
    searchOverlay.addEventListener('click', closeSearchModal);
    searchClose.addEventListener('click', closeSearchModal);
    
    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    
    // Order tracking modal close events
    const trackingModal = document.getElementById('orderTrackingModal');
    const trackingOverlay = trackingModal.querySelector('.modal-overlay');
    const trackingClose = trackingModal.querySelector('.modal-close');
    trackingOverlay.addEventListener('click', closeOrderTracking);
    trackingClose.addEventListener('click', closeOrderTracking);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearchModal();
        }
        // ESC to close modals
        if (e.key === 'Escape') {
            closeSearchModal();
            closeOrderTracking();
        }
    });
    
    // FAQ Accordion
    setupFAQ();
}

// ===== Terms Modal =====
function openTermsModal(e, type) {
    if (e) e.preventDefault();
    
    const modal = document.getElementById('termsModal');
    const content = document.getElementById('termsContent');
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');
    
    if (type === 'terms') {
        content.innerHTML = `
            <h2 style="margin-bottom: 20px;"><i class="fas fa-file-contract"></i> 이용약관</h2>
            <div style="max-height: 60vh; overflow-y: auto; line-height: 1.8; color: #333;">
                <h3>제1조 (목적)</h3>
                <p>이 약관은 심석(이하 "회사")이 운영하는 웹사이트(이하 "사이트")에서 제공하는 서비스(이하 "서비스")를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
                
                <h3>제2조 (정의)</h3>
                <p>1. "사이트"란 회사가 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 또는 용역을 거래할 수 있도록 설정한 가상의 영업장을 말합니다.</p>
                <p>2. "이용자"란 사이트에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</p>
                
                <h3>제3조 (약관의 명시와 개정)</h3>
                <p>1. 회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 사이트의 초기 서비스화면에 게시합니다.</p>
                <p>2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>
                
                <h3>제4조 (서비스의 제공 및 변경)</h3>
                <p>1. 회사는 다음과 같은 업무를 수행합니다:</p>
                <ul>
                    <li>재화 또는 용역에 대한 정보 제공 및 구매계약의 체결</li>
                    <li>구매계약이 체결된 재화 또는 용역의 배송</li>
                    <li>기타 회사가 정하는 업무</li>
                </ul>
                
                <h3>제5조 (주문 및 결제)</h3>
                <p>1. 이용자는 사이트에서 다음의 방법으로 주문합니다:</p>
                <ul>
                    <li>재화 또는 용역의 선택</li>
                    <li>성명, 주소, 전화번호 등의 입력</li>
                    <li>약관내용, 청약철회권 등에 관한 확인</li>
                    <li>결제방법의 선택 및 결제</li>
                </ul>
                
                <h3>제6조 (배송)</h3>
                <p>1. 회사는 이용자가 구매한 재화에 대해 배송수단, 배송비용 부담자, 배송기간 등을 명시합니다.</p>
                <p>2. 배송기간은 입금 확인 후 1-2일 이내에 발송되며, 발송 후 1-2일 내 도착합니다.</p>
                
                <h3>제7조 (청약철회 및 반품)</h3>
                <p>1. 이용자는 상품 수령일로부터 7일 이내에 청약철회(반품)를 할 수 있습니다.</p>
                <p>2. 다음의 경우 반품이 불가능합니다:</p>
                <ul>
                    <li>상품을 사용 또는 일부 소비한 경우</li>
                    <li>시간의 경과에 의하여 재판매가 곤란할 정도로 상품의 가치가 감소한 경우</li>
                    <li>복제가 가능한 상품의 포장을 훼손한 경우</li>
                </ul>
                
                <h3>제8조 (개인정보보호)</h3>
                <p>회사는 이용자의 개인정보 수집 시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.</p>
                
                <p style="margin-top: 30px; text-align: right; color: #666;">시행일: 2025년 1월 1일</p>
            </div>
        `;
    } else if (type === 'privacy') {
        content.innerHTML = `
            <h2 style="margin-bottom: 20px;"><i class="fas fa-shield-alt"></i> 개인정보처리방침</h2>
            <div style="max-height: 60vh; overflow-y: auto; line-height: 1.8; color: #333;">
                <h3>1. 개인정보의 처리 목적</h3>
                <p>심석(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                <ul>
                    <li>재화 또는 서비스 제공</li>
                    <li>회원 관리</li>
                    <li>마케팅 및 광고에의 활용</li>
                </ul>
                
                <h3>2. 개인정보의 처리 및 보유 기간</h3>
                <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                <ul>
                    <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                    <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                    <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                </ul>
                
                <h3>3. 처리하는 개인정보의 항목</h3>
                <p>회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>
                <ul>
                    <li>필수항목: 성명, 휴대전화번호, 주소</li>
                    <li>선택항목: 이메일, 카카오톡 ID</li>
                </ul>
                
                <h3>4. 개인정보의 제3자 제공</h3>
                <p>회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
                
                <h3>5. 개인정보의 파기</h3>
                <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
                
                <h3>6. 정보주체의 권리·의무 및 행사방법</h3>
                <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
                <ul>
                    <li>개인정보 열람요구</li>
                    <li>오류 등이 있을 경우 정정 요구</li>
                    <li>삭제요구</li>
                    <li>처리정지 요구</li>
                </ul>
                
                <h3>7. 개인정보 보호책임자</h3>
                <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:</p>
                <ul>
                    <li>개인정보 보호책임자: 심석</li>
                    <li>연락처: 0502-1909-7788</li>
                    <li>이메일: simsukbiz@gmail.com</li>
                </ul>
                
                <h3>8. 개인정보 처리방침 변경</h3>
                <p>이 개인정보처리방침은 2025년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
                
                <p style="margin-top: 30px; text-align: right; color: #666;">시행일: 2025년 1월 1일</p>
            </div>
        `;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Close events
    overlay.onclick = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };
    closeBtn.onclick = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };
}

// ===== FAQ Accordion =====
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ===== Handle Contact Form =====
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    console.log('Contact form submitted:', data);
    
    showNotification('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
    e.target.reset();
}

// ===== Handle Newsletter Form =====
function handleNewsletterForm(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input').value;
    console.log('Newsletter subscription:', email);
    
    showNotification('뉴스레터 구독이 완료되었습니다!');
    e.target.reset();
}

// ===== Show Cart =====
function showCart() {
    if (cart.length === 0) {
        showNotification('장바구니가 비어있습니다');
        return;
    }
    
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    const cartItems = cart.map(item => `
        <div style="display: flex; gap: 20px; padding: 20px; border-bottom: 1px solid #e0e0e0; align-items: center;">
            <img src="${item.image_url}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px;">
            <div style="flex: 1;">
                <h4 style="margin-bottom: 5px;">${item.name}</h4>
                <p style="color: #666; font-size: 0.9rem;">${item.category}</p>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: 700; color: #2c5f4f; margin-bottom: 10px;">${formatPrice(item.price * item.quantity)}원</div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button onclick="updateCartQuantity('${item.id}', -1)" style="width: 30px; height: 30px; background: #f0f0f0; border-radius: 5px;">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity('${item.id}', 1)" style="width: 30px; height: 30px; background: #f0f0f0; border-radius: 5px;">+</button>
                </div>
            </div>
        </div>
    `).join('');
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    modalBody.innerHTML = `
        <h2 style="margin-bottom: 30px;">장바구니</h2>
        <div style="max-height: 400px; overflow-y: auto;">
            ${cartItems}
        </div>
        <div style="padding: 30px 20px; background: #f8f8f8; border-radius: 10px; margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <span style="font-size: 1.2rem; font-weight: 500;">총 금액</span>
                <span style="font-size: 1.8rem; font-weight: 700; color: #d4af37;">${formatPrice(totalPrice)}원</span>
            </div>
            <div style="display: flex; gap: 15px;">
                <button class="btn btn-primary" style="flex: 1;" onclick="checkout()">
                    주문하기
                </button>
                <button class="btn btn-secondary" onclick="closeProductModal()">
                    계속 쇼핑하기
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== Update Cart Quantity =====
function updateCartQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    
    updateCartBadge();
    showCart();
}

// ===== Checkout =====
function checkout() {
    closeProductModal();
    showOrderContactForm();
}

// ===== Show Order Contact Form =====
function showOrderContactForm() {
    // 저장된 고객 정보 불러오기
    const savedCustomer = localStorage.getItem('customerInfo');
    let customerData = {
        name: '',
        phone: '',
        email: '',
        kakao: '',
        address: ''
    };
    
    if (savedCustomer) {
        try {
            customerData = JSON.parse(savedCustomer);
            console.log('✅ 저장된 고객 정보 불러옴:', customerData);
        } catch (e) {
            console.error('고객 정보 파싱 오류:', e);
        }
    }
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    // 장바구니 상품 목록
    const orderItems = cart.map(item => 
        `${item.name} x ${item.quantity}개 = ${formatPrice(item.price * item.quantity)}원`
    ).join('\n');
    
    // 가격 계산
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal >= 50000 ? 0 : 3000;
    const discount = 0;
    const totalPrice = subtotal + shippingFee - discount;
    
    modalBody.innerHTML = `
        <h2 style="margin-bottom: 30px; color: var(--primary-color);">
            <i class="fas fa-shopping-cart"></i> 주문하기
        </h2>
        
        <div style="background: var(--light-color); padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <h3 style="margin-bottom: 15px; color: var(--primary-color);">주문 상품</h3>
            ${cart.map(item => `
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                    <div>
                        <div style="font-weight: 500; color: #333;">${item.name}</div>
                        <div style="font-size: 0.9rem; color: #666;">${formatPrice(item.price)}원 × ${item.quantity}개</div>
                    </div>
                    <div style="font-weight: 600; color: var(--primary-color);">
                        ${formatPrice(item.price * item.quantity)}원
                    </div>
                </div>
            `).join('')}
            <div style="border-top: 2px solid var(--primary-color); margin-top: 15px; padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #666;">
                    <span>상품 금액</span>
                    <span>${formatPrice(subtotal)}원</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">배송비</span>
                    <span style="color: ${shippingFee === 0 ? '#4caf50' : '#666'}; font-weight: ${shippingFee === 0 ? '600' : '400'};">
                        ${shippingFee === 0 ? '무료 🎉' : formatPrice(shippingFee) + '원'}
                    </span>
                </div>
                ${discount > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">할인</span>
                    <span style="color: #f44336; font-weight: 600;">-${formatPrice(discount)}원</span>
                </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #e0e0e0;">
                    <strong style="font-size: 1.2rem; color: var(--primary-color);">총 결제 금액</strong>
                    <strong style="font-size: 1.3rem; color: var(--accent-color);">${formatPrice(totalPrice)}원</strong>
                </div>
            </div>
            ${subtotal < 50000 ? `
            <div style="background: #e3f2fd; padding: 12px; border-radius: 8px; margin-top: 15px;">
                <p style="margin: 0; color: #1976d2; font-size: 0.9rem; text-align: center;">
                    <i class="fas fa-truck"></i> 
                    ${formatPrice(50000 - subtotal)}원만 더 구매하시면 <strong>무료 배송</strong>!
                </p>
            </div>
            ` : ''}
        </div>
        
        <form id="orderContactForm" style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="font-weight: 600; color: var(--dark-color);">
                    <i class="fas fa-user"></i> 이름 *
                </label>
                <input type="text" id="orderName" required 
                    value="${customerData.name || ''}"
                    style="padding: 12px; border: 2px solid var(--border-color); border-radius: 8px; font-size: 1rem;"
                    placeholder="홍길동">
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="font-weight: 600; color: var(--dark-color);">
                    <i class="fas fa-phone"></i> 전화번호 *
                </label>
                <input type="tel" id="orderPhone" required 
                    value="${customerData.phone || ''}"
                    style="padding: 12px; border: 2px solid var(--border-color); border-radius: 8px; font-size: 1rem;"
                    placeholder="010-1234-5678">
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="font-weight: 600; color: var(--dark-color);">
                    <i class="fas fa-envelope"></i> 이메일 (선택)
                </label>
                <input type="email" id="orderEmail"
                    value="${customerData.email || ''}"
                    style="padding: 12px; border: 2px solid var(--border-color); border-radius: 8px; font-size: 1rem;"
                    placeholder="example@email.com">
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="font-weight: 600; color: var(--dark-color);">
                    <i class="fab fa-kickstarter"></i> 카카오톡 ID (선택)
                </label>
                <input type="text" id="orderKakao"
                    value="${customerData.kakao || ''}"
                    style="padding: 12px; border: 2px solid var(--border-color); border-radius: 8px; font-size: 1rem;"
                    placeholder="카카오톡 ID">
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="font-weight: 600; color: var(--dark-color);">
                    <i class="fas fa-map-marker-alt"></i> 배송지 주소 *
                </label>
                <textarea id="orderAddress" required rows="3"
                    style="padding: 12px; border: 2px solid var(--border-color); border-radius: 8px; font-size: 1rem; resize: vertical;"
                    placeholder="서울시 강남구 테헤란로 123, 456호">${customerData.address || ''}</textarea>
                ${savedCustomer ? `
                <div style="background: #e3f2fd; padding: 10px; border-radius: 6px; margin-top: 5px;">
                    <i class="fas fa-info-circle" style="color: #1976d2;"></i>
                    <span style="color: #1565c0; font-size: 0.9rem; margin-left: 5px;">
                        이전 주문 정보가 자동으로 입력되었습니다. 수정 가능합니다.
                    </span>
                </div>
                ` : ''}
                <textarea id="orderAddress" required rows="3"
                    style="padding: 12px; border: 2px solid var(--border-color); border-radius: 8px; font-size: 1rem; resize: vertical;"
                    placeholder="서울시 강남구 테헤란로 123&#10;아파트 101동 1001호"></textarea>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <label style="font-weight: 600; color: var(--dark-color);">
                    <i class="fas fa-comment"></i> 요청사항 (선택)
                </label>
                <textarea id="orderMemo" rows="3"
                    style="padding: 12px; border: 2px solid var(--border-color); border-radius: 8px; font-size: 1rem; resize: vertical;"
                    placeholder="배송 시 요청사항을 입력해주세요"></textarea>
            </div>
            
            <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; border-left: 4px solid #4caf50; margin-bottom: 10px;">
                <h4 style="margin: 0 0 12px 0; color: #2e7d32; font-size: 1rem;">
                    <i class="fas fa-university"></i> 입금 계좌 안내
                </h4>
                <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="color: #666; font-size: 0.9rem;">은행</span>
                        <strong style="color: #2c5f4f; font-size: 1.1rem;">카카오뱅크</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="color: #666; font-size: 0.9rem;">계좌번호</span>
                        <strong style="color: #2c5f4f; font-size: 1.1rem; letter-spacing: 1px;">3333-32-1059712</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #666; font-size: 0.9rem;">예금주</span>
                        <strong style="color: #2c5f4f; font-size: 1.1rem;">심석</strong>
                    </div>
                </div>
                <p style="margin: 0; color: #2e7d32; font-size: 0.85rem; line-height: 1.6;">
                    <i class="fas fa-check-circle"></i> 
                    주문 접수 후 위 계좌로 입금해주시면 확인 후 배송해드립니다.<br>
                    <i class="fas fa-phone"></i> 
                    입금 후 연락처로 입금 확인 문자를 보내주시면 더 빠르게 처리됩니다.
                </p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                <p style="margin: 0; color: #856404; font-size: 0.9rem; line-height: 1.6;">
                    <i class="fas fa-info-circle"></i> 
                    주문 접수 후 담당자가 입력하신 연락처로 연락드립니다.<br>
                    궁금하신 사항은 <strong>0502-1909-7788</strong>로 문의해주세요.
                </p>
            </div>
            
            <div style="display: flex; gap: 15px; margin-top: 10px;">
                <button type="submit" class="btn btn-primary" style="flex: 1; padding: 15px; font-size: 1.1rem;">
                    <i class="fas fa-paper-plane"></i> 주문 접수하기
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeProductModal()" style="padding: 15px;">
                    <i class="fas fa-times"></i> 취소
                </button>
            </div>
        </form>
    `;
    
    // 폼 제출 이벤트
    document.getElementById('orderContactForm').addEventListener('submit', handleOrderSubmit);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== Handle Order Submit =====
async function handleOrderSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;
    const email = document.getElementById('orderEmail').value;
    const kakao = document.getElementById('orderKakao').value;
    const address = document.getElementById('orderAddress').value;
    const memo = document.getElementById('orderMemo').value;
    
    // 고객 정보 저장 (다음 주문 시 자동 입력용)
    const customerInfo = {
        name: name,
        phone: phone,
        email: email,
        kakao: kakao,
        address: address
    };
    localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
    console.log('✅ 고객 정보 저장됨:', customerInfo);
    
    // 가격 계산
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal >= 50000 ? 0 : 3000; // 5만원 이상 무료배송
    const discount = 0; // 할인 금액 (추후 쿠폰 기능 추가 시 사용)
    const totalPrice = subtotal + shippingFee - discount;
    
    // 주문 상품 목록 (상세)
    const orderItems = cart.map(item => 
        `${item.name} x ${item.quantity}개 = ${formatPrice(item.price * item.quantity)}원`
    ).join('\n');
    
    // 가격 상세 내역
    const priceDetails = `
상품 금액: ${formatPrice(subtotal)}원
배송비: ${shippingFee === 0 ? '무료' : formatPrice(shippingFee) + '원'}${discount > 0 ? '\n할인: -' + formatPrice(discount) + '원' : ''}
━━━━━━━━━━━━━━━━━━━━━━
총 결제 금액: ${formatPrice(totalPrice)}원`;
    
    // 주문번호 생성 (날짜 + 랜덤)
    const orderNumber = 'ORD-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    // API에 주문 저장
    try {
        const orderData = {
            order_number: orderNumber,
            customer_name: name,
            customer_phone: phone,
            customer_email: email || '',
            customer_kakao: kakao || '',
            shipping_address: address,
            special_request: memo || '',
            products: JSON.stringify(cart),
            subtotal: subtotal,
            shipping_fee: shippingFee,
            discount: discount,
            total_amount: totalPrice,
            status: '접수',
            order_date: new Date().toISOString()
        };
        
        const response = await fetch('tables/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            throw new Error('주문 저장 실패');
        }
        
        // 이메일 본문 작성
        const subject = '[심석] 새로운 주문 - ' + name + ' (' + orderNumber + ')';
        const body = `
━━━━━━━━━━━━━━━━━━━━━━
   심석(心石) 주문서
━━━━━━━━━━━━━━━━━━━━━━

📋 주문번호: ${orderNumber}

📦 주문 상품
${orderItems}

💰 가격 내역
${priceDetails}

━━━━━━━━━━━━━━━━━━━━━━

👤 고객 정보
━━━━━━━━━━━━━━━━━━━━━━
이름: ${name}
전화번호: ${phone}
이메일: ${email || '미입력'}
카카오톡 ID: ${kakao || '미입력'}

📍 배송지 주소
━━━━━━━━━━━━━━━━━━━━━━
${address}

💬 요청사항
━━━━━━━━━━━━━━━━━━━━━━
${memo || '없음'}

━━━━━━━━━━━━━━━━━━━━━━
주문일시: ${new Date().toLocaleString('ko-KR')}
━━━━━━━━━━━━━━━━━━━━━━
        `;
        
        // 이메일 클라이언트 열기
        window.location.href = `mailto:simsukbiz@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // 주문 정보를 localStorage에 저장 (최근 주문 자동 입력용)
        localStorage.setItem('lastOrderNumber', orderNumber);
        localStorage.setItem('lastOrderPhone', phone);
        localStorage.setItem('lastOrderDate', new Date().toISOString());
        console.log('✅ 주문 정보 저장됨:', { orderNumber, phone });
        
        // 성공 메시지 표시
        setTimeout(() => {
            const modalBody = document.getElementById('modalBody');
            modalBody.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 4rem; color: #4caf50; margin-bottom: 20px;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2 style="color: #2c5f4f; margin-bottom: 15px;">주문이 접수되었습니다!</h2>
                    <p style="font-size: 1.1rem; color: #666; margin-bottom: 30px;">
                        주문번호: <strong style="color: #2c5f4f;">${orderNumber}</strong>
                    </p>
                    
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 25px; text-align: left;">
                        <h3 style="margin: 0 0 15px 0; color: #2c5f4f; font-size: 1rem; border-bottom: 2px solid #2c5f4f; padding-bottom: 10px;">
                            <i class="fas fa-shopping-bag"></i> 주문 상품
                        </h3>
                        ${cart.map(item => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                                <div style="flex: 1;">
                                    <div style="font-weight: 500; color: #333; margin-bottom: 5px;">${item.name}</div>
                                    <div style="font-size: 0.9rem; color: #666;">${formatPrice(item.price)}원 × ${item.quantity}개</div>
                                </div>
                                <div style="font-weight: 600; color: #2c5f4f; font-size: 1.1rem;">
                                    ${formatPrice(item.price * item.quantity)}원
                                </div>
                            </div>
                        `).join('')}
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #2c5f4f;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: #666;">상품 금액</span>
                                <span style="color: #333;">${formatPrice(subtotal)}원</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: #666;">배송비</span>
                                <span style="color: ${shippingFee === 0 ? '#4caf50' : '#333'}; font-weight: ${shippingFee === 0 ? '600' : '400'};">
                                    ${shippingFee === 0 ? '무료 배송 🎉' : formatPrice(shippingFee) + '원'}
                                </span>
                            </div>
                            ${discount > 0 ? `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: #666;">할인</span>
                                <span style="color: #f44336; font-weight: 600;">-${formatPrice(discount)}원</span>
                            </div>
                            ` : ''}
                            <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid #e0e0e0;">
                                <span style="font-size: 1.1rem; font-weight: 600; color: #2c5f4f;">총 주문 금액</span>
                                <span style="font-size: 1.3rem; font-weight: 700; color: #d4af37;">${formatPrice(totalPrice)}원</span>
                            </div>
                        </div>
                    </div>
                    
                    ${subtotal < 50000 ? `
                    <div style="background: #e3f2fd; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 0; color: #1976d2; font-size: 0.9rem;">
                            <i class="fas fa-truck"></i> 
                            ${formatPrice(50000 - subtotal)}원만 더 구매하시면 <strong>무료 배송</strong> 혜택을 받으실 수 있어요!
                        </p>
                    </div>
                    ` : ''}
                    
                    <div style="background: #e8f5e9; padding: 25px; border-radius: 12px; margin-bottom: 25px; text-align: left;">
                        <h3 style="margin: 0 0 15px 0; color: #2e7d32; font-size: 1.1rem;">
                            <i class="fas fa-university"></i> 입금 계좌 안내
                        </h3>
                        <div style="background: white; padding: 18px; border-radius: 8px; margin-bottom: 15px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: #666;">은행</span>
                                <strong style="color: #2c5f4f; font-size: 1.1rem;">카카오뱅크</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: #666;">계좌번호</span>
                                <strong style="color: #d4af37; font-size: 1.2rem; letter-spacing: 1px;">3333-32-1059712</strong>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span style="color: #666;">예금주</span>
                                <strong style="color: #2c5f4f; font-size: 1.1rem;">심석</strong>
                            </div>
                            <div style="border-top: 2px solid #4caf50; margin-top: 15px; padding-top: 15px;">
                                <div style="margin-bottom: 8px; font-size: 0.9rem; color: #666;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                        <span>상품 금액</span>
                                        <span>${formatPrice(subtotal)}원</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                        <span>배송비</span>
                                        <span style="color: ${shippingFee === 0 ? '#4caf50' : '#666'};">${shippingFee === 0 ? '무료' : formatPrice(shippingFee) + '원'}</span>
                                    </div>
                                    ${discount > 0 ? `<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                        <span>할인</span>
                                        <span style="color: #f44336;">-${formatPrice(discount)}원</span>
                                    </div>` : ''}
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 1.1rem; padding-top: 10px; border-top: 1px solid #e0e0e0;">
                                    <span style="color: #666;">입금 금액</span>
                                    <strong style="color: #d4af37; font-size: 1.3rem;">${formatPrice(totalPrice)}원</strong>
                                </div>
                            </div>
                        </div>
                        <p style="margin: 0; color: #2e7d32; font-size: 0.9rem; line-height: 1.6;">
                            <i class="fas fa-info-circle"></i> 
                            입금 후 <strong>${phone}</strong>로 입금 확인 문자를 보내주시면<br>
                            더 빠르게 배송 처리해드립니다.
                        </p>
                    </div>
                    
                    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
                        <p style="margin: 0; color: #856404; font-size: 0.9rem; line-height: 1.6;">
                            <i class="fas fa-phone"></i> 
                            문의사항: <strong>0502-1909-7788</strong><br>
                            <i class="fas fa-envelope"></i> 
                            이메일: <strong>simsukbiz@gmail.com</strong>
                        </p>
                    </div>
                    
                    <div style="display: flex; gap: 15px;">
                        <button class="btn btn-primary" onclick="viewMyOrder()" style="flex: 1; padding: 15px; font-size: 1.1rem;">
                            <i class="fas fa-search"></i> 내 주문 조회
                        </button>
                        <button class="btn btn-secondary" onclick="closeProductModal()" style="padding: 15px 30px; font-size: 1.1rem;">
                            <i class="fas fa-check"></i> 확인
                        </button>
                    </div>
                </div>
            `;
            cart = [];
            updateCartBadge();
        }, 500);
        
    } catch (error) {
        console.error('주문 저장 오류:', error);
        showNotification('주문 접수 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// ===== Search Functions =====
function openSearchModal() {
    const modal = document.getElementById('searchModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on search input
    setTimeout(() => {
        document.getElementById('searchInput').focus();
    }, 100);
}

function closeSearchModal() {
    const modal = document.getElementById('searchModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset search
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = `
        <div style="text-align: center; padding: 40px; color: #999;">
            <i class="fas fa-keyboard" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.3;"></i>
            <p>검색어를 입력하세요</p>
        </div>
    `;
}

function handleSearch(e) {
    const searchTerm = e.target.value.trim().toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    
    if (!searchTerm) {
        resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #999;">
                <i class="fas fa-keyboard" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.3;"></i>
                <p>검색어를 입력하세요</p>
            </div>
        `;
        return;
    }
    
    // Search in products
    const results = allProducts.filter(product => {
        const name = product.name.toLowerCase();
        const category = product.category.toLowerCase();
        const materials = product.materials.toLowerCase();
        const benefits = product.benefits.toLowerCase();
        const description = (product.description || '').toLowerCase();
        
        return name.includes(searchTerm) ||
               category.includes(searchTerm) ||
               materials.includes(searchTerm) ||
               benefits.includes(searchTerm) ||
               description.includes(searchTerm);
    });
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #999;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.3;"></i>
                <p>"${searchTerm}"에 대한 검색 결과가 없습니다</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">다른 검색어를 시도해보세요</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = `
        <div style="margin-bottom: 15px; padding: 10px; background: #f8f8f8; border-radius: 8px;">
            <strong style="color: #2c5f4f;">${results.length}개</strong>의 제품을 찾았습니다
        </div>
        ${results.map(product => `
            <div class="search-result-item" onclick="openProductFromSearch('${product.id}')" style="display: flex; gap: 15px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 10px; cursor: pointer; transition: all 0.3s;">
                <img src="${product.image_url}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 5px;">
                        <div>
                            <span style="display: inline-block; padding: 3px 8px; background: #2c5f4f; color: white; border-radius: 4px; font-size: 0.75rem; margin-bottom: 5px;">${product.category}</span>
                            <h4 style="margin: 0; font-size: 1rem;">${product.name}</h4>
                        </div>
                        <div style="text-align: right;">
                            <div style="color: #d4af37; font-weight: 700; font-size: 1.1rem;">${formatPrice(product.price)}원</div>
                        </div>
                    </div>
                    <p style="margin: 5px 0 0; font-size: 0.85rem; color: #666; line-height: 1.4;">
                        <i class="fas fa-gem" style="color: #2c5f4f;"></i> ${product.materials}
                    </p>
                </div>
            </div>
        `).join('')}
    `;
    
    // Add hover effect
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.background = '#f8f8f8';
            this.style.borderColor = '#2c5f4f';
        });
        item.addEventListener('mouseleave', function() {
            this.style.background = '';
            this.style.borderColor = '#e0e0e0';
        });
    });
}

function openProductFromSearch(productId) {
    closeSearchModal();
    setTimeout(() => {
        openProductModal(productId);
    }, 300);
}

// ===== Order Tracking Functions =====
function openOrderTracking(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('orderTrackingModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // 최근 주문 정보 자동 입력
    const lastOrderNumber = localStorage.getItem('lastOrderNumber');
    const lastOrderPhone = localStorage.getItem('lastOrderPhone');
    
    if (lastOrderNumber) {
        document.getElementById('trackingOrderNumber').value = lastOrderNumber;
        console.log('✅ 최근 주문번호 자동 입력:', lastOrderNumber);
    }
    if (lastOrderPhone) {
        document.getElementById('trackingPhone').value = lastOrderPhone;
        console.log('✅ 최근 휴대폰 번호 자동 입력:', lastOrderPhone);
    }
    
    // 자동 입력된 경우 안내 메시지
    if (lastOrderNumber && lastOrderPhone) {
        const resultsContainer = document.getElementById('trackingResults');
        resultsContainer.innerHTML = `
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3;">
                <i class="fas fa-info-circle" style="color: #1976d2;"></i>
                <span style="color: #1565c0; margin-left: 10px; font-weight: 500;">
                    최근 주문 정보가 자동으로 입력되었습니다.
                </span>
                <p style="margin: 10px 0 0; color: #1976d2; font-size: 0.9rem;">
                    "조회하기" 버튼을 클릭하시거나, 다른 주문을 조회하시려면 정보를 수정해주세요.
                </p>
            </div>
        `;
    }
}

// 주문 완료 후 바로 조회 페이지로
function viewMyOrder() {
    closeProductModal();
    setTimeout(() => {
        openOrderTracking();
        // 자동으로 조회 실행
        setTimeout(() => {
            trackOrder();
        }, 500);
    }, 300);
}

function closeOrderTracking() {
    const modal = document.getElementById('orderTrackingModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    document.getElementById('trackingOrderNumber').value = '';
    document.getElementById('trackingPhone').value = '';
    document.getElementById('trackingResults').innerHTML = '';
}

async function trackOrder() {
    const orderNumber = document.getElementById('trackingOrderNumber').value.trim();
    const phone = document.getElementById('trackingPhone').value.trim();
    const resultsContainer = document.getElementById('trackingResults');
    
    if (!orderNumber || !phone) {
        resultsContainer.innerHTML = `
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                <i class="fas fa-exclamation-triangle" style="color: #856404;"></i>
                <span style="color: #856404; margin-left: 10px;">주문번호와 휴대폰 번호를 모두 입력해주세요.</span>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #2c5f4f;"></i>
            <p style="margin-top: 10px; color: #666;">조회 중...</p>
        </div>
    `;
    
    try {
        // Fetch orders from API
        const response = await fetch('tables/orders?limit=1000');
        if (!response.ok) throw new Error('조회 실패');
        
        const result = await response.json();
        const orders = result.data || [];
        
        // Find matching order
        const order = orders.find(o => 
            o.order_number === orderNumber && 
            o.customer_phone.replace(/[^0-9]/g, '') === phone.replace(/[^0-9]/g, '')
        );
        
        if (!order) {
            resultsContainer.innerHTML = `
                <div style="background: #f8d7da; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545;">
                    <i class="fas fa-times-circle" style="color: #721c24;"></i>
                    <span style="color: #721c24; margin-left: 10px;">주문 정보를 찾을 수 없습니다.</span>
                    <p style="margin: 10px 0 0; color: #721c24; font-size: 0.9rem;">주문번호와 휴대폰 번호를 다시 확인해주세요.</p>
                </div>
            `;
            return;
        }
        
        // Parse products
        let products = [];
        try {
            if (typeof order.products === 'string') {
                products = JSON.parse(order.products);
            } else if (Array.isArray(order.products)) {
                products = order.products;
            }
        } catch (e) {
            products = [];
        }
        
        const orderDate = new Date(order.order_date || order.created_at);
        
        // Status color mapping
        const statusColors = {
            '접수': '#3498db',
            '확인중': '#f39c12',
            '배송준비': '#9b59b6',
            '배송중': '#1abc9c',
            '배송완료': '#27ae60',
            '취소': '#e74c3c'
        };
        
        resultsContainer.innerHTML = `
            <div style="background: #d4edda; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; margin-bottom: 20px;">
                <i class="fas fa-check-circle" style="color: #155724;"></i>
                <span style="color: #155724; margin-left: 10px; font-weight: 600;">주문을 찾았습니다!</span>
            </div>
            
            <div style="background: #f8f8f8; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="margin: 0 0 15px; padding-bottom: 10px; border-bottom: 2px solid #2c5f4f;">
                    <i class="fas fa-info-circle"></i> 주문 정보
                </h3>
                <div style="display: grid; gap: 10px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #666;">주문번호</span>
                        <strong>${order.order_number}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #666;">주문일시</span>
                        <strong>${orderDate.toLocaleString('ko-KR')}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #666;">주문 상태</span>
                        <span style="display: inline-block; padding: 5px 15px; background: ${statusColors[order.status] || '#999'}; color: white; border-radius: 20px; font-weight: 600;">
                            ${order.status}
                        </span>
                    </div>
                </div>
            </div>
            
            <div style="background: #f8f8f8; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="margin: 0 0 15px; padding-bottom: 10px; border-bottom: 2px solid #2c5f4f;">
                    <i class="fas fa-shopping-cart"></i> 주문 상품
                </h3>
                ${products.length > 0 ? products.map(p => `
                    <div style="display: flex; justify-content: space-between; padding: 10px; background: white; border-radius: 8px; margin-bottom: 10px;">
                        <div>
                            <strong>${p.name}</strong>
                            <div style="color: #666; font-size: 0.9rem;">수량: ${p.quantity}개</div>
                        </div>
                        <div style="font-weight: 600; color: #2c5f4f;">
                            ${formatPrice((p.price || 0) * (p.quantity || 1))}원
                        </div>
                    </div>
                `).join('') : '<p style="color: #999;">제품 정보가 없습니다.</p>'}
                <div style="text-align: right; padding-top: 10px; border-top: 2px solid #ddd; margin-top: 10px;">
                    <span style="color: #666; margin-right: 10px;">총 주문금액</span>
                    <strong style="font-size: 1.3rem; color: #d4af37;">${formatPrice(order.total_amount)}원</strong>
                </div>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px;">
                <p style="margin: 0; color: #856404; font-size: 0.9rem; line-height: 1.6;">
                    <i class="fas fa-info-circle"></i> 
                    배송 관련 문의: <strong>0502-1909-7788</strong><br>
                    <i class="fas fa-envelope"></i> 
                    이메일: <strong>simsukbiz@gmail.com</strong>
                </p>
            </div>
        `;
        
    } catch (error) {
        console.error('Order tracking error:', error);
        showNotification('주문 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요');
        resultsContainer.innerHTML = `
            <div style="background: #f8d7da; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545; text-align: center;">
                <i class="fas fa-exclamation-circle" style="color: #721c24; font-size: 2rem;"></i>
                <h3 style="color: #721c24; margin: 15px 0 10px;">조회 오류</h3>
                <p style="margin: 0; color: #721c24;">주문 조회 중 오류가 발생했습니다.</p>
                <p style="margin: 10px 0 0; color: #721c24; font-size: 0.9rem;">잠시 후 다시 시도해주세요.</p>
                <button class="btn btn-primary" onclick="closeOrderTracking()" style="margin-top: 20px;">닫기</button>
            </div>
        `;
    }
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Header Scroll Effect =====
function initHeaderScroll() {
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
        
        lastScroll = currentScroll;
    });
}

// ===== Animation Keyframes =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
