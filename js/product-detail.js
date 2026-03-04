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
    
    // URL에서 제품 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        loadProduct(productId);
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
function loadProduct(productId) {
    // localStorage에서 제품 정보 가져오기
    const savedProducts = localStorage.getItem('adminProducts') || localStorage.getItem('products');
    
    if (savedProducts) {
        const products = JSON.parse(savedProducts);
        const product = products.find(p => String(p.id) === String(productId));
        
        if (product) {
            currentProduct = product;
            displayProduct(product);
            return;
        }
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
    
    // 제품 이미지 (여러 장 시뮬레이션)
    productImages = [
        product.image_url,
        product.image_url, // 실제로는 다른 각도 이미지
        product.image_url,
        product.image_url
    ];
    
    // 메인 이미지
    document.getElementById('mainImage').src = product.image_url;
    
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
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productMaterials').textContent = product.materials;
    document.getElementById('productBenefits').textContent = product.benefits;
    
    if (product.special_occasions && product.special_occasions.length > 0) {
        document.getElementById('productOccasions').textContent = product.special_occasions.join(', ');
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
