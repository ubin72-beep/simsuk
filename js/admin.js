// 전역 변수 (변수명 충돌 방지를 위해 admin 접두사 사용)
const ADMIN_PASSWORD = 'admin';  // 간단한 비밀번호로 변경
let adminProducts = [];  // main.js의 allProducts와 충돌 방지
let adminOrders = [];    // 주문 데이터
let currentEditId = null;
let filteredProducts = [];  // 검색/필터링된 제품
let filteredOrders = [];    // 검색/필터링된 주문

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});

// 인증 확인
function checkAuthentication() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    
    if (isLoggedIn === 'true') {
        showAdminPage();
    } else {
        showLoginForm();
    }
}

// 로그인 폼 표시
function showLoginForm() {
    document.body.innerHTML = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 50px rgba(0,0,0,0.3); max-width: 400px; width: 90%;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <i class="fas fa-gem" style="font-size: 3rem; color: #d4af37; margin-bottom: 15px;"></i>
                    <h1 style="color: #2c5f4f; margin-bottom: 10px;">심석(心石)</h1>
                    <h2 style="color: #666; font-size: 1.2rem; font-weight: 400;">관리자 로그인</h2>
                </div>
                
                <form id="loginForm" style="display: flex; flex-direction: column; gap: 20px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                            <i class="fas fa-lock"></i> 비밀번호
                        </label>
                        <input 
                            type="password" 
                            id="adminPassword" 
                            required 
                            autofocus
                            placeholder="비밀번호를 입력하세요"
                            style="width: 100%; padding: 12px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;"
                            onkeypress="if(event.key==='Enter') handleLogin();"
                        >
                        <div style="margin-top: 8px; padding: 8px 12px; background: #e3f2fd; border-radius: 6px; font-size: 0.85rem; color: #1565c0;">
                            <i class="fas fa-info-circle"></i> 기본 비밀번호: <strong>admin</strong>
                        </div>
                    </div>
                    
                    <button 
                        type="button"
                        onclick="handleLogin()"
                        style="width: 100%; padding: 15px; background: linear-gradient(135deg, #2c5f4f 0%, #1a4034 100%); color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer;"
                    >
                        <i class="fas fa-sign-in-alt"></i> 로그인
                    </button>
                    
                    <div id="errorMessage" style="display: none; padding: 12px; background: #ffebee; color: #c62828; border-radius: 8px; text-align: center;">
                        <i class="fas fa-exclamation-circle"></i> 비밀번호가 올바르지 않습니다
                    </div>
                </form>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
                    <a href="index.html" style="color: #666; text-decoration: none;">
                        <i class="fas fa-home"></i> 메인 페이지로 돌아가기
                    </a>
                </div>
            </div>
        </div>
    `;
}

// 로그인 처리
function handleLogin() {
    const password = document.getElementById('adminPassword').value;
    const errorMsg = document.getElementById('errorMessage');
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        location.reload();
    } else {
        errorMsg.style.display = 'block';
    }
}

// 관리자 페이지 표시
function showAdminPage() {
    // 다른 스크립트 로드를 기다림
    setTimeout(() => {
        loadProducts();
        loadOrders();
        
        // 대시보드 로드 (초기 화면)
        if (typeof loadDashboard === 'function') {
            loadDashboard();
        } else {
            console.warn('⚠️ [Admin] loadDashboard 함수가 아직 로드되지 않음');
            // 500ms 후 재시도
            setTimeout(() => {
                if (typeof loadDashboard === 'function') {
                    loadDashboard();
                } else {
                    console.error('❌ [Admin] loadDashboard 함수를 로드할 수 없음');
                }
            }, 500);
        }
        
        // 알림 권한 요청
        requestNotificationPermission();
        
        // 자동 새로고침 초기화
        initializeAutoRefresh();
    }, 100); // 100ms 대기
}

// 로그아웃
function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        sessionStorage.removeItem('adminLoggedIn');
        location.reload();
    }
}

// 탭 전환
function switchTab(tabName, event) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    if (event && event.target) {
        event.target.closest('.tab-btn').classList.add('active');
    } else {
        // 이벤트가 없는 경우 첫 번째 탭 활성화
        document.querySelector('.tab-btn').classList.add('active');
    }
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    if (tabName === 'dashboard') {
        if (typeof loadDashboard === 'function') {
            loadDashboard();
        } else {
            console.warn('⚠️ [Admin] loadDashboard 함수가 아직 로드되지 않음');
        }
    } else if (tabName === 'products') {
        loadProducts();
    } else if (tabName === 'orders') {
        loadOrders();
    } else if (tabName === 'discounts') {
        if (typeof loadDiscounts === 'function') {
            loadDiscounts();
        } else {
            console.warn('⚠️ [Admin] loadDiscounts 함수가 아직 로드되지 않음');
        }
    }
}

// 제품 로드 (GitHub Pages - 데모 데이터 사용)
async function loadProducts() {
    console.log('📦 [Admin] 제품 로딩 시작...');
    
    // localStorage에서 제품 불러오기
    const savedProducts = localStorage.getItem('adminProducts');
    
    if (savedProducts) {
        try {
            adminProducts = JSON.parse(savedProducts);
            console.log(`✅ [Admin] localStorage에서 제품 ${adminProducts.length}개 로드`);
        } catch (e) {
            console.warn('⚠️ [Admin] localStorage 파싱 오류:', e);
            adminProducts = getDefaultProducts();
            localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
        }
    } else {
        // localStorage에 제품이 없으면 기본 데이터 사용
        console.log('⚠️ [Admin] localStorage에 제품 없음 - 기본 데이터 사용');
        adminProducts = getDefaultProducts();
        // localStorage에 저장
        localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
        console.log('💾 [Admin] 기본 제품을 localStorage에 저장');
    }
    
    filteredProducts = adminProducts;  // 초기화
    console.log(`✅ [Admin] 제품 ${adminProducts.length}개 로드 완료`);
    
    updateStats();
    filterProducts(); // 필터 적용하여 렌더링
}

// 기본 제품 데이터 반환
function getDefaultProducts() {
    return [
        {
            id: '1',
            name: '헤마타이트 목걸이',
            category: '목걸이',
            price: 69000,
            stock: 15,
            description: '대지의 에너지를 담은 헤마타이트 목걸이',
            image_url: 'https://via.placeholder.com/400x400/2c5f4f/ffffff?text=Hematite+Necklace',
            birthstone_months: [1, 2, 3],
            special_occasions: ['생일', '기념일'],
            is_featured: true,
            created_at: Date.now() - 86400000 * 10
        },
        {
            id: '2',
            name: '헤마타이트 팔찌',
            category: '팔찌',
            price: 49000,
            stock: 20,
            description: '그라운딩 효과가 뛰어난 헤마타이트 팔찌',
            image_url: 'https://via.placeholder.com/400x400/2c5f4f/ffffff?text=Hematite+Bracelet',
            birthstone_months: [4, 5, 6],
            special_occasions: ['생일'],
            is_featured: true,
            created_at: Date.now() - 86400000 * 9
        },
        {
            id: '3',
            name: '헤마타이트 반지',
            category: '반지',
            price: 39000,
            stock: 25,
            description: '일상에서 착용 가능한 헤마타이트 반지',
            image_url: 'https://via.placeholder.com/400x400/2c5f4f/ffffff?text=Hematite+Ring',
            birthstone_months: [7, 8, 9],
            special_occasions: ['기념일'],
            is_featured: true,
            created_at: Date.now() - 86400000 * 8
        },
        {
            id: '4',
            name: '가넷 목걸이 (1월)',
            category: '목걸이',
            price: 79000,
            stock: 10,
            description: '1월의 탄생석 가넷 목걸이',
            image_url: 'https://via.placeholder.com/400x400/c41e3a/ffffff?text=Garnet+Necklace',
            birthstone_months: [1],
            special_occasions: ['생일', '기념일', '졸업'],
            is_featured: false,
            created_at: Date.now() - 86400000 * 7
        },
        {
            id: '5',
            name: '자수정 팔찌 (2월)',
            category: '팔찌',
            price: 59000,
            stock: 12,
            description: '2월의 탄생석 자수정 팔찌',
            image_url: 'https://via.placeholder.com/400x400/9966cc/ffffff?text=Amethyst+Bracelet',
            birthstone_months: [2],
            special_occasions: ['생일'],
            is_featured: false,
            created_at: Date.now() - 86400000 * 6
        },
        {
            id: '6',
            name: '아쿠아마린 반지 (3월)',
            category: '반지',
            price: 89000,
            stock: 8,
            description: '3월의 탄생석 아쿠아마린 반지',
            image_url: 'https://via.placeholder.com/400x400/7fffd4/333333?text=Aquamarine+Ring',
            birthstone_months: [3],
            special_occasions: ['기념일', '졸업'],
            is_featured: false,
            created_at: Date.now() - 86400000 * 5
        }
    ];
}

// 제품 필터링
function filterProducts() {
    const categoryFilter = document.getElementById('productCategoryFilter')?.value || 'all';
    const birthstoneFilter = document.getElementById('productBirthstoneFilter')?.value || 'all';
    const occasionFilter = document.getElementById('productOccasionFilter')?.value || 'all';
    
    let filtered = adminProducts;
    
    // 카테고리 필터
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    // 탄생석 필터
    if (birthstoneFilter === 'none') {
        // 탄생석 미지정
        filtered = filtered.filter(p => !p.birthstone_months || p.birthstone_months.length === 0);
    } else if (birthstoneFilter !== 'all') {
        // 특정 월 필터
        const month = parseInt(birthstoneFilter);
        filtered = filtered.filter(p => 
            p.birthstone_months && 
            Array.isArray(p.birthstone_months) && 
            p.birthstone_months.includes(month)
        );
    }
    
    // 특별한 날 필터
    if (occasionFilter === 'none') {
        // 특별한 날 미지정
        filtered = filtered.filter(p => !p.special_occasions || p.special_occasions.length === 0);
    } else if (occasionFilter !== 'all') {
        // 특정 기념일 필터
        filtered = filtered.filter(p => 
            p.special_occasions && 
            Array.isArray(p.special_occasions) && 
            p.special_occasions.includes(occasionFilter)
        );
    }
    
    filteredProducts = filtered;
    
    // searchProducts 함수가 로드되었는지 확인
    if (typeof searchProducts === 'function') {
        searchProducts(); // 검색 적용
    } else {
        console.warn('⚠️ [Admin] searchProducts 함수가 아직 로드되지 않음');
        // 직접 렌더링
        if (typeof renderProductsTable === 'function') {
            renderProductsTable(filteredProducts);
        }
    }
}

// 통계 업데이트
function updateStats() {
    const total = adminProducts.length;
    const necklaces = adminProducts.filter(p => p.category === '목걸이').length;
    const bracelets = adminProducts.filter(p => p.category === '팔찌').length;
    const rings = adminProducts.filter(p => p.category === '반지').length;
    const phoneStraps = adminProducts.filter(p => p.category === '핸드폰 줄').length;
    
    document.getElementById('totalProducts').textContent = total;
    document.getElementById('necklaceCount').textContent = necklaces;
    document.getElementById('braceletCount').textContent = bracelets;
    document.getElementById('ringCount').textContent = rings;
    document.getElementById('phoneStrapCount').textContent = phoneStraps;
    
    // 탭 배지 업데이트
    updateTabBadges();
    
    updateOrderStats();
}

// 주문 통계 업데이트 (GitHub Pages - 데모 데이터)
async function updateOrderStats() {
    console.log('📊 [Admin] 주문 통계 업데이트...');
    
    // GitHub Pages에서는 API가 없으므로 데모 데이터 사용
    adminOrders = [
        {
            id: 'ord1',
            order_number: 'ORD-20260225-0001',
            customer_name: '홍길동',
            customer_phone: '010-1234-5678',
            status: '접수',
            total_amount: 69000,
            created_at: Date.now() - 86400000 * 1
        },
        {
            id: 'ord2',
            order_number: 'ORD-20260224-0002',
            customer_name: '김영희',
            customer_phone: '010-9876-5432',
            status: '배송중',
            total_amount: 118000,
            created_at: Date.now() - 86400000 * 2
        },
        {
            id: 'ord3',
            order_number: 'ORD-20260223-0003',
            customer_name: '이철수',
            customer_phone: '010-5555-6666',
            status: '배송완료',
            total_amount: 49000,
            created_at: Date.now() - 86400000 * 5
        }
    ];
    
    const totalOrders = adminOrders.length;
    const pendingOrders = adminOrders.filter(o => o.status === '접수' || o.status === '확인중').length;
            
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    
    console.log(`✅ [Admin] 주문 통계: 전체 ${totalOrders}개, 대기 ${pendingOrders}개 (데모 데이터)`);
    
    // 탭 배지 업데이트
    updateTabBadges();
}

// 탭 배지 업데이트
function updateTabBadges() {
    // 제품 배지
    const productsBadge = document.getElementById('productsTabBadge');
    if (productsBadge && adminProducts.length > 0) {
        productsBadge.textContent = adminProducts.length;
        productsBadge.style.display = 'block';
    }
    
    // 주문 배지 (대기중인 주문)
    const ordersBadge = document.getElementById('ordersTabBadge');
    const pendingCount = parseInt(document.getElementById('pendingOrders')?.textContent || '0');
    if (ordersBadge && pendingCount > 0) {
        ordersBadge.textContent = pendingCount;
        ordersBadge.style.display = 'block';
    }
}

// 제품 테이블 렌더링
function renderProductsTable(products) {
    const container = document.getElementById('productsTableContainer');
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>등록된 제품이 없습니다</h3>
                <p style="color: #999; margin-top: 10px;">새 제품 추가 버튼을 클릭하여 제품을 등록하세요</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 80px;">이미지</th>
                    <th>제품명</th>
                    <th style="width: 100px;">카테고리</th>
                    <th style="width: 150px;">탄생석</th>
                    <th style="width: 150px;">특별한 날</th>
                    <th style="width: 120px;">가격</th>
                    <th style="width: 80px;">재고</th>
                    <th style="width: 100px;">액션</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>
                            <img src="${product.image_url}" 
                                 style="width:50px;height:50px;object-fit:cover;border-radius:8px;display:block;">
                        </td>
                        <td>
                            <strong>${product.name}</strong>
                            ${product.featured ? '<span style="color:#d4af37;margin-left:8px;"><i class="fas fa-star"></i></span>' : ''}
                        </td>
                        <td><span class="category-badge">${product.category}</span></td>
                        <td>${formatBirthstones(product.birthstone_months)}</td>
                        <td>${formatSpecialOccasions(product.special_occasions)}</td>
                        <td><strong style="color:#2c5f4f;">${formatPrice(product.price)}원</strong></td>
                        <td>${product.in_stock ? '<span style="color:#4caf50;font-weight:600;">✓ 재고있음</span>' : '<span style="color:#f44336;font-weight:600;">✗ 품절</span>'}</td>
                        <td>
                            <button class="btn-icon" onclick="editProduct('${product.id}')" title="수정">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon" onclick="copyProduct('${product.id}')" title="복사" style="color:#667eea;">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="btn-icon" onclick="deleteProduct('${product.id}')" title="삭제" style="color:#e74c3c;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// 탄생석 월 포맷팅
function formatBirthstones(months) {
    if (!months || !Array.isArray(months) || months.length === 0) {
        return '<span style="color:#999">-</span>';
    }
    
    const monthNames = {
        1: '1월', 2: '2월', 3: '3월', 4: '4월',
        5: '5월', 6: '6월', 7: '7월', 8: '8월',
        9: '9월', 10: '10월', 11: '11월', 12: '12월'
    };
    
    if (months.length === 12) {
        return '<span style="color:#667eea;font-weight:600">💎 전체</span>';
    }
    
    const sorted = [...months].sort((a, b) => a - b);
    const monthLabels = sorted.slice(0, 3).map(m => monthNames[m]).join(', ');
    const extra = months.length > 3 ? ` <span style="color:#999">외 ${months.length - 3}개</span>` : '';
    
    return `<span style="color:#667eea">💎 ${monthLabels}${extra}</span>`;
}

// 특별한 날 포맷팅
function formatSpecialOccasions(occasions) {
    if (!occasions || !Array.isArray(occasions) || occasions.length === 0) {
        return '<span style="color:#999">-</span>';
    }
    
    const occasionNames = {
        valentine: '💕 발렌타인',
        whiteday: '🤍 화이트데이',
        parents: '🌹 어버이날',
        birthday: '🎂 생일',
        anniversary: '💍 결혼기념일',
        graduation: '🎓 졸업',
        christmas: '🎄 크리스마스'
    };
    
    if (occasions.length === 7) {
        return '<span style="color:#d4af37;font-weight:600">🎁 전체</span>';
    }
    
    const labels = occasions.slice(0, 2).map(o => occasionNames[o] || o).join(', ');
    const extra = occasions.length > 2 ? ` <span style="color:#999">외 ${occasions.length - 2}개</span>` : '';
    
    return `<span style="color:#d4af37">${labels}${extra}</span>`;
}

// 가격 포맷
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 제품 추가 모달
function showAddProductModal() {
    currentEditId = null;
    document.getElementById('productModalTitle').textContent = '새 제품 추가';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    
    // 탄생석 체크박스 초기화
    document.querySelectorAll('.birthstone-checkbox').forEach(cb => {
        cb.checked = false;
    });
    
    // 특별한 날 체크박스 초기화
    document.querySelectorAll('.occasion-checkbox').forEach(cb => {
        cb.checked = false;
    });
    
    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 제품 수정
function editProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;
    
    currentEditId = productId;
    document.getElementById('productModalTitle').textContent = '제품 수정';
    document.getElementById('productId').value = productId;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productImageUrl').value = product.image_url;
    document.getElementById('productMaterials').value = product.materials;
    document.getElementById('productBenefits').value = product.benefits;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productFeatured').checked = product.featured;
    document.getElementById('productInStock').checked = product.in_stock;
    
    // 탄생석 체크박스 설정
    document.querySelectorAll('.birthstone-checkbox').forEach(cb => {
        cb.checked = false;
    });
    if (product.birthstone_months && Array.isArray(product.birthstone_months)) {
        product.birthstone_months.forEach(month => {
            const checkbox = document.querySelector(`.birthstone-checkbox[value="${month}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    // 특별한 날 체크박스 설정
    document.querySelectorAll('.occasion-checkbox').forEach(cb => {
        cb.checked = false;
    });
    if (product.special_occasions && Array.isArray(product.special_occasions)) {
        product.special_occasions.forEach(occasion => {
            const checkbox = document.querySelector(`.occasion-checkbox[value="${occasion}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    if (product.image_url) {
        document.getElementById('previewImg').src = product.image_url;
        document.getElementById('imagePreview').style.display = 'block';
    }
    
    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// URL에서 이미지 미리보기
function previewImageFromUrl() {
    const url = document.getElementById('productImageUrl').value.trim();
    const previewImg = document.getElementById('previewImg');
    const imagePreview = document.getElementById('imagePreview');
    
    if (!url) {
        imagePreview.style.display = 'none';
        return;
    }
    
    // URL 유효성 간단 체크
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        imagePreview.style.display = 'none';
        return;
    }
    
    // 이미지 로드 테스트
    const img = new Image();
    img.onload = function() {
        previewImg.src = url;
        imagePreview.style.display = 'block';
    };
    img.onerror = function() {
        imagePreview.style.display = 'none';
    };
    img.src = url;
}

// 이미지 미리보기 (기존 함수 - 사용 안 함)
function previewImage() {
    console.warn('⚠️ previewImage() 함수는 더 이상 사용되지 않습니다. URL 입력을 사용하세요.');
// 이미지 미리보기 (기존 함수 - 사용 안 함)
function previewImage() {
    console.warn('⚠️ previewImage() 함수는 더 이상 사용되지 않습니다. URL 입력을 사용하세요.');
}

// 이미지 삭제 (기존 함수 - 사용 안 함)
function clearImage() {
    console.warn('⚠️ clearImage() 함수는 더 이상 사용되지 않습니다.');
}

// 제품 저장 (GitHub Pages - 로컬 배열 업데이트)
async function handleProductSubmit(e) {
    e.preventDefault();
    
    console.log('💾 [Admin] 제품 저장 시작...');
    
    // 탄생석 월 수집
    const birthstoneMonths = [];
    document.querySelectorAll('.birthstone-checkbox:checked').forEach(cb => {
        birthstoneMonths.push(parseInt(cb.value));
    });
    
    // 특별한 날 수집
    const specialOccasions = [];
    document.querySelectorAll('.occasion-checkbox:checked').forEach(cb => {
        specialOccasions.push(cb.value);
    });
    
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        image_url: document.getElementById('productImageUrl').value,
        materials: document.getElementById('productMaterials').value,
        benefits: document.getElementById('productBenefits').value,
        description: document.getElementById('productDescription').value,
        featured: document.getElementById('productFeatured').checked,
        in_stock: document.getElementById('productInStock').checked,
        birthstone_months: birthstoneMonths,
        special_occasions: specialOccasions
    };
    
    console.log('📝 [Admin] 제품 데이터:', productData);
    
    try {
        if (currentEditId) {
            // 수정: adminProducts 배열에서 해당 제품 찾아서 업데이트
            const index = adminProducts.findIndex(p => p.id === currentEditId);
            if (index !== -1) {
                adminProducts[index] = {
                    ...adminProducts[index],
                    ...productData,
                    updated_at: Date.now()
                };
                console.log(`✅ [Admin] 제품 수정 완료: ${productData.name}`);
                showToast('제품이 수정되었습니다. 메인 페이지에서 5초 이내에 자동으로 업데이트됩니다.', 'success');
            } else {
                throw new Error('제품을 찾을 수 없습니다');
            }
        } else {
            // 추가: adminProducts 배열에 새 제품 추가
            const newProduct = {
                id: 'product_' + Date.now(),
                ...productData,
                stock: 10,
                created_at: Date.now(),
                updated_at: Date.now()
            };
            adminProducts.push(newProduct);
            console.log(`✅ [Admin] 제품 추가 완료: ${productData.name}`);
            showToast('제품이 추가되었습니다. 메인 페이지에서 5초 이내에 자동으로 표시됩니다.', 'success');
        }
        
        // localStorage에 저장 (메인 페이지와 동기화)
        try {
            localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
            console.log('💾 [Admin] 제품 데이터를 localStorage에 저장 (메인 페이지와 동기화)');
        } catch (storageError) {
            if (storageError.name === 'QuotaExceededError') {
                console.error('❌ [Admin] localStorage 용량 초과!');
                showToast('❌ 저장 공간 부족: 이미지 URL을 사용해주세요 (base64 불가)', 'error');
                
                // 방금 추가한 제품 롤백
                if (!currentEditId) {
                    adminProducts.pop();
                }
                
                throw new Error('localStorage 용량 초과. 제품 이미지는 URL을 사용해주세요.');
            }
            throw storageError;
        }
        
        closeProductModal();
        
        // 제품 관리 탭으로 자동 전환 (새로 추가된 제품 확인 가능)
        if (!currentEditId) {
            switchTab('products');
            console.log('📍 [Admin] 제품 관리 탭으로 자동 이동 (새 제품 확인)');
        } else {
            loadProducts(); // 수정 시에는 현재 탭 유지
        }
        
        updateStats(); // 통계 업데이트
        
    } catch (error) {
        console.error('❌ [Admin] 제품 저장 오류:', error);
        showToast('제품 저장 중 오류가 발생했습니다: ' + error.message, 'error');
    }
}

// 제품 삭제 (GitHub Pages - 로컬 배열에서 삭제)
async function deleteProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) {
        showToast('제품을 찾을 수 없습니다', 'error');
        return;
    }
    
    if (!confirm(`"${product.name}"을(를) 정말 삭제하시겠습니까?`)) return;
    
    console.log(`🗑️ [Admin] 제품 삭제: ${product.name}`);
    
    try {
        // adminProducts 배열에서 제품 제거
        const index = adminProducts.findIndex(p => p.id === productId);
        if (index !== -1) {
            adminProducts.splice(index, 1);
            
            // localStorage에 저장 (메인 페이지와 동기화)
            try {
                localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
                console.log('💾 [Admin] 제품 삭제 후 localStorage 업데이트');
            } catch (storageError) {
                console.error('❌ [Admin] localStorage 저장 실패:', storageError);
                showToast('저장 중 오류가 발생했습니다', 'error');
            }
            
            console.log(`✅ [Admin] 제품 삭제 완료`);
            showToast('제품이 삭제되었습니다. 메인 페이지에서 5초 이내에 자동으로 반영됩니다.', 'success');
            loadProducts(); // 제품 목록 다시 렌더링
            updateStats(); // 통계 업데이트
        } else {
            throw new Error('제품을 찾을 수 없습니다');
        }
    } catch (error) {
        console.error('❌ [Admin] 삭제 오류:', error);
        showToast('제품 삭제 중 오류가 발생했습니다: ' + error.message, 'error');
    }
}

// 제품 복사 (GitHub Pages - 로컬 배열에 복사본 추가)
async function copyProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) {
        showToast('제품을 찾을 수 없습니다', 'error');
        return;
    }
    
    if (!confirm(`"${product.name}"을(를) 복사하시겠습니까?`)) return;
    
    console.log(`📋 [Admin] 제품 복사: ${product.name}`);
    
    try {
        // 새 제품 데이터 생성 (ID 제외, 복사본 표시)
        const newProduct = {
            id: 'product_copy_' + Date.now(),
            name: product.name + ' (복사본)',
            category: product.category,
            price: product.price,
            image_url: product.image_url,
            materials: product.materials,
            benefits: product.benefits,
            description: product.description,
            featured: false, // 복사본은 추천 해제
            in_stock: product.in_stock,
            stock: product.stock || 10,
            birthstone_months: product.birthstone_months || [],
            special_occasions: product.special_occasions || [],
            created_at: Date.now(),
            updated_at: Date.now()
        };
        
        adminProducts.push(newProduct);
        
        // localStorage에 저장 (메인 페이지와 동기화)
        try {
            localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
            console.log('💾 [Admin] 제품 복사 후 localStorage 업데이트');
        } catch (storageError) {
            if (storageError.name === 'QuotaExceededError') {
                console.error('❌ [Admin] localStorage 용량 초과!');
                adminProducts.pop(); // 롤백
                showToast('❌ 저장 공간 부족: 제품을 복사할 수 없습니다', 'error');
                throw new Error('localStorage 용량 초과');
            }
            throw storageError;
        }
        
        console.log(`✅ [Admin] 제품 복사 완료: ${newProduct.name}`);
        showToast('제품이 복사되었습니다. 메인 페이지에서 5초 이내에 자동으로 표시됩니다.', 'success');
        loadProducts(); // 제품 목록 다시 렌더링
        updateStats(); // 통계 업데이트
        
    } catch (error) {
        console.error('❌ [Admin] 복사 오류:', error);
        showToast('제품 복사 중 오류가 발생했습니다: ' + error.message, 'error');
    }
}

// 모달 닫기
function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = '';
    currentEditId = null;
}

// 주문 로드
// 주문 로드 (GitHub Pages - 데모 데이터)
async function loadOrders() {
    console.log('📦 [Admin] 주문 로딩 시작...');
    
    // GitHub Pages에서는 API가 없으므로 데모 데이터 사용
    adminOrders = [
        {
            id: 'ord1',
            order_number: 'ORD-20260225-0001',
            customer_name: '홍길동',
            customer_phone: '010-1234-5678',
            customer_email: 'hong@example.com',
            customer_kakao: 'hong_kakao',
            shipping_address: '서울시 강남구 테헤란로 123\n아파트 101동 1001호',
            special_request: '부재 시 경비실에 맡겨주세요',
            products: JSON.stringify([
                {id: '1', name: '헤마타이트 목걸이', price: 69000, quantity: 1}
            ]),
            subtotal: 69000,
            shipping_fee: 0,
            discount: 0,
            total_amount: 69000,
            status: '접수',
            order_date: new Date(Date.now() - 86400000 * 1).toISOString(),
            created_at: Date.now() - 86400000 * 1
        },
        {
            id: 'ord2',
            order_number: 'ORD-20260224-0002',
            customer_name: '김영희',
            customer_phone: '010-9876-5432',
            customer_email: 'kim@example.com',
            customer_kakao: '',
            shipping_address: '서울시 송파구 올림픽로 300',
            special_request: '빠른 배송 부탁드립니다',
            products: JSON.stringify([
                {id: '2', name: '헤마타이트 팔찌', price: 49000, quantity: 1},
                {id: '1', name: '헤마타이트 목걸이', price: 69000, quantity: 1}
            ]),
            subtotal: 118000,
            shipping_fee: 0,
            discount: 0,
            total_amount: 118000,
            status: '배송중',
            order_date: new Date(Date.now() - 86400000 * 2).toISOString(),
            created_at: Date.now() - 86400000 * 2
        },
        {
            id: 'ord3',
            order_number: 'ORD-20260223-0003',
            customer_name: '이철수',
            customer_phone: '010-5555-6666',
            customer_email: '',
            customer_kakao: 'lee_kakao',
            shipping_address: '부산시 해운대구 센텀중앙로 79',
            special_request: '',
            products: JSON.stringify([
                {id: '2', name: '헤마타이트 팔찌', price: 49000, quantity: 1}
            ]),
            subtotal: 49000,
            shipping_fee: 0,
            discount: 0,
            total_amount: 49000,
            status: '배송완료',
            order_date: new Date(Date.now() - 86400000 * 5).toISOString(),
            created_at: Date.now() - 86400000 * 5
        }
    ];
    
    filteredOrders = adminOrders;  // 초기화
    console.log(`✅ [Admin] 주문 ${adminOrders.length}개 로드 완료 (데모 데이터)`);
    
    filterOrders();  // 필터 적용
}

// 주문 표시
function displayOrders(orders, containerId = 'ordersTableContainer') {
    const container = document.getElementById(containerId);
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>주문이 없습니다</h3>
                <p style="color: #999; margin-top: 10px;">아직 접수된 주문이 없습니다</p>
            </div>
        `;
        return;
    }
    
    displayOrdersInContainer(orders, containerId);
}

// 주문 필터
function filterOrders() {
    const filterElement = document.getElementById('orderStatusFilter');
    const filterValue = filterElement ? filterElement.value : 'all';
    const filtered = filterValue === 'all' ? adminOrders : adminOrders.filter(o => o.status === filterValue);
    filteredOrders = filtered;
    searchOrders(); // 검색 적용
}

// 주문 상세보기 - 🔧 products 파싱 수정
function viewOrderDetail(orderId) {
    const order = adminOrders.find(o => o.id === orderId);
    if (!order) return;
    
    // 🔧 핵심 수정: products 파싱 개선
    let products = [];
    try {
        if (typeof order.products === 'string') {
            products = JSON.parse(order.products);
        } else if (Array.isArray(order.products)) {
            products = order.products;
        } else if (typeof order.products === 'object' && order.products !== null) {
            products = [order.products];
        }
    } catch (e) {
        console.error('제품 파싱 오류:', e, order.products);
        products = [];
    }
    
    const orderDate = new Date(order.order_date || order.created_at);
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'orderModal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2><i class="fas fa-receipt"></i> 주문 상세</h2>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body" style="max-height:70vh;overflow-y:auto;">
                <div style="display:grid;gap:20px;">
                    <div style="background:#f8f8f8;padding:20px;border-radius:10px;">
                        <h3 style="margin-bottom:15px;"><i class="fas fa-info-circle"></i> 주문 정보</h3>
                        <p><strong>주문번호:</strong> ${order.order_number}</p>
                        <p><strong>주문일시:</strong> ${orderDate.toLocaleString('ko-KR')}</p>
                        <p><strong>상태:</strong> ${order.status}</p>
                    </div>
                    
                    <div style="background:#f8f8f8;padding:20px;border-radius:10px;">
                        <h3 style="margin-bottom:15px;"><i class="fas fa-user"></i> 고객 정보</h3>
                        <p><strong>이름:</strong> ${order.customer_name}</p>
                        <p><strong>전화:</strong> ${order.customer_phone}</p>
                        <p><strong>이메일:</strong> ${order.customer_email || '미입력'}</p>
                        <p><strong>카카오톡:</strong> ${order.customer_kakao || '미입력'}</p>
                    </div>
                    
                    <div style="background:#f8f8f8;padding:20px;border-radius:10px;">
                        <h3 style="margin-bottom:15px;"><i class="fas fa-map-marker-alt"></i> 배송 정보</h3>
                        <p>${order.shipping_address}</p>
                        ${order.special_request ? `<p style="margin-top:10px;"><strong>요청사항:</strong> ${order.special_request}</p>` : ''}
                        ${order.shipping_company ? `
                            <div style="margin-top:15px;padding:15px;background:white;border-radius:8px;border-left:4px solid #1abc9c;">
                                <p><strong><i class="fas fa-truck"></i> 배송사:</strong> ${order.shipping_company}</p>
                                ${order.tracking_number ? `
                                    <p><strong><i class="fas fa-barcode"></i> 송장번호:</strong> ${order.tracking_number}</p>
                                    <button onclick="openTrackingLink('${order.shipping_company}', '${order.tracking_number}')" 
                                            class="btn btn-secondary" style="width:100%;margin-top:10px;">
                                        <i class="fas fa-external-link-alt"></i> 배송 조회하기
                                    </button>
                                ` : ''}
                            </div>
                        ` : `
                            <button onclick="closeOrderModal(); setTimeout(() => addShippingInfo('${order.id}'), 300);" 
                                    class="btn btn-primary" style="width:100%;margin-top:15px;">
                                <i class="fas fa-shipping-fast"></i> 배송 정보 입력
                            </button>
                        `}
                    </div>
                    
                    <div style="background:#f8f8f8;padding:20px;border-radius:10px;">
                        <h3 style="margin-bottom:15px;"><i class="fas fa-shopping-cart"></i> 주문 상품</h3>
                        ${products.length > 0 ? products.map(p => `
                            <div style="display:flex;justify-content:space-between;padding:10px;background:white;border-radius:8px;margin-bottom:10px;">
                                <div>
                                    <p style="font-weight:600;">${p.name || '제품명 없음'}</p>
                                    <p style="font-size:0.9rem;color:#666;">수량: ${p.quantity || 1}개</p>
                                </div>
                                <p style="font-weight:600;color:#d4af37;">
                                    ${formatPrice((p.price || 0) * (p.quantity || 1))}원
                                </p>
                            </div>
                        `).join('') : '<p>제품 정보 없음</p>'}
                    </div>
                    
                    <div style="background:#f8f8f8;padding:20px;border-radius:10px;">
                        <h3 style="margin-bottom:15px;"><i class="fas fa-receipt"></i> 결제 정보</h3>
                        <div style="background:white;padding:15px;border-radius:8px;">
                            <div style="display:flex;justify-content:space-between;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #eee;">
                                <span style="color:#666;">상품 금액</span>
                                <span style="font-weight:600;">${formatPrice(order.subtotal || order.total_amount)}원</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #eee;">
                                <span style="color:#666;">배송비</span>
                                <span style="font-weight:600;">${order.shipping_fee === 0 ? '무료' : formatPrice(order.shipping_fee || 0) + '원'}</span>
                            </div>
                            ${order.discount > 0 ? `
                            <div style="display:flex;justify-content:space-between;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #eee;">
                                <span style="color:#666;">할인 금액</span>
                                <span style="font-weight:600;color:#f44336;">-${formatPrice(order.discount)}원</span>
                            </div>
                            ` : ''}
                            <div style="display:flex;justify-content:space-between;margin-top:15px;padding-top:15px;border-top:2px solid #ddd;">
                                <span style="font-size:1.1rem;font-weight:700;">총 결제 금액</span>
                                <span style="font-size:1.3rem;font-weight:700;color:#d4af37;">
                                    ${formatPrice(order.total_amount)}원
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display:flex;gap:10px;flex-wrap:wrap;">
                        <button class="btn btn-secondary" data-order-id="${order.id}" data-status="접수" style="flex:1;">접수</button>
                        <button class="btn btn-secondary" data-order-id="${order.id}" data-status="확인중" style="flex:1;">확인중</button>
                        <button class="btn btn-secondary" data-order-id="${order.id}" data-status="배송준비" style="flex:1;">배송준비</button>
                        <button class="btn btn-secondary" data-order-id="${order.id}" data-status="배송중" style="flex:1;">배송중</button>
                        <button class="btn btn-primary" data-order-id="${order.id}" data-status="배송완료" style="flex:1;">배송완료</button>
                        <button class="btn btn-secondary" data-order-id="${order.id}" data-status="취소" style="flex:1;background:#f44336;">취소</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // 모달 닫기 이벤트 리스너
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');
    
    overlay.addEventListener('click', closeOrderModal);
    closeBtn.addEventListener('click', closeOrderModal);
    
    // 상태 변경 버튼 이벤트 리스너 추가
    modal.querySelectorAll('button[data-order-id]').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            const status = this.getAttribute('data-status');
            updateOrderStatus(orderId, status);
        });
    });
}

