// ============================================
// 심석 관리자 페이지 - localStorage 완벽 버전
// GitHub Pages 전용 (서버 불필요)
// 작성일: 2026-03-11
// ============================================

console.log('✅ 심석 관리자 localStorage 완벽 버전 로드 시작...');

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
    
    // 페이지 로드 시 즉시 localStorage 검증
    verifyLocalStorage();
    
    checkAuth();
});

// ===== localStorage 검증 =====
function verifyLocalStorage() {
    try {
        // 1. localStorage 사용 가능 여부 확인
        const testKey = '__localStorage_test__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        console.log('✅ localStorage 사용 가능');
        
        // 2. 저장된 데이터 확인
        const adminProducts = localStorage.getItem('adminProducts');
        const regularProducts = localStorage.getItem('products');
        const protected = localStorage.getItem('PROTECTED_DATA_DO_NOT_DELETE');
        
        console.log('📦 adminProducts:', adminProducts ? `${JSON.parse(adminProducts).length}개` : '없음');
        console.log('📦 products:', regularProducts ? `${JSON.parse(regularProducts).length}개` : '없음');
        console.log('🛡️ 보호된 데이터:', protected ? `${JSON.parse(protected).length}개` : '없음');
        
        // 3. 백업 키 확인
        const allKeys = Object.keys(localStorage);
        const backupKeys = allKeys.filter(key => key.startsWith('adminProducts_backup_'));
        console.log('💾 백업 개수:', backupKeys.length, '개');
        
        return true;
    } catch (e) {
        console.error('❌ localStorage 오류:', e);
        alert('⚠️ 브라우저의 localStorage가 비활성화되어 있습니다!\n\n설정에서 쿠키/사이트 데이터를 활성화해주세요.');
        return false;
    }
}

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
    
    const isDisabled = lockInfo.locked ? 'disabled' : '';
    const buttonStyle = lockInfo.locked ? 'background: #ccc; cursor: not-allowed;' : 'background: #2c5f4f;';
    
    document.body.innerHTML = `
        <div style="min-height: 100vh; display: flex; justify-content: center; align-items: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div style="background: white; padding: 40px; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); width: 90%; max-width: 400px;">
                <h1 style="text-align: center; color: #2c5f4f; margin-bottom: 30px; font-size: 2rem;">
                    <i class="fas fa-gem" style="color: #667eea;"></i> 심석 관리자
                </h1>
                ${lockMessage}
                <form id="loginForm" onsubmit="handleLogin(event); return false;">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #555; font-weight: 600;">아이디</label>
                        <input type="text" id="username" required ${isDisabled}
                            style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem;">
                    </div>
                    <div style="margin-bottom: 25px;">
                        <label style="display: block; margin-bottom: 8px; color: #555; font-weight: 600;">비밀번호</label>
                        <input type="password" id="password" required ${isDisabled}
                            style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem;">
                    </div>
                    <button type="submit" ${isDisabled}
                        style="width: 100%; padding: 14px; ${buttonStyle} color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer;">
                        ${lockInfo.locked ? '로그인 차단됨' : '로그인'}
                    </button>
                </form>
            </div>
        </div>
    `;
    
    // 잠금 상태이면 카운트다운 표시
    if (lockInfo.locked) {
        const countdown = setInterval(() => {
            const newLockInfo = checkLoginLock();
            if (!newLockInfo.locked) {
                clearInterval(countdown);
                showLoginForm();
            }
        }, 1000);
    }
}

function checkLoginLock() {
    const lockUntil = parseInt(localStorage.getItem('loginLockUntil') || '0');
    const now = Date.now();
    
    if (lockUntil > now) {
        return { locked: true, remainingTime: lockUntil - now };
    }
    
    return { locked: false, remainingTime: 0 };
}

