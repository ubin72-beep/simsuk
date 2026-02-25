// ========================================
// 알림 시스템 및 자동 새로고침
// ========================================

let autoRefreshInterval = null;
let lastOrderCount = 0;
let autoRefreshEnabled = true;

// 자동 새로고침 시작
function startAutoRefresh() {
    // 기존 인터벌 정리
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    // 30초마다 주문 확인
    autoRefreshInterval = setInterval(async () => {
        if (!autoRefreshEnabled) return;
        
        try {
            const response = await fetch('tables/orders?limit=1000');
            const result = await response.json();
            
            if (result.data) {
                const currentOrderCount = result.data.length;
                
                // 새 주문 감지
                if (lastOrderCount > 0 && currentOrderCount > lastOrderCount) {
                    const newOrdersCount = currentOrderCount - lastOrderCount;
                    showNewOrderNotification(newOrdersCount);
                    
                    // 주문 관리 탭이 활성화되어 있으면 자동 새로고침
                    const ordersTab = document.getElementById('ordersTab');
                    if (ordersTab && ordersTab.classList.contains('active')) {
                        loadOrders();
                    }
                    
                    // 대시보드 탭이 활성화되어 있으면 새로고침
                    const dashboardTab = document.getElementById('dashboardTab');
                    if (dashboardTab && dashboardTab.classList.contains('active')) {
                        loadDashboard();
                    }
                    
                    // 통계 업데이트
                    updateOrderStats();
                }
                
                lastOrderCount = currentOrderCount;
            }
        } catch (error) {
            console.error('자동 새로고침 오류:', error);
        }
    }, 30000); // 30초
    
    console.log('✅ 자동 새로고침 시작 (30초 간격)');
}

// 자동 새로고침 중지
function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
        console.log('⏸️ 자동 새로고침 중지');
    }
}

// 자동 새로고침 토글
function toggleAutoRefresh() {
    autoRefreshEnabled = !autoRefreshEnabled;
    const btn = document.getElementById('autoRefreshToggle');
    if (btn) {
        if (autoRefreshEnabled) {
            btn.innerHTML = '<i class="fas fa-pause"></i> 자동새로고침 중지';
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
            showToast('자동 새로고침이 활성화되었습니다', 'success');
        } else {
            btn.innerHTML = '<i class="fas fa-play"></i> 자동새로고침 시작';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
            showToast('자동 새로고침이 중지되었습니다', 'warning');
        }
    }
}

// 새 주문 알림 표시
function showNewOrderNotification(count) {
    // 브라우저 알림 권한 확인
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('심석 관리자 - 새 주문 도착', {
            body: `새로운 주문 ${count}건이 접수되었습니다!`,
            icon: 'https://cdn-icons-png.flaticon.com/512/891/891462.png',
            badge: 'https://cdn-icons-png.flaticon.com/512/891/891462.png',
            tag: 'new-order',
            requireInteraction: true
        });
    }
    
    // 화면 알림
    showOrderAlert(count);
    
    // 사운드 알림 (선택적)
    playNotificationSound();
}

// 화면 알림 표시
function showOrderAlert(count) {
    const existingAlert = document.getElementById('orderAlert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.id = 'orderAlert';
    alert.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 2000;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: slideInRight 0.5s ease, pulse 2s infinite;
        cursor: pointer;
        min-width: 300px;
    `;
    
    alert.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <div style="font-size: 2.5rem;">🔔</div>
            <div>
                <h3 style="margin: 0 0 5px 0; font-size: 1.1rem;">새 주문 도착!</h3>
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">
                    ${count}건의 새로운 주문이 접수되었습니다
                </p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 12px; border-radius: 6px; cursor: pointer; margin-left: auto;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    alert.onclick = function() {
        switchTab('orders', null);
        this.remove();
    };
    
    document.body.appendChild(alert);
    
    // 10초 후 자동 제거
    setTimeout(() => {
        if (alert.parentElement) {
            alert.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => alert.remove(), 500);
        }
    }, 10000);
}

// 알림 사운드 재생
function playNotificationSound() {
    try {
        // Web Audio API를 사용한 간단한 알림음
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        // 사운드 재생 실패 시 무시
        console.log('알림 사운드 재생 실패:', error);
    }
}

// 브라우저 알림 권한 요청
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showToast('브라우저 알림이 활성화되었습니다', 'success');
            }
        });
    }
}

// 초기 주문 수 설정
async function initializeAutoRefresh() {
    try {
        const response = await fetch('tables/orders?limit=1000');
        const result = await response.json();
        if (result.data) {
            lastOrderCount = result.data.length;
        }
    } catch (error) {
        console.error('초기 주문 수 로딩 오류:', error);
    }
    
    startAutoRefresh();
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        50% {
            box-shadow: 0 10px 40px rgba(102, 126, 234, 0.5);
        }
    }
`;
document.head.appendChild(style);