// 주문 모달 닫기
function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// 주문 상태 변경 (GitHub Pages - 로컬 업데이트만)
async function updateOrderStatus(orderId, newStatus) {
    console.log(`📝 [Admin] 주문 상태 변경: ${orderId} → ${newStatus}`);
    
    // 로컬 adminOrders 배열에서 해당 주문 찾아서 상태 업데이트
    const order = adminOrders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        console.log(`✅ [Admin] 주문 ${order.order_number} 상태 → ${newStatus}`);
        showToast('주문 상태가 변경되었습니다', 'success');
        closeOrderModal();
        loadOrders(); // 테이블 다시 렌더링
        updateStats(); // 통계 업데이트
    } else {
        console.error(`❌ [Admin] 주문 ${orderId}를 찾을 수 없습니다`);
        showToast('주문을 찾을 수 없습니다', 'error');
    }
}

// 토스트 알림
function showToast(message, type) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.className = 'toast ' + type;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== 전역 함수 노출 =====
// 다른 스크립트나 HTML에서 접근 가능하도록 window 객체에 할당
window.adminProducts = adminProducts;
window.adminOrders = adminOrders;
window.renderProductsTable = renderProductsTable;
window.updateStats = updateStats;
window.switchTab = switchTab;
window.loadProducts = loadProducts;
window.loadOrders = loadOrders;
window.showToast = showToast;
window.viewOrderDetail = viewOrderDetail;
window.closeOrderModal = closeOrderModal;
window.updateOrderStatus = updateOrderStatus;
window.handleLogin = handleLogin;
window.logout = logout;

console.log('✅ [Admin] admin.js 로드 완료 - 모든 함수 전역 노출됨');
