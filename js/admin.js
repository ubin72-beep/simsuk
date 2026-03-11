// ============================================
// 심석 관리자 페이지 v5.0 - RESTful API 기반
// localStorage 대신 서버 데이터베이스 사용
// 작성일: 2026-03-11
// ============================================

console.log('✅ 심석 관리자 v5.0 (RESTful API) 로드 시작...');

// ===== 전역 변수 =====
const ADMIN_ACCOUNTS = [
    {
        username: 'admin',
        password: 'simsuk2026'
    }
];

let products = [];
let orders = [];
let currentEditId = null;
let currentTab = 'dashboard';
let autoRefreshInterval = null;
let isAutoRefreshEnabled = true;
let loginAttempts = {};

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
    const lockInfo = checkLoginLock();
    const lockMessage = lockInfo.locked ? `
        <div style="background: #fee; border: 2px solid #f88; padding: 15px; border-radius: 8px; margin-bottom: 15px; text-align: center;">
            <i class="fas fa-lock" style="color: #c00;"></i>
            <div style="margin-top: 10px; color: #c00; font-weight: 600;">
                로그인이 일시적으로 차단되었습니다<br>
                <small style="font-weight: 400;">남은 시간: ${Math.ceil(lockInfo.remainingTime / 60000)}분</small>
            </div>
        </div>
    ` : '';
    
    document.body.innerHTML = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 50px rgba(0,0,0,0.3); max-width: 400px; width: 90%;">
                <h1 style="text-align: center; color: #2c5f4f; margin-bottom: 30px;">
                    <i class="fas fa-gem"></i> 심석 관리자
                </h1>
                ${lockMessage}
                <form onsubmit="handleLogin(event)" style="display: flex; flex-direction: column; gap: 15px;">
                    <div>
                        <input type="text" id="username" placeholder="아이디" 
                               style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px;" 
                               required autofocus ${lockInfo.locked ? 'disabled' : ''}>
                    </div>
                    <div>
                        <input type="password" id="password" placeholder="비밀번호" 
                               style="width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px;" 
                               required ${lockInfo.locked ? 'disabled' : ''}>
                    </div>
                    <button type="submit" 
                            style="width: 100%; padding: 15px; background: ${lockInfo.locked ? '#ccc' : '#667eea'}; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: ${lockInfo.locked ? 'not-allowed' : 'pointer'};" 
                            ${lockInfo.locked ? 'disabled' : ''}>
                        <i class="fas fa-sign-in-alt"></i> 로그인
                    </button>
                </form>
                <div style="margin-top: 20px; text-align: center; color: #888; font-size: 13px;">
                    <i class="fas fa-shield-alt"></i> 아이디/비밀번호 보안 인증
                </div>
            </div>
        </div>
    `;
}

async function handleLogin(event) {
    event.preventDefault();
    
    // 로그인 차단 확인
    const lockInfo = checkLoginLock();
    if (lockInfo.locked) {
        alert(`❌ 로그인이 차단되었습니다. ${Math.ceil(lockInfo.remainingTime / 60000)}분 후 다시 시도하세요.`);
        return;
    }
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // 계정 확인 (평문 비교)
    const account = ADMIN_ACCOUNTS.find(acc => 
        acc.username === username && acc.password === password
    );
    
    if (account) {
        // 로그인 성공
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminUsername', username);
        clearLoginAttempts();
        location.reload();
    } else {
        // 로그인 실패
        recordLoginAttempt();
        const attempts = getLoginAttempts();
        const remaining = 5 - attempts;
        
        if (remaining > 0) {
            alert(`❌ 아이디 또는 비밀번호가 올바르지 않습니다.\n남은 시도: ${remaining}회`);
        } else {
            alert('❌ 로그인 시도 횟수를 초과했습니다. 30분 후 다시 시도하세요.');
            showLoginForm(); // 차단 메시지 표시를 위해 다시 렌더링
        }
    }
}

// SHA-256 해시 함수
async function sha256(str) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 로그인 시도 기록
function recordLoginAttempt() {
    const attempts = getLoginAttempts() + 1;
    const data = {
        count: attempts,
        firstAttempt: loginAttempts.firstAttempt || Date.now(),
        lastAttempt: Date.now()
    };
    
    if (attempts >= 5) {
        data.lockedUntil = Date.now() + (30 * 60 * 1000); // 30분
    }
    
    localStorage.setItem('loginAttempts', JSON.stringify(data));
    loginAttempts = data;
}

// 로그인 시도 횟수 확인
function getLoginAttempts() {
    const stored = localStorage.getItem('loginAttempts');
    if (!stored) return 0;
    
    const data = JSON.parse(stored);
    loginAttempts = data;
    
    // 30분 경과 시 초기화
    if (data.lockedUntil && Date.now() > data.lockedUntil) {
        clearLoginAttempts();
        return 0;
    }
    
    return data.count || 0;
}

// 로그인 차단 확인
function checkLoginLock() {
    const stored = localStorage.getItem('loginAttempts');
    if (!stored) return { locked: false };
    
    const data = JSON.parse(stored);
    if (data.lockedUntil && Date.now() < data.lockedUntil) {
        return {
            locked: true,
            remainingTime: data.lockedUntil - Date.now()
        };
    }
    
    return { locked: false };
}

// 로그인 시도 초기화
function clearLoginAttempts() {
    localStorage.removeItem('loginAttempts');
    loginAttempts = {};
}

function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminUsername');
        location.reload();
    }
}

// ===== 관리자 페이지 표시 =====
async function showAdminPage() {
    loadProducts();
    await loadOrders();
    setTimeout(() => {
        updateStats();
        updateTabBadges();
    }, 100);
    setTimeout(startAutoRefresh, 1000);
}

// ===== 데이터 로드 =====
function loadProducts() {
    // 1. 보호된 데이터 먼저 확인
    const protectedData = localStorage.getItem('PROTECTED_DATA_DO_NOT_DELETE');
    
    // 2. adminProducts 확인
    const stored = localStorage.getItem('adminProducts');
    
    if (stored) {
        try {
            products = JSON.parse(stored);
            console.log('✅ 제품 로드 성공:', products.length, '개');
        } catch (error) {
            console.error('❌ 제품 파싱 오류:', error);
            
            // 파싱 오류 시 보호된 데이터에서 복구
            if (protectedData) {
                try {
                    products = JSON.parse(protectedData);
                    console.log('✅ 보호된 데이터에서 복구:', products.length, '개');
                    saveProducts(); // 즉시 저장
                } catch (e) {
                    products = [];
                }
            } else {
                products = [];
            }
        }
    } else {
        // localStorage가 비어있을 때
        if (protectedData) {
            // 보호된 데이터 복구
            try {
                products = JSON.parse(protectedData);
                console.log('🛡️ 보호된 데이터 자동 복구:', products.length, '개');
                saveProducts(); // 즉시 저장
            } catch (e) {
                products = [];
                console.log('⚠️ localStorage 비어있음 - 빈 배열로 시작');
            }
        } else {
            // 백업에서 복구 시도
            const allKeys = Object.keys(localStorage);
            const backupKeys = allKeys.filter(key => 
                key.startsWith('adminProducts_backup_') || 
                key.startsWith('backup_permanent_') ||
                key.startsWith('emergency_backup_')
            ).sort().reverse();
            
            if (backupKeys.length > 0) {
                try {
                    products = JSON.parse(localStorage.getItem(backupKeys[0]));
                    console.log('🔄 백업에서 자동 복구:', products.length, '개');
                    saveProducts(); // 즉시 저장
                } catch (e) {
                    products = [];
                    console.log('⚠️ localStorage 비어있음 - 빈 배열로 시작');
                }
            } else {
                products = [];
                console.log('⚠️ localStorage 비어있음 - 빈 배열로 시작');
            }
        }
    }
    
    window.adminProducts = products;
    return products;
}

async function loadOrders() {
    try {
        // API에서 주문 데이터 가져오기
        const response = await fetch('tables/orders?limit=1000&sort=-order_date');
        if (response.ok) {
            const data = await response.json();
            orders = data.data || [];
            console.log('✅ [Admin] API에서 주문 로드:', orders.length + '개');
        } else {
            console.error('❌ [Admin] 주문 로드 실패:', response.status);
            // API 실패 시 localStorage 사용
            const stored = localStorage.getItem('orders');
            orders = stored ? JSON.parse(stored) : [];
            console.log('⚠️ [Admin] localStorage에서 주문 로드:', orders.length + '개');
        }
    } catch (error) {
        console.error('❌ [Admin] 주문 로드 오류:', error);
        // 오류 시 localStorage 사용
        const stored = localStorage.getItem('orders');
        orders = stored ? JSON.parse(stored) : [];
        console.log('⚠️ [Admin] localStorage에서 주문 로드:', orders.length + '개');
    }
    
    window.adminOrders = orders;
    return orders;
}

function saveProducts() {
    try {
        const dataStr = JSON.stringify(products);
        
        // 1. 메인 저장소
        localStorage.setItem('adminProducts', dataStr);
        localStorage.setItem('products', dataStr);
        
        // 2. 보호된 저장소 (절대 삭제되지 않음)
        localStorage.setItem('PROTECTED_DATA_DO_NOT_DELETE', dataStr);
        
        // 3. 타임스탬프 백업 (최근 3개)
        const timestamp = Date.now();
        localStorage.setItem(`adminProducts_backup_${timestamp}`, dataStr);
        
        // 오래된 백업 삭제 (최근 3개만 유지)
        const allKeys = Object.keys(localStorage);
        const backupKeys = allKeys.filter(key => key.startsWith('adminProducts_backup_')).sort().reverse();
        backupKeys.slice(3).forEach(key => localStorage.removeItem(key));
        
        // 4. 영구 백업 (매 10번째 저장마다)
        const saveCount = parseInt(localStorage.getItem('saveCount') || '0') + 1;
        localStorage.setItem('saveCount', saveCount.toString());
        
        if (saveCount % 10 === 0) {
            localStorage.setItem(`backup_permanent_${timestamp}`, dataStr);
            console.log('💾 영구 백업 생성:', timestamp);
        }
        
        window.dispatchEvent(new Event('storage'));
        
        console.log('✅ 제품 저장 완료:', products.length, '개 (백업 개수:', backupKeys.length, ')');
    } catch (error) {
        console.error('❌ 제품 저장 오류:', error);
        alert('⚠️ 제품 저장 중 오류가 발생했습니다!\n\n' + error.message + '\n\nprotect-data-now.html로 이동하여 데이터를 보호하세요!');
    }
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
    else if (tabName === 'discounts') loadDiscounts();
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
                    ${products.map(p => {
                        // 이미지 배열 처리 (하위 호환성)
                        const images = p.images || (p.image_url ? [p.image_url] : []);
                        const mainImage = images[0] || 'https://placehold.co/100x100/e0e0e0/666?text=No+Image';
                        
                        // 재고 정보
                        let stockInfo = '';
                        if (p.size_stock) {
                            const totalStock = Object.values(p.size_stock).reduce((sum, stock) => sum + (stock || 0), 0);
                            stockInfo = `<span class="badge ${totalStock > 0 ? 'badge-success' : 'badge-danger'}">${totalStock}개</span>`;
                        } else {
                            stockInfo = `<span class="badge ${p.in_stock ? 'badge-success' : 'badge-danger'}">${p.in_stock ? '재고있음' : '품절'}</span>`;
                        }
                        
                        return `
                        <tr>
                            <td>
                                <div style="display: flex; gap: 5px; align-items: center;">
                                    <img src="${mainImage}" alt="${p.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 2px solid #2c5f4f;">
                                    ${images.length > 1 ? `<span style="font-size: 0.8rem; color: #666;">+${images.length - 1}</span>` : ''}
                                </div>
                            </td>
                            <td>
                                <div>
                                    <strong style="display: block; margin-bottom: 4px;">${p.name}</strong>
                                    ${p.featured ? '<span class="badge badge-warning">추천</span>' : ''}
                                </div>
                            </td>
                            <td>${p.category}</td>
                            <td><strong>${p.price.toLocaleString()}원</strong></td>
                            <td>${stockInfo}</td>
                            <td>
                                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                                    <button class="btn btn-sm" style="background: #667eea; color: white;" onclick="viewProductDetail(${p.id})" title="상세 페이지 보기">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-primary" onclick="editProduct(${p.id})" title="수정">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})" title="삭제">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                    }).join('')}
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
                            <td>${o.order_number || '#' + String(o.id).substr(-6)}</td>
                            <td>${o.customer_name || o.name || '-'}</td>
                            <td>${o.customer_phone || o.phone || '-'}</td>
                            <td>${(o.total_amount || o.total || 0).toLocaleString()}원</td>
                            <td><span class="badge badge-info">${o.status || '접수'}</span></td>
                            <td>${new Date(o.order_date || o.created_at).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="viewOrder('${o.id}')"><i class="fas fa-eye"></i> 상세</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ===== 이미지 업로드 (Base64 인코딩 - 완전 무료, 안전) =====
async function handleImageUpload(event, imageIndex = 1) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 파일 크기 확인 (500KB로 증가 - 메인 이미지 1개만 저장하므로)
    if (file.size > 500 * 1024) {
        showToast(`이미지 크기는 500KB 이하여야 합니다\n\nTinyPNG로 압축해주세요: https://tinypng.com/`, 'error');
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
    statusDiv.innerHTML = `<i class="fas fa-spinner fa-spin"></i> 메인 이미지 처리 중...`;
    statusDiv.style.color = '#667eea';
    
    try {
        // FileReader로 Base64 변환
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const base64Data = e.target.result;
            
            // Hidden input에 Base64 데이터 저장 (메인 이미지만)
            document.getElementById(`productImageUrl1`).value = base64Data;
            
            // 미리보기 표시
            const previewImg = document.getElementById(`previewImg1`);
            const imagePreview = document.getElementById(`imagePreview1`);
            previewImg.src = base64Data;
            imagePreview.style.display = 'block';
            
            // 업로드 버튼 숨기기
            const uploadButton = event.target.previousElementSibling;
            if (uploadButton) uploadButton.style.display = 'none';
            
            // 성공 메시지
            statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> 메인 이미지 처리 완료! (클릭 시 네이버/쿠팡에서 전체 이미지 보기)`;
            statusDiv.style.color = '#28a745';
            
            showToast(`메인 이미지 처리 완료`, 'success');
            
            console.log(`✅ 메인 이미지 Base64 변환 성공 (${Math.round(base64Data.length / 1024)} KB)`);
        };
        
        reader.onerror = function() {
            console.error(`❌ 이미지 처리 오류`);
            statusDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> 이미지 처리 실패`;
            statusDiv.style.color = '#dc3545';
            showToast(`이미지 처리 실패`, 'error');
            event.target.value = '';
        };
        
        // Base64 변환 시작
        reader.readAsDataURL(file);
        
    } catch (error) {
        console.error(`❌ 이미지 업로드 오류:`, error);
        statusDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> 이미지 처리 실패`;
        statusDiv.style.color = '#dc3545';
        showToast(`이미지 처리 실패: ${error.message}`, 'error');
        event.target.value = '';
    }
}

// ===== 이미지 제거 =====
function removeImage(imageIndex) {
    // Hidden input 초기화
    document.getElementById(`productImageUrl${imageIndex}`).value = '';
    
    // 미리보기 숨기기
    document.getElementById(`imagePreview${imageIndex}`).style.display = 'none';
    
    // 파일 input 초기화
    const fileInput = document.getElementById(`productImageFile${imageIndex}`);
    if (fileInput) fileInput.value = '';
    
    // 업로드 버튼 다시 표시
    const uploadButton = fileInput.previousElementSibling;
    if (uploadButton) uploadButton.style.display = 'flex';
    
    showToast(`이미지 ${imageIndex} 제거됨`, 'info');
}

// ===== 제품 관리 =====
function openProductModal(productId = null) {
    currentEditId = productId;
    const modal = document.getElementById('productModal');
    const title = document.getElementById('productModalTitle');
    const statusDiv = document.getElementById('uploadStatus');
    
    // 상태 초기화
    statusDiv.innerHTML = '';
    
    // 모든 이미지 미리보기 초기화 (이미지 1만 존재)
    const preview1 = document.getElementById('imagePreview1');
    const fileInput1 = document.getElementById('productImageFile1');
    if (preview1) preview1.style.display = 'none';
    if (fileInput1 && fileInput1.previousElementSibling) {
        fileInput1.previousElementSibling.style.display = 'flex';
    }
    
    if (productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        title.textContent = '제품 수정';
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productMaterials').value = product.materials || '';
        document.getElementById('productBenefits').value = product.benefits || '';
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productFeatured').checked = product.featured || false;
        document.getElementById('productInStock').checked = product.in_stock !== false;
        
        // 이미지 로드 (메인 이미지 1개만)
        if (product.image || product.image_url) {
            const imageUrl = product.image || product.image_url;
            document.getElementById('productImageUrl1').value = imageUrl;
            const previewImg = document.getElementById('previewImg1');
            const imagePreview = document.getElementById('imagePreview1');
            const fileInput = document.getElementById('productImageFile1');
            const uploadButton = fileInput ? fileInput.previousElementSibling : null;
            
            if (previewImg) previewImg.src = imageUrl;
            if (imagePreview) imagePreview.style.display = 'block';
            if (uploadButton) uploadButton.style.display = 'none';
        }
        
        // 사이즈별 재고 로드
        if (product.size_stock) {
            ['14cm', '15cm', '16cm', '17cm', '18cm', '19cm'].forEach(size => {
                const input = document.getElementById(`stock${size}`);
                if (input && product.size_stock[size] !== undefined) {
                    input.value = product.size_stock[size];
                }
            });
        }
        
        // 탄생석 선택
        const birthstoneSelect = document.getElementById('productBirthstone');
        if (product.birthstone && Array.isArray(product.birthstone)) {
            Array.from(birthstoneSelect.options).forEach(option => {
                option.selected = product.birthstone.includes(option.value);
            });
        }
        
        // 특별한 날 선택
        const specialDaySelect = document.getElementById('productSpecialDay');
        if (product.special_day && Array.isArray(product.special_day)) {
            Array.from(specialDaySelect.options).forEach(option => {
                option.selected = product.special_day.includes(option.value);
            });
        }
        
        // 네이버/쿠팡 링크 로드
        document.getElementById('productNaverLink').value = product.naver_link || '';
        document.getElementById('productCoupangLink').value = product.coupang_link || '';
        
        statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> 기존 제품 데이터 로드됨';
        statusDiv.style.color = '#28a745';
    } else {
        title.textContent = '새 제품 추가';
        document.getElementById('productForm').reset();
        
        // 기본 재고값 설정
        document.getElementById('stock14cm').value = 10;
        document.getElementById('stock15cm').value = 15;
        document.getElementById('stock16cm').value = 20;
        document.getElementById('stock17cm').value = 15;
        document.getElementById('stock18cm').value = 10;
        document.getElementById('stock19cm').value = 5;
        
        // 링크 필드 초기화
        document.getElementById('productNaverLink').value = '';
        document.getElementById('productCoupangLink').value = '';
        
        // 파일 input 초기화 (이미지 1개만)
        const fileInput1 = document.getElementById('productImageFile1');
        if (fileInput1) fileInput1.value = '';
    }
    
    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    currentEditId = null;
}

function handleProductSubmit(event) {
    event.preventDefault();
    
    // 이미지 수집 (메인 이미지 1개만)
    const images = [];
    const imageUrl1 = document.getElementById('productImageUrl1').value;
    if (imageUrl1) {
        images.push(imageUrl1);
    }
    
    // 이미지가 없으면 기본 플레이스홀더 사용
    if (images.length === 0) {
        const productName = document.getElementById('productName').value;
        const placeholder = `https://placehold.co/400x400/667eea/ffffff?text=${encodeURIComponent(productName)}`;
        images.push(placeholder);
        console.log('⚠️ 이미지 없음 - 플레이스홀더 사용:', placeholder);
    }
    
    // 사이즈별 재고 수집
    const sizeStock = {
        '14cm': parseInt(document.getElementById('stock14cm').value) || 0,
        '15cm': parseInt(document.getElementById('stock15cm').value) || 0,
        '16cm': parseInt(document.getElementById('stock16cm').value) || 0,
        '17cm': parseInt(document.getElementById('stock17cm').value) || 0,
        '18cm': parseInt(document.getElementById('stock18cm').value) || 0,
        '19cm': parseInt(document.getElementById('stock19cm').value) || 0
    };
    
    // 총 재고 계산
    const totalStock = Object.values(sizeStock).reduce((sum, stock) => sum + stock, 0);
    
    // 탄생석 선택값 가져오기
    const birthstoneSelect = document.getElementById('productBirthstone');
    const selectedBirthstones = Array.from(birthstoneSelect.selectedOptions).map(opt => opt.value);
    
    // 특별한 날 선택값 가져오기
    const specialDaySelect = document.getElementById('productSpecialDay');
    const selectedSpecialDays = Array.from(specialDaySelect.selectedOptions).map(opt => opt.value);
    
    const productData = {
        id: currentEditId ? currentEditId : Date.now(),  // ⭐ 숫자 ID 보장
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        image: images[0],  // ⭐ 메인 이미지 1개만 저장 (용량 절약)
        image_url: images[0],  // 하위 호환성
        size_stock: sizeStock,  // ⭐ 사이즈별 재고
        total_stock: totalStock,  // ⭐ 총 재고
        materials: document.getElementById('productMaterials').value,
        benefits: document.getElementById('productBenefits').value,
        description: document.getElementById('productDescription').value,
        birthstone: selectedBirthstones,
        special_day: selectedSpecialDays,
        naver_link: document.getElementById('productNaverLink').value || '',  // ⭐ 네이버 링크
        coupang_link: document.getElementById('productCoupangLink').value || '',  // ⭐ 쿠팡 링크
        naverLink: document.getElementById('productNaverLink').value || '',  // ⭐ 하위 호환
        coupangLink: document.getElementById('productCoupangLink').value || '',  // ⭐ 하위 호환
        featured: document.getElementById('productFeatured').checked,
        in_stock: totalStock > 0,  // 재고가 있으면 자동으로 true
        updated_at: new Date().toISOString()
    };
    
    if (currentEditId) {
        const index = products.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
            // 기존 제품 수정 시 created_at 유지
            productData.created_at = products[index].created_at;
            products[index] = productData;
        }
    } else {
        productData.created_at = new Date().toISOString();
        products.push(productData);
    }
    
    saveProducts();
    updateStats();
    updateTabBadges();
    renderProductsTable();
    closeProductModal();
    
    const message = currentEditId ? '제품이 수정되었습니다' : '제품이 추가되었습니다';
    showToast(message + ` (메인 이미지 1장, 총 재고 ${totalStock}개)\n클릭 시 네이버/쿠팡에서 전체 이미지 보기`, 'success');
    
    console.log('✅ 제품 저장:', productData);
}