function handleLogin(event) {
    event.preventDefault();
    
    const lockInfo = checkLoginLock();
    if (lockInfo.locked) {
        alert(`로그인이 차단되었습니다.\n남은 시간: ${Math.ceil(lockInfo.remainingTime / 60000)}분`);
        return;
    }
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const account = ADMIN_ACCOUNTS.find(acc => acc.username === username && acc.password === password);
    
    if (account) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminUsername', username);
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('loginLockUntil');
        console.log('✅ 로그인 성공:', username);
        showAdminPage();
    } else {
        const attempts = parseInt(localStorage.getItem('loginAttempts') || '0') + 1;
        localStorage.setItem('loginAttempts', attempts.toString());
        
        if (attempts >= 5) {
            const lockDuration = 30 * 60 * 1000; // 30분
            localStorage.setItem('loginLockUntil', (Date.now() + lockDuration).toString());
            alert('⚠️ 로그인 시도 5회 초과!\n30분 동안 로그인이 차단됩니다.');
            showLoginForm();
        } else {
            alert(`❌ 로그인 실패\n\n남은 시도: ${5 - attempts}회`);
        }
    }
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUsername');
    console.log('✅ 로그아웃');
    location.reload();
}

// ===== 관리자 페이지 =====
async function showAdminPage() {
    document.body.innerHTML = `
        <div class="admin-container">
            <header class="admin-header">
                <div>
                    <h1><i class="fas fa-gem"></i> 심석 관리자</h1>
                    <p>운명을 다듬는 주얼리 관리 시스템</p>
                </div>
                <div>
                    <button class="btn btn-secondary" onclick="toggleAutoRefresh()">
                        <i class="fas fa-sync"></i> <span id="autoRefreshText">자동 새로고침: ON</span>
                    </button>
                    <button class="btn btn-danger" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> 로그아웃
                    </button>
                </div>
            </header>
            
            <div class="tabs">
                <button class="tab-btn active" onclick="switchTab('dashboard')">
                    <i class="fas fa-chart-line"></i> 대시보드
                </button>
                <button class="tab-btn" onclick="switchTab('products')">
                    <i class="fas fa-box"></i> 제품 관리 <span class="badge" id="productsCount">0</span>
                </button>
                <button class="tab-btn" onclick="switchTab('orders')">
                    <i class="fas fa-shopping-cart"></i> 주문 관리 <span class="badge" id="ordersCount">0</span>
                </button>
            </div>
            
            <div id="dashboard" class="tab-content active">
                <div class="stats-grid">
                    <div class="stat-card">
                        <i class="fas fa-box"></i>
                        <div>
                            <h3 id="totalProducts">0</h3>
                            <p>총 제품</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-necklace"></i>
                        <div>
                            <h3 id="necklaceCount">0</h3>
                            <p>목걸이</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-ring"></i>
                        <div>
                            <h3 id="braceletCount">0</h3>
                            <p>팔찌</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-gem"></i>
                        <div>
                            <h3 id="ringCount">0</h3>
                            <p>반지</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-mobile-alt"></i>
                        <div>
                            <h3 id="phoneCount">0</h3>
                            <p>핸드폰 줄</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-shopping-cart"></i>
                        <div>
                            <h3 id="totalOrders">0</h3>
                            <p>총 주문</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-clock"></i>
                        <div>
                            <h3 id="pendingOrders">0</h3>
                            <p>대기 중 주문</p>
                        </div>
                    </div>
                    <div class="stat-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                        <i class="fas fa-database"></i>
                        <div>
                            <h3 id="localStorageSize">0</h3>
                            <p>저장 용량 (KB)</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="products" class="tab-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2><i class="fas fa-box"></i> 제품 관리</h2>
                    <button class="btn btn-primary" onclick="openProductModal()">
                        <i class="fas fa-plus"></i> 새 제품 추가
                    </button>
                </div>
                <div id="productsTableContainer"></div>
            </div>
            
            <div id="orders" class="tab-content">
                <h2><i class="fas fa-shopping-cart"></i> 주문 관리</h2>
                <div id="ordersTableContainer"></div>
            </div>
        </div>
        
        <!-- 제품 모달 -->
        <div id="productModal" class="modal">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2 id="modalTitle">새 제품 추가</h2>
                    <button class="modal-close" onclick="closeProductModal()">&times;</button>
                </div>
                <form id="productForm" onsubmit="handleProductSubmit(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label>제품명 *</label>
                            <input type="text" id="productName" required>
                        </div>
                        <div class="form-group">
                            <label>카테고리 *</label>
                            <select id="productCategory" required>
                                <option value="목걸이">목걸이</option>
                                <option value="팔찌">팔찌</option>
                                <option value="반지">반지</option>
                                <option value="핸드폰 줄">핸드폰 줄</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>가격 (원) *</label>
                        <input type="number" id="productPrice" required min="0" step="1000">
                    </div>
                    
                    <!-- 이미지 업로드 (1장) -->
                    <div class="form-group full-width">
                        <label>메인 이미지 (선택사항)</label>
                        <div class="image-upload-container">
                            <button type="button" class="image-upload-btn" onclick="document.getElementById('productImageFile1').click()">
                                <i class="fas fa-cloud-upload-alt"></i> 이미지 선택
                            </button>
                            <input type="file" id="productImageFile1" accept="image/jpeg,image/jpg,image/png,image/webp" 
                                   onchange="handleImageUpload(event, 1)" style="display: none;">
                            <input type="hidden" id="productImageUrl1">
                            
                            <div id="imagePreview1" class="image-preview" style="display: none;">
                                <img id="previewImg1">
                                <button type="button" class="image-remove-btn" onclick="removeImage(1)">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div id="uploadStatus" style="margin-top: 10px; font-size: 0.9rem;"></div>
                        
                        <div style="background: #e3f2fd; padding: 12px; border-radius: 8px; margin-top: 10px;">
                            <i class="fas fa-info-circle" style="color: #1976d2;"></i>
                            <strong>이미지 없이 저장 가능:</strong> 이미지를 업로드하지 않아도 제품을 저장할 수 있습니다.<br>
                            <strong style="color: #d32f2f;">중요:</strong> 네이버 스마트스토어 링크를 필수로 입력해주세요! 고객이 제품을 클릭하면 해당 링크로 이동합니다.
                        </div>
                    </div>
                    
                    <!-- 사이즈별 재고 -->
                    <div class="form-group full-width">
                        <label>사이즈별 재고 *</label>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                            <div>
                                <label style="font-size: 0.9rem;">14cm (XS)</label>
                                <input type="number" id="stock14cm" min="0" value="10">
                            </div>
                            <div>
                                <label style="font-size: 0.9rem;">15cm (S)</label>
                                <input type="number" id="stock15cm" min="0" value="15">
                            </div>
                            <div>
                                <label style="font-size: 0.9rem;">16cm (M)</label>
                                <input type="number" id="stock16cm" min="0" value="20">
                            </div>
                            <div>
                                <label style="font-size: 0.9rem;">17cm (L)</label>
                                <input type="number" id="stock17cm" min="0" value="15">
                            </div>
                            <div>
                                <label style="font-size: 0.9rem;">18cm (XL)</label>
                                <input type="number" id="stock18cm" min="0" value="10">
                            </div>
                            <div>
                                <label style="font-size: 0.9rem;">19cm (XXL)</label>
                                <input type="number" id="stock19cm" min="0" value="5">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group full-width">
                        <label>재료/소재</label>
                        <input type="text" id="productMaterials" placeholder="예: 천연 헤마타이트, 실버 925">
                    </div>
                    
                    <div class="form-group full-width">
                        <label>효능/특징</label>
                        <textarea id="productBenefits" rows="2" placeholder="예: 혈액순환 개선, 스트레스 완화"></textarea>
                    </div>
                    
                    <div class="form-group full-width">
                        <label>상세 설명</label>
                        <textarea id="productDescription" rows="3" placeholder="제품에 대한 상세한 설명을 입력하세요"></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>탄생석</label>
                            <select id="productBirthstone" multiple size="6">
                                <option value="1월">1월 (가넷)</option>
                                <option value="2월">2월 (자수정)</option>
                                <option value="3월">3월 (아쿠아마린)</option>
                                <option value="4월">4월 (다이아몬드)</option>
                                <option value="5월">5월 (에메랄드)</option>
                                <option value="6월">6월 (진주)</option>
                                <option value="7월">7월 (루비)</option>
                                <option value="8월">8월 (페리도트)</option>
                                <option value="9월">9월 (사파이어)</option>
                                <option value="10월">10월 (오팔)</option>
                                <option value="11월">11월 (토파즈)</option>
                                <option value="12월">12월 (터키석)</option>
                            </select>
                            <small style="color: #666;">Ctrl/Cmd 클릭으로 여러 개 선택</small>
                        </div>
                        <div class="form-group">
                            <label>특별한 날</label>
                            <select id="productSpecialDay" multiple size="6">
                                <option value="일상">일상</option>
                                <option value="건강">건강</option>
                                <option value="연애">연애/사랑</option>
                                <option value="사업">사업/재물</option>
                                <option value="시험">시험/학업</option>
                                <option value="결혼">결혼</option>
                                <option value="출산">출산</option>
                            </select>
                            <small style="color: #666;">Ctrl/Cmd 클릭으로 여러 개 선택</small>
                        </div>
                    </div>
                    
                    <!-- 네이버/쿠팡 링크 -->
                    <div class="form-group full-width">
                        <label>네이버 스마트스토어 링크 *</label>
                        <input type="url" id="productNaverLink" placeholder="https://smartstore.naver.com/simsuk/products/..." required>
                        <small style="color: #d32f2f;">⚠️ 필수 입력: 고객이 제품 클릭 시 이 링크로 이동합니다!</small>
                    </div>
                    
                    <div class="form-group full-width">
                        <label>쿠팡 파트너스 링크 (선택)</label>
                        <input type="url" id="productCoupangLink" placeholder="https://link.coupang.com/...">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="checkbox" id="productFeatured">
                                <span>추천 제품으로 표시</span>
                            </label>
                        </div>
                        <div class="form-group">
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="checkbox" id="productInStock" checked>
                                <span>재고 있음</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeProductModal()">취소</button>
                        <button type="button" class="btn" style="background: #667eea; color: white;" onclick="previewProduct()">
                            <i class="fas fa-eye"></i> 미리보기
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> 저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- 주문 상세 모달 -->
        <div id="orderModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>주문 상세</h2>
                    <button class="modal-close" onclick="document.getElementById('orderModal').classList.remove('active')">&times;</button>
                </div>
                <div id="orderDetails"></div>
            </div>
        </div>
    `;
    
    await loadProducts();
    await loadOrders();
    updateStats();
    updateTabBadges();
    renderProductsTable();
    renderOrdersTable();
    
    // 자동 새로고침 시작
    if (isAutoRefreshEnabled) {
        startAutoRefresh();
    }
    
    console.log('✅ 관리자 페이지 로드 완료');
}

