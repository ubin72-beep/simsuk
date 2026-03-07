// ================================================
// 심석 (SIMSUK) - 제품 상세 페이지 JavaScript
// ================================================

// Global Variables
let currentProduct = null;
let selectedSize = '16cm';
let quantity = 1;
let cart = [];
let currentImageIndex = 0;
let productImages = [];

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Product Detail Page Loaded');
    
    // URL에서 제품 ID와 미리보기 모드 확인
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const isPreview = urlParams.get('preview') === 'true';
    
    if (productId) {
        loadProduct(productId, isPreview);
    } else {
        // ID 없으면 기본 제품 표시
        loadDefaultProduct();
    }
    
    // 장바구니 로드
    loadCart();
    updateCartBadge();
    
    // 사이즈 선택 이벤트
    initSizeSelector();
});

// ===== Load Product =====
function loadProduct(productId, isPreview = false) {
    let product = null;
    
    // 미리보기 모드
    if (isPreview && String(productId).startsWith('preview_')) {
        const previewProduct = localStorage.getItem('previewProduct');
        if (previewProduct) {
            product = JSON.parse(previewProduct);
            console.log('📋 Preview mode:', product);
        }
    }
    
    // 일반 모드: localStorage에서 제품 정보 가져오기
    if (!product) {
        const savedProducts = localStorage.getItem('adminProducts') || localStorage.getItem('products');
        
        if (savedProducts) {
            const products = JSON.parse(savedProducts);
            product = products.find(p => String(p.id) === String(productId));
        }
    }
    
    if (product) {
        currentProduct = product;
        displayProduct(product);
        
        // 미리보기 모드면 알림 표시
        if (isPreview) {
            showNotification('⚠️ 미리보기 모드입니다. 실제로 저장되지 않았습니다.');
        }
        return;
    }
    
    // 제품을 찾지 못하면 기본 제품 표시
    loadDefaultProduct();
}

function loadDefaultProduct() {
    // 기본 제품 데이터
    currentProduct = {
        id: 1,
        name: '적철석 헤마타이트 패션팔찌',
        category: '팔찌',
        price: 29000,
        description: '6mm 사이즈의 천연 헤마타이트를 정성스럽게 엮어 만든 패션 팔찌입니다. 자기장의 힘으로 혈액순환을 촉진하고, 스트레스를 완화시켜줍니다.',
        materials: '천연 헤마타이트, 탄성 줄',
        benefits: '혈액순환 개선, 스트레스 완화, 집중력 향상, 부정적 에너지 차단',
        image_url: 'https://placehold.co/600x600/2c5f4f/ffffff?text=Hematite+Bracelet',
        featured: true,
        in_stock: true,
        birthstone_months: [1, 10],
        special_occasions: ['일상', '선물', '건강']
    };
    
    displayProduct(currentProduct);
}