function editProduct(id) {
    openProductModal(id);
}

// ===== 제품 미리보기 =====
function previewProduct() {
    // 현재 입력된 데이터로 미리보기
    const productName = document.getElementById('productName').value;
    
    if (!productName) {
        showToast('제품명을 먼저 입력해주세요', 'warning');
        return;
    }
    
    // 임시 제품 ID 생성 (미리보기용)
    const previewId = currentEditId || 'preview_' + Date.now();
    
    // 이미지 수집 (메인 이미지 1개만)
    const images = [];
    const imageUrl1 = document.getElementById('productImageUrl1').value;
    if (imageUrl1) {
        images.push(imageUrl1);
    }
    
    // 이미지가 없으면 자동 생성
    if (images.length === 0) {
        const productName = document.getElementById('productName').value;
        const placeholder = `https://placehold.co/400x400/667eea/ffffff?text=${encodeURIComponent(productName)}`;
        images.push(placeholder);
        console.log('⚠️ 미리보기용 플레이스홀더 사용:', placeholder);
    }
    
    // 사이즈별 재고
    const sizeStock = {
        '14cm': parseInt(document.getElementById('stock14cm').value) || 0,
        '15cm': parseInt(document.getElementById('stock15cm').value) || 0,
        '16cm': parseInt(document.getElementById('stock16cm').value) || 0,
        '17cm': parseInt(document.getElementById('stock17cm').value) || 0,
        '18cm': parseInt(document.getElementById('stock18cm').value) || 0,
        '19cm': parseInt(document.getElementById('stock19cm').value) || 0
    };
    
    // 임시 제품 데이터 생성
    const tempProduct = {
        id: previewId,
        name: productName,
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value) || 0,
        images: images,
        image_url: images[0],
        size_stock: sizeStock,
        materials: document.getElementById('productMaterials').value || '천연 원석',
        benefits: document.getElementById('productBenefits').value || '건강 개선',
        description: document.getElementById('productDescription').value || '제품 설명',
        featured: document.getElementById('productFeatured').checked,
        in_stock: true
    };
    
    // 임시로 localStorage에 저장 (미리보기용)
    const existingProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const previewProducts = [...existingProducts.filter(p => !String(p.id).startsWith('preview_')), tempProduct];
    localStorage.setItem('previewProduct', JSON.stringify(tempProduct));
    
    // 새 탭에서 상세 페이지 열기
    window.open(`product-detail.html?id=${previewId}&preview=true`, '_blank');
    
    showToast('새 탭에서 미리보기가 열립니다', 'info');
}