// ===== 데이터 로드 =====
async function loadProducts() {
    try {
        // 1차: localStorage에서 로드 시도
        let stored = localStorage.getItem('adminProducts') || localStorage.getItem('products');
        
        if (stored) {
            products = JSON.parse(stored);
            console.log('✅ localStorage에서 제품 로드:', products.length, '개');
        } else {
            // 2차: 보호된 데이터에서 복구 시도
            const protected = localStorage.getItem('PROTECTED_DATA_DO_NOT_DELETE');
            if (protected) {
                products = JSON.parse(protected);
                console.log('🛡️ 보호된 데이터에서 복구:', products.length, '개');
                saveProducts(); // 즉시 저장
            } else {
                // 3차: 백업에서 복구 시도
                const allKeys = Object.keys(localStorage);
                const backupKeys = allKeys.filter(key => key.startsWith('adminProducts_backup_')).sort().reverse();
                
                if (backupKeys.length > 0) {
                    products = JSON.parse(localStorage.getItem(backupKeys[0]));
                    console.log('💾 백업에서 자동 복구:', products.length, '개');
                    saveProducts(); // 즉시 저장
                } else {
                    // 4차: 빈 배열로 시작
                    products = [];
                    console.log('⚠️ localStorage 비어있음 - 빈 배열로 시작');
                }
            }
        }
    } catch (error) {
        console.error('❌ 제품 로드 오류:', error);
        products = [];
    }
    
    window.adminProducts = products;
    return products;
}

