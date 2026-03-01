// ============================================
// 심석 관리자 페이지 v3.0 (완전 재구축)
// 작성일: 2026-03-01
// ============================================

console.log('✅ 심석 관리자 v3.0 로드 시작...');

// ============================================
// 1. 전역 변수
// ============================================
const ADMIN_PASSWORD = 'admin';
let products = [];
let orders = [];

// ============================================
// 2. 초기화
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 DOM 로드 완료, 인증 확인 중...');
    checkAuth();
});

// ============================================
// 3. 인증 관련
// ============================================
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    
    if (isLoggedIn === 'true') {
        console.log('✅ 로그인 상태 확인됨');
        showAdminPage();
    } else {
        console.log('❌ 미로그인 상태, 로그인 폼 표시');
        showLoginForm();
    }
}

function showLoginForm() {
    document.body.innerHTML = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 50px rgba(0,0,0,0.3); max-width: 400px; width: 90%;">
                <h1 style="text-align: center; color: #2c5f4f; margin-bottom: 30px;">
                    <i class="fas fa-gem"></i> 심석 관리자
                </h1>
                <form onsubmit="handleLogin(event)" style="display: flex; flex-direction: column; gap: 20px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 600;">비밀번호</label>
                        <input type="password" id="password" placeholder="비밀번호를 입력하세요" 
                               style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px;"
                               required autofocus>
                    </div>
                    <button type="submit" style="width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer;">
                        로그인
                    </button>
                    <p style="text-align: center; color: #999; font-size: 14px; margin: 0;">기본 비밀번호: admin</p>
                </form>
            </div>
        </div>
    `;
}

function handleLogin(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    
    if (password === ADMIN_PASSWORD) {
        console.log('✅ 로그인 성공');
        sessionStorage.setItem('adminLoggedIn', 'true');
        location.reload();
    } else {
        alert('❌ 비밀번호가 올바르지 않습니다.');
    }
}

function logout() {
    console.log('🔄 로그아웃 중...');
    if (confirm('로그아웃 하시겠습니까?')) {
        sessionStorage.removeItem('adminLoggedIn');
        location.reload();
    }
}

// ============================================
// 4. 관리자 페이지 표시
// ============================================
function showAdminPage() {
    console.log('📊 관리자 페이지 로드 중...');
    
    // 데이터 로드
    loadProducts();
    loadOrders();
    
    // 통계 업데이트
    setTimeout(updateStats, 100);
}

// ============================================
// 5. 데이터 로드
// ============================================
function loadProducts() {
    console.log('📦 제품 데이터 로드 중...');
    
    const stored = localStorage.getItem('adminProducts');
    
    if (stored) {
        try {
            products = JSON.parse(stored);
            console.log(`✅ 제품 ${products.length}개 로드됨`);
        } catch (e) {
            console.error('❌ 제품 데이터 파싱 오류:', e);
            products = getDemoProducts();
        }
    } else {
        console.log('ℹ️ 저장된 제품 없음, 데모 데이터 사용');
        products = getDemoProducts();
        localStorage.setItem('adminProducts', JSON.stringify(products));
    }
    
    // 전역 변수로 노출
    window.adminProducts = products;
    
    return products;
}

function loadOrders() {
    console.log('📋 주문 데이터 로드 중...');
    
    const stored = localStorage.getItem('orders');
    
    if (stored) {
        try {
            orders = JSON.parse(stored);
            console.log(`✅ 주문 ${orders.length}개 로드됨`);
        } catch (e) {
            console.error('❌ 주문 데이터 파싱 오류:', e);
            orders = [];
        }
    } else {
        console.log('ℹ️ 저장된 주문 없음');
        orders = [];
    }
    
    // 전역 변수로 노출
    window.adminOrders = orders;
    
    return orders;
}

function getDemoProducts() {
    return [
        {
            id: 1,
            name: '헤마타이트 목걸이',
            category: '목걸이',
            price: 69000,
            image_url: 'https://placehold.co/400x400/2c5f4f/ffffff?text=Hematite+Necklace',
            description: '강력한 자기력의 헤마타이트 목걸이',
            materials: '헤마타이트',
            benefits: '혈액순환 개선, 스트레스 완화',
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
            image_url: 'https://placehold.co/400x400/2c5f4f/ffffff?text=Hematite+Bracelet',
            description: '데일리 착용 가능한 헤마타이트 팔찌',
            materials: '헤마타이트',
            benefits: '자기력 에너지, 혈액순환',
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
            image_url: 'https://placehold.co/400x400/2c5f4f/ffffff?text=Hematite+Ring',
            description: '심플하고 스타일리시한 헤마타이트 반지',
            materials: '헤마타이트',
            benefits: '집중력 향상, 에너지 균형',
            featured: false,
            in_stock: true,
            birthstone_months: [1, 10],
            special_occasions: ['일상', '선물']
        },
        {
            id: 4,
            name: '가넷 목걸이',
            category: '목걸이',
            price: 79000,
            image_url: 'https://placehold.co/400x400/8b0000/ffffff?text=Garnet+Necklace',
            description: '1월 탄생석 가넷 목걸이',
            materials: '가넷, 실버',
            benefits: '정열, 생명력 강화',
            featured: true,
            in_stock: true,
            birthstone_months: [1],
            special_occasions: ['생일', '기념일']
        },
        {
            id: 5,
            name: '자수정 팔찌',
            category: '팔찌',
            price: 59000,
            image_url: 'https://placehold.co/400x400/9966cc/ffffff?text=Amethyst+Bracelet',
            description: '2월 탄생석 자수정 팔찌',
            materials: '자수정',
            benefits: '평온, 지혜',
            featured: false,
            in_stock: true,
            birthstone_months: [2],
            special_occasions: ['생일', '힐링']
        },
        {
            id: 6,
            name: '아쿠아마린 반지',
            category: '반지',
            price: 89000,
            image_url: 'https://placehold.co/400x400/7fffd4/000000?text=Aquamarine+Ring',
            description: '3월 탄생석 아쿠아마린 반지',
            materials: '아쿠아마린, 실버',
            benefits: '용기, 평온',
            featured: false,
            in_stock: true,
            birthstone_months: [3],
            special_occasions: ['생일', '여행']
        }
    ];
}

// ============================================
// 6. 통계 업데이트
// ============================================
function updateStats() {
    console.log('📊 통계 업데이트 중...');
    
    // 전체 제품
    const totalProducts = products.length;
    updateElement('totalProducts', totalProducts);
    
    // 카테고리별
    const necklaceCount = products.filter(p => p.category === '목걸이').length;
    const braceletCount = products.filter(p => p.category === '팔찌').length;
    const ringCount = products.filter(p => p.category === '반지').length;
    const phoneCount = products.filter(p => p.category === '핸드폰 줄').length;
    
    updateElement('necklaceCount', necklaceCount);
    updateElement('braceletCount', braceletCount);
    updateElement('ringCount', ringCount);
    updateElement('phoneCount', phoneCount);
    
    // 주문 통계
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === '접수').length;
    
    updateElement('totalOrders', totalOrders);
    updateElement('pendingOrders', pendingOrders);
    
    console.log(`✅ 통계 업데이트 완료: 제품 ${totalProducts}개, 주문 ${totalOrders}개`);
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// ============================================
// 7. 자동 새로고침
// ============================================
let autoRefreshInterval = null;
let isAutoRefreshEnabled = true;

function toggleAutoRefresh() {
    console.log('🔄 자동 새로고침 토글');
    
    isAutoRefreshEnabled = !isAutoRefreshEnabled;
    const btn = document.getElementById('autoRefreshToggle');
    
    if (!btn) {
        console.error('❌ autoRefreshToggle 버튼을 찾을 수 없음');
        return;
    }
    
    if (isAutoRefreshEnabled) {
        btn.innerHTML = '<i class="fas fa-sync fa-spin"></i> 자동새로고침 중';
        btn.className = 'btn btn-primary';
        console.log('✅ 자동 새로고침 활성화');
        showToast('자동 새로고침이 활성화되었습니다', 'success');
    } else {
        btn.innerHTML = '<i class="fas fa-sync"></i> 자동새로고침 꺼짐';
        btn.className = 'btn btn-outline';
        console.log('⏸️ 자동 새로고침 비활성화');
        showToast('자동 새로고침이 비활성화되었습니다', 'info');
    }
}

function startAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    autoRefreshInterval = setInterval(() => {
        if (isAutoRefreshEnabled) {
            console.log('🔄 자동 새로고침 실행');
            loadProducts();
            loadOrders();
            updateStats();
        }
    }, 30000); // 30초
    
    console.log('✅ 자동 새로고침 시작 (30초 간격)');
}

// ============================================
// 8. 토스트 메시지
// ============================================
function showToast(message, type = 'info') {
    console.log(`📢 토스트: [${type}] ${message}`);
    
    // 기존 토스트 제거
    const existing = document.getElementById('toast');
    if (existing) {
        existing.remove();
    }
    
    // 새 토스트 생성
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    
    // 타입별 색상
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    toast.style.background = colors[type] || colors.info;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 3초 후 제거
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
}

// ============================================
// 9. 전역 함수 노출
// ============================================
window.handleLogin = handleLogin;
window.logout = logout;
window.toggleAutoRefresh = toggleAutoRefresh;
window.updateStats = updateStats;
window.showToast = showToast;
window.adminProducts = products;
window.adminOrders = orders;

console.log('✅ 심석 관리자 v3.0 로드 완료');

// ============================================
// 10. 자동 새로고침 시작
// ============================================
if (sessionStorage.getItem('adminLoggedIn') === 'true') {
    setTimeout(startAutoRefresh, 1000);
}