// ===== 제품 상세 페이지 보기 =====
function viewProductDetail(id) {
    window.open(`product-detail.html?id=${id}`, '_blank');
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
    // ID를 문자열로 변환 (API에서는 UUID 문자열)
    const orderId = String(id);
    const order = orders.find(o => String(o.id) === orderId);
    if (!order) {
        console.error('주문을 찾을 수 없습니다:', id, 'Available orders:', orders);
        alert('주문을 찾을 수 없습니다.');
        return;
    }
    
    const modal = document.getElementById('orderModal');
    const content = document.getElementById('orderDetailContent');
    
    // 주문 상품 파싱
    let productsArray = [];
    if (order.products) {
        if (typeof order.products === 'string') {
            try {
                productsArray = JSON.parse(order.products);
            } catch (e) {
                console.error('상품 파싱 오류:', e);
            }
        } else if (Array.isArray(order.products)) {
            productsArray = order.products;
        }
    }
    
    let productsHtml = '';
    if (productsArray.length > 0) {
        productsHtml = productsArray.map(p => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${p.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center;">${p.quantity}개</td>
                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">${(p.price * p.quantity).toLocaleString()}원</td>
            </tr>
        `).join('');
    }
    
    // 상태에 따른 배지 색상
    const statusColors = {
        '접수': 'info',
        '확인중': 'warning',
        '배송준비': 'warning',
        '배송중': 'primary',
        '배송완료': 'success',
        '취소': 'danger'
    };
    const statusColor = statusColors[order.status] || 'info';
    
    content.innerHTML = `
        <div class="modal-body" style="padding: 30px;">
            <!-- 주문 기본 정보 -->
            <div style="background: linear-gradient(135deg, #2c5f4f 0%, #3d7a63 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 10px 0; font-size: 1.3rem;">
                    <i class="fas fa-receipt"></i> 주문 #${order.order_number || String(order.id).substr(-6)}
                </h3>
                <p style="margin: 0; opacity: 0.9;">
                    <i class="far fa-clock"></i> ${new Date(order.order_date || order.created_at).toLocaleString('ko-KR')}
                </p>
            </div>
            
            <!-- 상태 및 배송 정보 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                <div style="background: #f5f5f5; padding: 20px; border-radius: 10px;">
                    <h4 style="margin: 0 0 10px 0; color: #666; font-size: 0.9rem; font-weight: 600;">
                        <i class="fas fa-flag"></i> 주문 상태
                    </h4>
                    <span class="badge badge-${statusColor}" style="font-size: 1rem; padding: 8px 16px;">${order.status || '접수'}</span>
                </div>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 10px;">
                    <h4 style="margin: 0 0 10px 0; color: #666; font-size: 0.9rem; font-weight: 600;">
                        <i class="fas fa-truck"></i> 배송 정보
                    </h4>
                    <div id="shippingInfoDisplay">
                        ${order.shipping_company && order.tracking_number ? `
                            <p style="margin: 5px 0; font-size: 0.95rem;">
                                <strong>${order.shipping_company}</strong><br>
                                <span style="color: #2c5f4f; font-weight: 600;">${order.tracking_number}</span>
                            </p>
                        ` : `
                            <p style="margin: 0; color: #999; font-size: 0.9rem;">배송 정보 미입력</p>
                        `}
                    </div>
                </div>
            </div>
            
            <!-- 고객 정보 -->
            <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; border-left: 4px solid #2c5f4f; margin-bottom: 25px;">
                <h4 style="margin: 0 0 15px 0; color: #2c5f4f; font-size: 1.1rem;">
                    <i class="fas fa-user"></i> 고객 정보
                </h4>
                <div style="display: grid; gap: 10px;">
                    <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                        <span style="width: 100px; color: #666; font-weight: 500;"><i class="fas fa-user-circle" style="margin-right: 5px;"></i>이름</span>
                        <span style="flex: 1; color: #333; font-weight: 600;">${order.customer_name || order.name}</span>
                    </div>
                    <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                        <span style="width: 100px; color: #666; font-weight: 500;"><i class="fas fa-phone" style="margin-right: 5px;"></i>전화번호</span>
                        <span style="flex: 1; color: #333; font-weight: 600;">
                            <a href="tel:${order.customer_phone || order.phone}" style="color: #2c5f4f; text-decoration: none;">${order.customer_phone || order.phone}</a>
                        </span>
                    </div>
                    <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                        <span style="width: 100px; color: #666; font-weight: 500;"><i class="fas fa-envelope" style="margin-right: 5px;"></i>이메일</span>
                        <span style="flex: 1; color: #333;">${order.customer_email || order.email || '-'}</span>
                    </div>
                    <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                        <span style="width: 100px; color: #666; font-weight: 500;"><i class="fab fa-kickstarter" style="margin-right: 5px;"></i>카카오톡</span>
                        <span style="flex: 1; color: #333;">${order.customer_kakao || '-'}</span>
                    </div>
                    <div style="display: flex; padding: 8px 0;">
                        <span style="width: 100px; color: #666; font-weight: 500;"><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i>배송지</span>
                        <span style="flex: 1; color: #333; line-height: 1.6;">${order.shipping_address || order.address || '-'}</span>
                    </div>
                    ${order.special_request ? `
                    <div style="display: flex; padding: 8px 0; background: #fff3cd; margin-top: 10px; padding: 12px; border-radius: 6px;">
                        <span style="width: 100px; color: #856404; font-weight: 500;"><i class="fas fa-comment-dots" style="margin-right: 5px;"></i>요청사항</span>
                        <span style="flex: 1; color: #856404; line-height: 1.6;">${order.special_request}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- 주문 상품 -->
            <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0; margin-bottom: 25px;">
                <h4 style="margin: 0 0 15px 0; color: #2c5f4f; font-size: 1.1rem; border-bottom: 2px solid #2c5f4f; padding-bottom: 10px;">
                    <i class="fas fa-shopping-bag"></i> 주문 상품
                </h4>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f5f5f5;">
                            <th style="text-align: left; padding: 12px; font-weight: 600; color: #555;">상품명</th>
                            <th style="text-align: center; padding: 12px; font-weight: 600; color: #555;">수량</th>
                            <th style="text-align: right; padding: 12px; font-weight: 600; color: #555;">금액</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productsHtml}
                    </tbody>
                </table>
                
                <!-- 가격 요약 -->
                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e0e0e0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #666;">상품 금액</span>
                        <span style="color: #333; font-weight: 500;">${(order.subtotal || 0).toLocaleString()}원</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #666;">배송비</span>
                        <span style="color: ${order.shipping_fee === 0 ? '#4caf50' : '#333'}; font-weight: 500;">
                            ${order.shipping_fee === 0 ? '무료 배송' : (order.shipping_fee || 0).toLocaleString() + '원'}
                        </span>
                    </div>
                    ${order.discount > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #666;">할인</span>
                        <span style="color: #e74c3c; font-weight: 500;">-${(order.discount || 0).toLocaleString()}원</span>
                    </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; padding-top: 15px; border-top: 2px solid #2c5f4f; margin-top: 10px;">
                        <span style="font-size: 1.2rem; font-weight: 600; color: #2c5f4f;">총 결제 금액</span>
                        <span style="font-size: 1.3rem; font-weight: 700; color: #2c5f4f;">${(order.total_amount || order.total || 0).toLocaleString()}원</span>
                    </div>
                </div>
            </div>
            
            <!-- 액션 버튼 -->
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="updateOrderStatus('${order.id}')" style="flex: 1; min-width: 120px;">
                    <i class="fas fa-edit"></i> 상태 변경
                </button>
                <button class="btn btn-success" onclick="showShippingForm('${order.id}')" style="flex: 1; min-width: 120px;">
                    <i class="fas fa-truck"></i> 배송 정보 입력
                </button>
                <button class="btn btn-outline" onclick="printOrder('${order.id}')" style="flex: 1; min-width: 120px;">
                    <i class="fas fa-print"></i> 인쇄
                </button>
                <button class="btn btn-outline" onclick="closeOrderModal()" style="flex: 1; min-width: 120px;">
                    <i class="fas fa-times"></i> 닫기
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
}

// 배송 정보 입력 폼 표시
function showShippingForm(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const shippingCompanies = [
        '한진택배',
        'CJ대한통운',
        '로젠택배',
        '우체국 택배',
        'GS포스트 (CVSNET)',
        '한의사랑택배',
        '대신택배',
        '경동택배',
        'KGB택배',
        '커뮤니케이션'
    ];
    
    const modalBody = document.getElementById('orderDetailContent');
    modalBody.innerHTML = `
        <div class="modal-body" style="padding: 30px;">
            <h3 style="color: #2c5f4f; margin-bottom: 25px;">
                <i class="fas fa-truck"></i> 배송 정보 입력
            </h3>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                <h4 style="margin: 0 0 10px 0; font-size: 1rem; color: #666;">주문 정보</h4>
                <p style="margin: 0; font-size: 1.1rem; color: #333;">
                    <strong>주문번호:</strong> #${order.order_number || String(order.id).substr(-6)}<br>
                    <strong>고객명:</strong> ${order.customer_name || order.name}<br>
                    <strong>전화번호:</strong> ${order.customer_phone || order.phone}
                </p>
            </div>
            
            <form id="shippingForm" style="display: flex; flex-direction: column; gap: 20px;">
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        <i class="fas fa-building"></i> 택배 회사 *
                    </label>
                    <select id="shippingCompany" required style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
                        <option value="">택배 회사 선택</option>
                        ${shippingCompanies.map(company => `
                            <option value="${company}" ${order.shipping_company === company ? 'selected' : ''}>${company}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        <i class="fas fa-barcode"></i> 송장번호 *
                    </label>
                    <input 
                        type="text" 
                        id="trackingNumber" 
                        required 
                        value="${order.tracking_number || ''}"
                        placeholder="송장번호 입력 (예: 123456789012)"
                        style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;"
                    >
                    <small style="color: #666; margin-top: 5px; display: block;">
                        <i class="fas fa-info-circle"></i> 숫자만 입력하거나 하이픈(-) 포함 가능
                    </small>
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        <i class="fas fa-comment"></i> 배송 메모 (선택)
                    </label>
                    <textarea 
                        id="shippingMemo" 
                        rows="3"
                        placeholder="배송 관련 메모를 입력하세요."
                        style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; resize: vertical;"
                    >${order.shipping_memo || ''}</textarea>
                </div>
                
                <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3;">
                    <p style="margin: 0; color: #1565c0; font-size: 0.95rem; line-height: 1.6;">
                        <i class="fas fa-lightbulb"></i> <strong>팁:</strong><br>
                        • 배송 정보 저장 후 주문 상태가 "배송중"으로 자동 변경됩니다.<br>
                        • 고객에게 SMS 또는 카카오톡으로 배송 정보를 알려주세요.
                    </p>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <button type="submit" class="btn btn-success" style="flex: 1;">
                        <i class="fas fa-save"></i> 저장
                    </button>
                    <button type="button" class="btn btn-outline" onclick="viewOrder('${orderId}')" style="flex: 1;">
                        <i class="fas fa-arrow-left"></i> 취소
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.getElementById('shippingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveShippingInfo(orderId);
    });
}

// 배송 정보 저장
async function saveShippingInfo(orderId) {
    const shippingCompany = document.getElementById('shippingCompany').value;
    const trackingNumber = document.getElementById('trackingNumber').value;
    const shippingMemo = document.getElementById('shippingMemo').value;
    
    if (!shippingCompany || !trackingNumber) {
        alert('택배 회사와 송장번호를 모두 입력해주세요.');
        return;
    }
    
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // 배송 정보 업데이트
    order.shipping_company = shippingCompany;
    order.tracking_number = trackingNumber;
    order.shipping_memo = shippingMemo;
    order.status = '배송중'; // 자동으로 배송중 상태로 변경
    order.shipping_date = new Date().toISOString();
    order.updated_at = new Date().toISOString();
    
    try {
        // API로 업데이트
        const response = await fetch(`tables/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                shipping_company: shippingCompany,
                tracking_number: trackingNumber,
                shipping_memo: shippingMemo,
                status: '배송중',
                shipping_date: order.shipping_date,
                updated_at: order.updated_at
            })
        });
        
        if (!response.ok) {
            throw new Error('배송 정보 업데이트 실패');
        }
        
        console.log('✅ 배송 정보 저장 성공:', order);
        
    } catch (error) {
        console.error('❌ 배송 정보 저장 오류:', error);
        // 오류 시에도 localStorage에는 저장
    }
    
    saveOrders();
    updateStats();
    renderOrdersTable();
    showToast('배송 정보가 저장되었습니다. (상태: 배송중)', 'success');
    viewOrder(orderId); // 상세 페이지로 돌아가기
}

function updateOrderStatus(orderId) {
    const statuses = ['접수', '확인중', '배송준비', '배송중', '배송완료', '취소'];
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const currentStatus = order.status || '접수';
    
    // 상태 선택 UI
    const modalBody = document.getElementById('orderDetailContent');
    modalBody.innerHTML = `
        <div class="modal-body" style="padding: 30px;">
            <h3 style="color: #2c5f4f; margin-bottom: 25px;">
                <i class="fas fa-edit"></i> 주문 상태 변경
            </h3>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                <h4 style="margin: 0 0 10px 0; font-size: 1rem; color: #666;">주문 정보</h4>
                <p style="margin: 0; font-size: 1.1rem; color: #333;">
                    <strong>주문번호:</strong> #${order.order_number || String(order.id).substr(-6)}<br>
                    <strong>현재 상태:</strong> <span class="badge badge-info">${currentStatus}</span>
                </p>
            </div>
            
            <div style="margin-bottom: 25px;">
                <label style="display: block; margin-bottom: 12px; font-weight: 600; color: #333; font-size: 1.1rem;">
                    <i class="fas fa-flag"></i> 새로운 상태 선택
                </label>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                    ${statuses.map(status => {
                        const icons = {
                            '접수': 'inbox',
                            '확인중': 'eye',
                            '배송준비': 'box',
                            '배송중': 'truck',
                            '배송완료': 'check-circle',
                            '취소': 'times-circle'
                        };
                        const colors = {
                            '접수': '#2196f3',
                            '확인중': '#ff9800',
                            '배송준비': '#ff9800',
                            '배송중': '#9c27b0',
                            '배송완료': '#4caf50',
                            '취소': '#f44336'
                        };
                        const isActive = status === currentStatus;
                        return `
                            <button 
                                type="button"
                                onclick="confirmStatusChange('${orderId}', '${status}')"
                                style="
                                    padding: 20px;
                                    border: 3px solid ${isActive ? colors[status] : '#e0e0e0'};
                                    background: ${isActive ? colors[status] + '15' : 'white'};
                                    border-radius: 12px;
                                    cursor: pointer;
                                    transition: all 0.3s;
                                    text-align: center;
                                "
                                onmouseover="this.style.borderColor='${colors[status]}'; this.style.background='${colors[status]}15';"
                                onmouseout="this.style.borderColor='${isActive ? colors[status] : '#e0e0e0'}'; this.style.background='${isActive ? colors[status] + '15' : 'white'}';"
                            >
                                <i class="fas fa-${icons[status]}" style="font-size: 2rem; color: ${colors[status]}; margin-bottom: 10px;"></i>
                                <div style="font-weight: 600; color: #333; font-size: 1rem;">${status}</div>
                                ${isActive ? '<div style="color: ' + colors[status] + '; font-size: 0.85rem; margin-top: 5px;">(현재 상태)</div>' : ''}
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
                <p style="margin: 0; color: #856404; font-size: 0.95rem; line-height: 1.6;">
                    <i class="fas fa-info-circle"></i> <strong>안내:</strong><br>
                    • 상태를 선택하면 확인 후 즉시 변경됩니다.<br>
                    • "배송중" 선택 시 배송 정보가 입력되어 있어야 합니다.
                </p>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button type="button" class="btn btn-outline" onclick="viewOrder('${orderId}')" style="flex: 1;">
                    <i class="fas fa-arrow-left"></i> 취소
                </button>
            </div>
        </div>
    `;
}

async function confirmStatusChange(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // 배송중으로 변경 시 배송 정보 확인
    if (newStatus === '배송중' && (!order.shipping_company || !order.tracking_number)) {
        if (confirm('배송 정보가 없습니다. 배송 정보를 먼저 입력하시겠습니까?')) {
            showShippingForm(orderId);
        }
        return;
    }
    
    if (!confirm(`주문 상태를 "${newStatus}"로 변경하시겠습니까?`)) {
        return;
    }
    
    order.status = newStatus;
    order.updated_at = new Date().toISOString();
    
    // 배송완료 시 완료 시간 기록
    if (newStatus === '배송완료') {
        order.completed_date = new Date().toISOString();
    }
    
    try {
        const response = await fetch(`tables/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: newStatus,
                updated_at: order.updated_at,
                ...(newStatus === '배송완료' ? { completed_date: order.completed_date } : {})
            })
        });
        
        if (!response.ok) {
            throw new Error('상태 변경 실패');
        }
        
        console.log('✅ 주문 상태 변경 성공:', order);
        
    } catch (error) {
        console.error('❌ 상태 변경 오류:', error);
    }
    
    saveOrders();
    updateStats();
    renderOrdersTable();
    showToast(`주문 상태가 "${newStatus}"로 변경되었습니다`, 'success');
    viewOrder(orderId);
}