async function loadOrders() {
    try {
        const stored = localStorage.getItem('orders');
        orders = stored ? JSON.parse(stored) : [];
        console.log('✅ localStorage에서 주문 로드:', orders.length, '개');
    } catch (error) {
        console.error('❌ 주문 로드 오류:', error);
        orders = [];
    }
    
    window.adminOrders = orders;
    return orders;
}

// ===== 완벽한 saveProducts() 함수 =====
function saveProducts() {
    try {
        // localStorage 사용 가능 여부 재검증
        const testKey = '__test__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        
        const dataStr = JSON.stringify(products);
        const dataSizeKB = new Blob([dataStr]).size / 1024;
        
        console.log('💾 제품 저장 시도:', products.length, '개, 용량:', dataSizeKB.toFixed(2), 'KB');
        
        // 1. 메인 저장소 (2곳)
        localStorage.setItem('adminProducts', dataStr);
        localStorage.setItem('products', dataStr);
        
        // 2. 보호된 저장소 (절대 삭제 안 됨)
        localStorage.setItem('PROTECTED_DATA_DO_NOT_DELETE', dataStr);
        
        // 3. 타임스탬프 백업 (최근 3개만 유지)
        const timestamp = Date.now();
        localStorage.setItem(`adminProducts_backup_${timestamp}`, dataStr);
        
        const allKeys = Object.keys(localStorage);
        const backupKeys = allKeys.filter(key => key.startsWith('adminProducts_backup_')).sort().reverse();
        backupKeys.slice(3).forEach(key => {
            localStorage.removeItem(key);
            console.log('🗑️ 오래된 백업 삭제:', key);
        });
        
        // 4. 영구 백업 (매 10번째 저장마다)
        const saveCount = parseInt(localStorage.getItem('saveCount') || '0') + 1;
        localStorage.setItem('saveCount', saveCount.toString());
        
        if (saveCount % 10 === 0) {
            localStorage.setItem(`backup_permanent_${timestamp}`, dataStr);
            console.log('💎 영구 백업 생성:', timestamp);
        }
        
        // 5. 저장 완료 검증
        const verification = localStorage.getItem('adminProducts');
        if (!verification || verification !== dataStr) {
            throw new Error('저장 검증 실패!');
        }
        
        // 6. storage 이벤트 발생 (다른 페이지에서 감지)
        window.dispatchEvent(new Event('storage'));
        
        // 7. 저장 용량 업데이트
        updateLocalStorageSize();
        
        console.log('✅ 제품 저장 완료 (검증 성공):', products.length, '개');
        console.log('✅ 5중 보호 완료: adminProducts, products, PROTECTED, 백업 ×', backupKeys.length, ', 영구 백업');
        
        return true;
    } catch (error) {
        console.error('❌ 제품 저장 오류:', error);
        
        // 긴급 복구 시도
        try {
            const protected = localStorage.getItem('PROTECTED_DATA_DO_NOT_DELETE');
            if (protected) {
                localStorage.setItem('adminProducts', protected);
                localStorage.setItem('products', protected);
                console.log('🚨 긴급 복구 완료');
            }
        } catch (e) {
            console.error('❌ 긴급 복구 실패:', e);
        }
        
        alert('⚠️ 제품 저장 중 오류가 발생했습니다!\n\n' + error.message);
        return false;
    }
}