function displayProduct(product) {
    console.log('📦 Displaying product:', product);
    
    // 제품 이미지 처리 (배열 또는 단일 이미지)
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        // 새로운 배열 형식
        productImages = product.images;
    } else if (product.image_url) {
        // 기존 단일 이미지 형식 (하위 호환성)
        productImages = [product.image_url, product.image_url, product.image_url, product.image_url];
    } else {
        // 기본 이미지
        productImages = [
            'https://placehold.co/600x600/2c5f4f/ffffff?text=Product+Image',
            'https://placehold.co/600x600/2c5f4f/ffffff?text=Product+Image',
            'https://placehold.co/600x600/2c5f4f/ffffff?text=Product+Image',
            'https://placehold.co/600x600/2c5f4f/ffffff?text=Product+Image'
        ];
    }
    
    // 메인 이미지
    document.getElementById('mainImage').src = productImages[0];
    
    // 썸네일 갤러리
    const gallery = document.getElementById('thumbnailGallery');
    gallery.innerHTML = productImages.map((img, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="selectImage(${index})">
            <img src="${img}" alt="제품 이미지 ${index + 1}">
        </div>
    `).join('');
    
    // Breadcrumb
    document.getElementById('breadcrumbProduct').textContent = product.name;
    
    // 제품 정보
    document.getElementById('productCategory').textContent = product.category;
    document.getElementById('productTitle').textContent = product.name;
    
    // 가격
    updatePriceDisplay(product.price);
    
    // 상세 정보
    document.getElementById('productDescription').textContent = product.description || '천연 원석을 사용한 고품질 제품입니다.';
    document.getElementById('productMaterials').textContent = product.materials || '천연 원석';
    document.getElementById('productBenefits').textContent = product.benefits || '건강 증진';
    
    if (product.special_occasions && product.special_occasions.length > 0) {
        document.getElementById('productOccasions').textContent = product.special_occasions.join(', ');
    } else if (product.special_day && product.special_day.length > 0) {
        document.getElementById('productOccasions').textContent = product.special_day.join(', ');
    }
    
    // 네이버/쿠팡 구매 버튼 표시
    const naverBtn = document.getElementById('naverBuyBtn');
    const coupangBtn = document.getElementById('coupangBuyBtn');
    const noLinkNotice = document.getElementById('noLinkNotice');
    
    if (product.naver_link) {
        naverBtn.href = product.naver_link;
        naverBtn.style.display = 'flex';
    } else {
        naverBtn.style.display = 'none';
    }
    
    if (product.coupang_link) {
        coupangBtn.href = product.coupang_link;
        coupangBtn.style.display = 'flex';
    } else {
        coupangBtn.style.display = 'none';
    }
    
    // 둘 다 없으면 안내 메시지 표시
    if (!product.naver_link && !product.coupang_link) {
        noLinkNotice.style.display = 'block';
    } else {
        noLinkNotice.style.display = 'none';
    }
    
    // 사이즈별 재고 표시 (선택 사항)
    if (product.size_stock) {
        console.log('📊 사이즈별 재고:', product.size_stock);
        
        // 재고가 없는 사이즈 버튼 비활성화
        document.querySelectorAll('.size-btn').forEach(btn => {
            const size = btn.dataset.size + 'cm';
            const stock = product.size_stock[size] || 0;
            
            if (stock === 0) {
                btn.disabled = true;
                btn.style.opacity = '0.3';
                btn.style.cursor = 'not-allowed';
                btn.innerHTML = btn.innerHTML + '<br><small>(품절)</small>';
            }
        });
    }
}

// ===== Image Gallery =====
function selectImage(index) {
    currentImageIndex = index;
    document.getElementById('mainImage').src = productImages[index];
    
    // 썸네일 active 상태 변경
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = productImages.length - 1;
    } else if (currentImageIndex >= productImages.length) {
        currentImageIndex = 0;
    }
    
    selectImage(currentImageIndex);
}

// ===== Size Selector =====
function initSizeSelector() {
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 모든 버튼에서 active 제거
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            
            // 클릭한 버튼에 active 추가
            this.classList.add('active');
            
            // 선택된 사이즈 저장
            selectedSize = this.dataset.size + 'cm';
            console.log('📏 Selected size:', selectedSize);
        });
    });
}

// ===== Quantity Control =====
function changeQuantity(change) {
    quantity = Math.max(1, Math.min(10, quantity + change));
    document.getElementById('quantity').value = quantity;
    updateTotalPrice();
}

function updateTotalPrice() {
    if (!currentProduct) return;
    
    const total = currentProduct.price * quantity;
    document.getElementById('totalPrice').textContent = formatPrice(total) + '원';
}

function updatePriceDisplay(price) {
    document.getElementById('priceDisplay').innerHTML = `
        <span class="price-current">${formatPrice(price)}원</span>
    `;
    updateTotalPrice();
}

// ===== Add to Cart =====
function addToCartFromDetail() {
    if (!currentProduct) return;
    
    // 장바구니 아이템 생성
    const cartItem = {
        id: currentProduct.id,
        name: currentProduct.name,
        category: currentProduct.category,
        price: currentProduct.price,
        image_url: currentProduct.image_url,
        size: selectedSize,
        quantity: quantity
    };
    
    // 기존 장바구니에서 같은 제품/사이즈 찾기
    const existingIndex = cart.findIndex(item => 
        item.id === cartItem.id && item.size === cartItem.size
    );
    
    if (existingIndex > -1) {
        // 기존 항목 수량 증가
        cart[existingIndex].quantity += quantity;
    } else {
        // 새 항목 추가
        cart.push(cartItem);
    }
    
    // localStorage에 저장
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // UI 업데이트
    updateCartBadge();
    
    // 알림
    showNotification(`${cartItem.name} (${cartItem.size})을(를) 장바구니에 담았습니다.`);
    
    console.log('🛒 Added to cart:', cartItem);
    console.log('📦 Current cart:', cart);
}

// ===== Buy Now =====
function buyNow() {
    if (!currentProduct) return;
    
    // 장바구니에 추가
    addToCartFromDetail();
    
    // 로그인/비회원 선택 모달 열기
    document.getElementById('loginModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== Login Modal =====
function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
    document.body.style.overflow = '';
}

function loginWithKakao() {
    alert('카카오톡 로그인 기능은 준비 중입니다.\n현재는 비회원 주문을 이용해주세요.');
    // TODO: 카카오 로그인 API 연동
}

function guestCheckout() {
    closeLoginModal();
    
    // 장바구니 페이지로 이동 (주문서 작성)
    window.location.href = 'index.html#checkout';
    
    // 또는 직접 주문 폼 열기
    setTimeout(() => {
        if (typeof showOrderContactForm === 'function') {
            showOrderContactForm();
        }
    }, 500);
}

// ===== Size Guide =====
function showSizeGuide() {
    document.getElementById('sizeGuideModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSizeGuide() {
    document.getElementById('sizeGuideModal').classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Tabs =====
function switchTab(tabName) {
    // 모든 탭 버튼 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 모든 탭 내용 숨기기
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // 선택한 탭 활성화
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// ===== Cart Functions =====
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartBadge').textContent = totalItems;
}

function showCart() {
    // 메인 페이지의 장바구니 함수 호출
    if (typeof window.showCart === 'function') {
        window.showCart();
    } else {
        // 메인 페이지로 이동
        window.location.href = 'index.html#cart';
    }
}

// ===== Utility Functions =====
function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR').format(price);
}

function showNotification(message) {
    // 알림 요소 생성
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 15px;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 1.5rem;"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // 3초 후 제거
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// CSS 애니메이션
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 전역 함수로 노출
window.selectImage = selectImage;
window.changeImage = changeImage;
window.changeQuantity = changeQuantity;
window.addToCartFromDetail = addToCartFromDetail;
window.buyNow = buyNow;
window.loginWithKakao = loginWithKakao;
window.guestCheckout = guestCheckout;
window.showSizeGuide = showSizeGuide;
window.closeSizeGuide = closeSizeGuide;
window.closeLoginModal = closeLoginModal;
window.switchTab = switchTab;
window.showCart = showCart;

console.log('✅ Product Detail JS Loaded');