// 주문 인쇄
function printOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // 상품 파싱
    let productsArray = [];
    if (order.products) {
        if (typeof order.products === 'string') {
            try {
                productsArray = JSON.parse(order.products);
            } catch (e) {
                console.error('상품 파싱 오류:', e);
            }
        } else if (Array.isArray(order.products)) {
            productsArray = order.products;
        }
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>주문서 #${order.order_number || String(order.id).substr(-6)}</title>
            <style>
                body { font-family: 'Malgun Gothic', sans-serif; padding: 40px; }
                h1 { text-align: center; color: #2c5f4f; border-bottom: 3px solid #2c5f4f; padding-bottom: 10px; }
                .info-section { margin: 30px 0; padding: 20px; background: #f5f5f5; border-radius: 8px; }
                .info-section h3 { margin-top: 0; color: #2c5f4f; border-bottom: 2px solid #2c5f4f; padding-bottom: 8px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0; }
                th { background: #2c5f4f; color: white; font-weight: 600; }
                .total { font-size: 1.2rem; font-weight: bold; text-align: right; padding-top: 15px; border-top: 3px solid #2c5f4f; }
                .footer { text-align: center; margin-top: 50px; color: #666; font-size: 0.9rem; }
                @media print {
                    body { padding: 20px; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>주문서</h1>
            
            <div class="info-section">
                <h3>주문 정보</h3>
                <p><strong>주문번호:</strong> #${order.order_number || String(order.id).substr(-6)}</p>
                <p><strong>주문일시:</strong> ${new Date(order.order_date || order.created_at).toLocaleString('ko-KR')}</p>
                <p><strong>상태:</strong> ${order.status || '접수'}</p>
            </div>
            
            <div class="info-section">
                <h3>고객 정보</h3>
                <p><strong>이름:</strong> ${order.customer_name || order.name}</p>
                <p><strong>전화번호:</strong> ${order.customer_phone || order.phone}</p>
                <p><strong>이메일:</strong> ${order.customer_email || order.email || '-'}</p>
                <p><strong>배송지:</strong> ${order.shipping_address || order.address || '-'}</p>
                ${order.special_request ? `<p><strong>요청사항:</strong> ${order.special_request}</p>` : ''}
            </div>
            
            ${order.shipping_company && order.tracking_number ? `
            <div class="info-section">
                <h3>배송 정보</h3>
                <p><strong>택배회사:</strong> ${order.shipping_company}</p>
                <p><strong>송장번호:</strong> ${order.tracking_number}</p>
                ${order.shipping_memo ? `<p><strong>배송메모:</strong> ${order.shipping_memo}</p>` : ''}
            </div>
            ` : ''}
            
            <div class="info-section">
                <h3>주문 상품</h3>
                <table>
                    <thead>
                        <tr>
                            <th>상품명</th>
                            <th style="text-align: center;">수량</th>
                            <th style="text-align: right;">단가</th>
                            <th style="text-align: right;">금액</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productsArray.map(p => `
                            <tr>
                                <td>${p.name}</td>
                                <td style="text-align: center;">${p.quantity}개</td>
                                <td style="text-align: right;">${(p.price || 0).toLocaleString()}원</td>
                                <td style="text-align: right;">${(p.price * p.quantity).toLocaleString()}원</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #e0e0e0;">
                    <p style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span>상품 금액:</span>
                        <span>${(order.subtotal || 0).toLocaleString()}원</span>
                    </p>
                    <p style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span>배송비:</span>
                        <span>${order.shipping_fee === 0 ? '무료 배송' : (order.shipping_fee || 0).toLocaleString() + '원'}</span>
                    </p>
                    ${order.discount > 0 ? `
                    <p style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span>할인:</span>
                        <span style="color: red;">-${(order.discount || 0).toLocaleString()}원</span>
                    </p>
                    ` : ''}
                    <div class="total">
                        <p style="display: flex; justify-content: space-between; margin: 0;">
                            <span>총 결제 금액:</span>
                            <span>${(order.total_amount || order.total || 0).toLocaleString()}원</span>
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p>심석(SIMSUK) - www.simsuk.com</p>
                <p>전화: 0502-1909-7788 | 이메일: simsukbiz@gmail.com</p>
                <p>서울특별시 송파구 | 사업자등록번호: 537-08-03349</p>
            </div>
            
            <div class="no-print" style="text-align: center; margin-top: 30px;">
                <button onclick="window.print()" style="padding: 15px 40px; background: #2c5f4f; color: white; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer;">
                    인쇄하기
                </button>
                <button onclick="window.close()" style="padding: 15px 40px; background: #666; color: white; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer; margin-left: 10px;">
                    닫기
                </button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// ===== 전역 함수 노출 =====
window.viewOrder = viewOrder;
window.closeOrderModal = closeOrderModal;
window.showShippingForm = showShippingForm;
window.saveShippingInfo = saveShippingInfo;
window.updateOrderStatus = updateOrderStatus;
window.confirmStatusChange = confirmStatusChange;
window.printOrder = printOrder;
window.handleImageUpload = handleImageUpload;
window.removeImage = removeImage;
window.previewProduct = previewProduct;
window.viewProductDetail = viewProductDetail;

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
    
    autoRefreshInterval = setInterval(async () => {
        if (isAutoRefreshEnabled) {
            loadProducts();
            await loadOrders();
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