function updateLocalStorageSize() {
    try {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length + key.length;
            }
        }
        const sizeKB = (totalSize / 1024).toFixed(2);
        const el = document.getElementById('localStorageSize');
        if (el) el.textContent = sizeKB;
    } catch (e) {
        console.error('용량 계산 오류:', e);
    }
}

function saveOrders() {
    try {
        localStorage.setItem('orders', JSON.stringify(orders));
        console.log('✅ 주문 저장 완료:', orders.length, '개');
    } catch (error) {
        console.error('❌ 주문 저장 오류:', error);
    }
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
    updateLocalStorageSize();
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
    document.getElementById(tabName)?.classList.add('active');
    
    if (tabName === 'products') {
        renderProductsTable();
    } else if (tabName === 'orders') {
        renderOrdersTable();
    }
}

// ===== 자동 새로고침 =====
function startAutoRefresh() {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
    
    autoRefreshInterval = setInterval(async () => {
        await loadProducts();
        await loadOrders();
        updateStats();
        updateTabBadges();
        
        if (currentTab === 'products') {
            renderProductsTable();
        } else if (currentTab === 'orders') {
            renderOrdersTable();
        }
        
        console.log('🔄 자동 새로고침 완료');
    }, 30000); // 30초마다
}

function toggleAutoRefresh() {
    isAutoRefreshEnabled = !isAutoRefreshEnabled;
    
    if (isAutoRefreshEnabled) {
        startAutoRefresh();
        updateElement('autoRefreshText', '자동 새로고침: ON');
        showToast('자동 새로고침이 활성화되었습니다', 'success');
    } else {
        if (autoRefreshInterval) clearInterval(autoRefreshInterval);
        updateElement('autoRefreshText', '자동 새로고침: OFF');
        showToast('자동 새로고침이 비활성화되었습니다', 'info');
    }
}

// ===== 제품 테이블 =====
function renderProductsTable() {
    const container = document.getElementById('productsTableContainer');
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><h3>등록된 제품이 없습니다</h3><p>+ 새 제품 추가 버튼을 눌러 첫 제품을 등록하세요</p></div>';
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
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(p => {
                        const mainImage = p.image || p.image_url || 'https://placehold.co/60x60?text=No+Image';
                        const totalStock = p.total_stock || 0;
                        const stockInfo = totalStock > 0 
                            ? `<span style="color: #28a745; font-weight: 600;">${totalStock}개</span>`
                            : '<span style="color: #dc3545; font-weight: 600;">품절</span>';
                        
                        return `
                        <tr>
                            <td>
                                <img src="${mainImage}" alt="${p.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 2px solid #2c5f4f;">
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
                        <th>제품</th>
                        <th>금액</th>
                        <th>상태</th>
                        <th>주문일</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(order => {
                        const statusColors = {
                            '접수': '#007bff',
                            '확인중': '#ffc107',
                            '배송중': '#17a2b8',
                            '완료': '#28a745',
                            '취소': '#dc3545'
                        };
                        const statusColor = statusColors[order.status] || '#6c757d';
                        
                        return `
                        <tr>
                            <td><code>#${order.id}</code></td>
                            <td>${order.customer_name}</td>
                            <td>${order.products?.length || 0}개</td>
                            <td><strong>${(order.total_amount || 0).toLocaleString()}원</strong></td>
                            <td><span class="badge" style="background: ${statusColor};">${order.status}</span></td>
                            <td>${new Date(order.order_date).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="viewOrder(${order.id})">
                                    <i class="fas fa-eye"></i> 상세
                                </button>
                            </td>
                        </tr>
                    `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ===== 제품 추가/수정 =====
function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    const statusDiv = document.getElementById('uploadStatus');
    currentEditId = productId;
    
    // 상태 초기화
    statusDiv.innerHTML = '';
    
    // 이미지 미리보기 초기화
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
            const uploadButton = fileInput1 ? fileInput1.previousElementSibling : null;
            
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
        
        // 파일 input 초기화
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
    
    // 네이버 링크 필수 검증
    const naverLink = document.getElementById('productNaverLink').value;
    if (!naverLink) {
        showToast('네이버 스마트스토어 링크를 입력해주세요!', 'error');
        document.getElementById('productNaverLink').focus();
        return;
    }
    
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
        id: currentEditId ? currentEditId : Date.now(),
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        image: images[0],
        image_url: images[0],
        size_stock: sizeStock,
        total_stock: totalStock,
        materials: document.getElementById('productMaterials').value,
        benefits: document.getElementById('productBenefits').value,
        description: document.getElementById('productDescription').value,
        birthstone: selectedBirthstones,
        special_day: selectedSpecialDays,
        naver_link: naverLink,
        coupang_link: document.getElementById('productCoupangLink').value || '',
        naverLink: naverLink,  // 하위 호환
        coupangLink: document.getElementById('productCoupangLink').value || '',  // 하위 호환
        featured: document.getElementById('productFeatured').checked,
        in_stock: totalStock > 0,
        updated_at: new Date().toISOString()
    };
    
    if (currentEditId) {
        const index = products.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
            productData.created_at = products[index].created_at;
            products[index] = productData;
        }
    } else {
        productData.created_at = new Date().toISOString();
        products.push(productData);
    }
    
    // ⭐ 저장 및 검증
    const saveSuccess = saveProducts();
    
    if (saveSuccess) {
        updateStats();
        updateTabBadges();
        renderProductsTable();
        closeProductModal();
        
        const message = currentEditId ? '제품이 수정되었습니다' : '제품이 추가되었습니다';
        showToast(message + ` ✅\n메인 이미지 ${images.length}장, 총 재고 ${totalStock}개\n네이버 링크: ${naverLink}`, 'success');
        
        console.log('✅ 제품 저장 완료:', productData);
        console.log('✅ localStorage 검증:', localStorage.getItem('adminProducts') !== null);
    } else {
        showToast('⚠️ 제품 저장에 실패했습니다. 다시 시도해주세요.', 'error');
    }
}

function editProduct(id) {
    openProductModal(id);
}

function deleteProduct(id) {
    if (!confirm('정말로 이 제품을 삭제하시겠습니까?')) return;
    
    products = products.filter(p => p.id !== id);
    saveProducts();
    updateStats();
    updateTabBadges();
    renderProductsTable();
    showToast('제품이 삭제되었습니다', 'success');
}

// ===== 제품 미리보기 =====
function previewProduct() {
    const productName = document.getElementById('productName').value;
    
    if (!productName) {
        showToast('제품명을 먼저 입력해주세요', 'warning');
        return;
    }
    
    showToast('미리보기 기능은 준비 중입니다', 'info');
}

// ===== 이미지 업로드 =====
const MAX_FILE_SIZE = 500 * 1024; // 500KB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

async function handleImageUpload(event, imageIndex = 1) {
    const file = event.target.files[0];
    if (!file) return;
    
    const statusDiv = document.getElementById('uploadStatus');
    
    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
        const fileSizeKB = (file.size / 1024).toFixed(2);
        showToast(`⚠️ 파일 크기가 너무 큽니다!\n현재: ${fileSizeKB}KB / 최대: 500KB\n\nhttps://tinypng.com/ 에서 압축해주세요`, 'error');
        event.target.value = '';
        return;
    }
    
    // 파일 형식 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
        showToast('⚠️ JPG, PNG, WebP 형식만 업로드 가능합니다', 'error');
        event.target.value = '';
        return;
    }
    
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 이미지 업로드 중...';
    statusDiv.style.color = '#007bff';
    
    try {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const base64 = e.target.result;
            const base64SizeKB = (new Blob([base64]).size / 1024).toFixed(2);
            
            // Base64 저장
            document.getElementById(`productImageUrl${imageIndex}`).value = base64;
            
            // 미리보기 표시
            const previewImg = document.getElementById(`previewImg${imageIndex}`);
            const imagePreview = document.getElementById(`imagePreview${imageIndex}`);
            const uploadButton = event.target.previousElementSibling;
            
            if (previewImg) previewImg.src = base64;
            if (imagePreview) imagePreview.style.display = 'block';
            if (uploadButton) uploadButton.style.display = 'none';
            
            statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> 업로드 완료! (${base64SizeKB} KB)`;
            statusDiv.style.color = '#28a745';
            
            showToast('이미지 업로드 완료!', 'success');
            console.log('✅ 이미지 업로드:', base64SizeKB, 'KB');
        };
        
        reader.onerror = function() {
            statusDiv.innerHTML = '<i class="fas fa-times-circle"></i> 업로드 실패';
            statusDiv.style.color = '#dc3545';
            showToast('이미지 업로드 실패', 'error');
            event.target.value = '';
        };
        
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('이미지 업로드 오류:', error);
        showToast('이미지 업로드 중 오류가 발생했습니다', 'error');
        event.target.value = '';
    }
}

function removeImage(imageIndex) {
    document.getElementById(`productImageUrl${imageIndex}`).value = '';
    const imagePreview = document.getElementById(`imagePreview${imageIndex}`);
    if (imagePreview) imagePreview.style.display = 'none';
}

// ===== 주문 상세 =====
function viewOrder(id) {
    const order = orders.find(o => o.id === id);
    if (!order) {
        alert('주문을 찾을 수 없습니다');
        return;
    }
    
    const modal = document.getElementById('orderModal');
    const detailsContainer = document.getElementById('orderDetails');
    
    detailsContainer.innerHTML = `
        <div style="padding: 20px;">
            <h3>주문 #${order.id}</h3>
            <p><strong>주문일:</strong> ${new Date(order.order_date).toLocaleString()}</p>
            <p><strong>고객명:</strong> ${order.customer_name}</p>
            <p><strong>연락처:</strong> ${order.phone}</p>
            <p><strong>주소:</strong> ${order.address}</p>
            <p><strong>상태:</strong> <span class="badge">${order.status}</span></p>
            <p><strong>총 금액:</strong> ${(order.total_amount || 0).toLocaleString()}원</p>
        </div>
    `;
    
    modal.classList.add('active');
}

// ===== Toast 알림 =====
function showToast(message, type = 'info') {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    toast.innerHTML = `<i class="fas ${icons[type]}"></i> ${message.replace(/\n/g, '<br>')}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// ===== 전역 함수 등록 =====
window.logout = logout;
window.toggleAutoRefresh = toggleAutoRefresh;
window.switchTab = switchTab;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.handleProductSubmit = handleProductSubmit;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.previewProduct = previewProduct;
window.handleImageUpload = handleImageUpload;
window.removeImage = removeImage;
window.viewOrder = viewOrder;
window.handleLogin = handleLogin;

console.log('✅ 심석 관리자 localStorage 완벽 버전 로드 완료!');
