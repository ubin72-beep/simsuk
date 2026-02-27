// ========================================
// 대시보드 통계 (그래프 없이 카드형 통계로 변경)
// ========================================

// 대시보드 로드
async function loadDashboard() {
    console.log('📊 [Dashboard] 대시보드 로딩 시작...');
    try {
        await Promise.all([
            loadSalesStats(),      // 매출 통계 (그래프 대신 카드)
            loadCategoryStats(),   // 카테고리 통계 (그래프 대신 카드)
            loadTopProducts(),     // 인기 제품
            loadRecentProducts(),  // 최근 추가한 제품
            loadRecentOrders()     // 최근 주문
        ]);
        console.log('✅ [Dashboard] 대시보드 로딩 완료');
    } catch (error) {
        console.error('❌ [Dashboard] 대시보드 로딩 오류:', error);
    }
}

// 매출 통계 (그래프 대신 카드형)
async function loadSalesStats() {
    console.log('💰 [Dashboard] 매출 통계 로딩...');
    
    const orders = window.adminOrders || [];
    
    if (orders.length === 0) {
        console.log('⚠️ [Dashboard] 주문 데이터 없음');
        // 빈 상태 표시
        const container = document.getElementById('salesChart');
        if (container) {
            container.parentElement.innerHTML = `
                <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
                    <i class="fas fa-chart-line" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i>
                    <h3 style="color: #999; font-size: 1.1rem;">매출 데이터 없음</h3>
                    <p style="color: #ccc; margin-top: 10px;">주문이 발생하면 매출 통계가 표시됩니다</p>
                </div>
            `;
        }
        return;
    }
    
    // 오늘, 이번 주, 이번 달 매출 계산
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // 오늘 매출
    const todaySales = orders
        .filter(order => {
            const orderDate = new Date(order.order_date || order.created_at);
            return orderDate.toDateString() === today.toDateString() && order.status !== '취소';
        })
        .reduce((sum, order) => sum + (order.total_amount || 0), 0);
    
    // 이번 주 매출
    const weekSales = orders
        .filter(order => {
            const orderDate = new Date(order.order_date || order.created_at);
            return orderDate >= startOfWeek && order.status !== '취소';
        })
        .reduce((sum, order) => sum + (order.total_amount || 0), 0);
    
    // 이번 달 매출
    const monthSales = orders
        .filter(order => {
            const orderDate = new Date(order.order_date || order.created_at);
            return orderDate >= startOfMonth && order.status !== '취소';
        })
        .reduce((sum, order) => sum + (order.total_amount || 0), 0);
    
    // 전체 매출
    const totalSales = orders
        .filter(order => order.status !== '취소')
        .reduce((sum, order) => sum + (order.total_amount || 0), 0);
    
    console.log(`✅ [Dashboard] 매출 통계: 오늘 ${todaySales.toLocaleString()}원, 이번주 ${weekSales.toLocaleString()}원, 이번달 ${monthSales.toLocaleString()}원`);
    
    // 카드형 통계 표시
    const container = document.getElementById('salesChart');
    if (container) {
        container.parentElement.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin-bottom: 20px; color: #2c5f4f; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-chart-line"></i> 매출 통계
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <!-- 오늘 매출 -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; color: white;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <i class="fas fa-calendar-day" style="font-size: 1.5rem; opacity: 0.8;"></i>
                            <span style="font-size: 0.9rem; opacity: 0.9;">오늘 매출</span>
                        </div>
                        <div style="font-size: 1.8rem; font-weight: bold;">${todaySales.toLocaleString()}원</div>
                    </div>
                    
                    <!-- 이번 주 매출 -->
                    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 12px; color: white;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <i class="fas fa-calendar-week" style="font-size: 1.5rem; opacity: 0.8;"></i>
                            <span style="font-size: 0.9rem; opacity: 0.9;">이번 주 매출</span>
                        </div>
                        <div style="font-size: 1.8rem; font-weight: bold;">${weekSales.toLocaleString()}원</div>
                    </div>
                    
                    <!-- 이번 달 매출 -->
                    <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; border-radius: 12px; color: white;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <i class="fas fa-calendar-alt" style="font-size: 1.5rem; opacity: 0.8;"></i>
                            <span style="font-size: 0.9rem; opacity: 0.9;">이번 달 매출</span>
                        </div>
                        <div style="font-size: 1.8rem; font-weight: bold;">${monthSales.toLocaleString()}원</div>
                    </div>
                    
                    <!-- 전체 매출 -->
                    <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 20px; border-radius: 12px; color: white;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <i class="fas fa-coins" style="font-size: 1.5rem; opacity: 0.8;"></i>
                            <span style="font-size: 0.9rem; opacity: 0.9;">전체 매출</span>
                        </div>
                        <div style="font-size: 1.8rem; font-weight: bold;">${totalSales.toLocaleString()}원</div>
                    </div>
                </div>
            </div>
        `;
    }
}

// 카테고리 통계 (그래프 대신 카드형)
async function loadCategoryStats() {
    console.log('📦 [Dashboard] 카테고리 통계 로딩...');
    
    const products = window.adminProducts || [];
    
    if (products.length === 0) {
        console.log('⚠️ [Dashboard] 제품 데이터 없음');
        const container = document.getElementById('categoryChart');
        if (container) {
            container.parentElement.innerHTML = `
                <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
                    <i class="fas fa-chart-pie" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i>
                    <h3 style="color: #999; font-size: 1.1rem;">카테고리 데이터 없음</h3>
                    <p style="color: #ccc; margin-top: 10px;">제품이 등록되면 카테고리 통계가 표시됩니다</p>
                </div>
            `;
        }
        return;
    }
    
    // 카테고리별 제품 수 계산
    const categoryCount = {};
    products.forEach(product => {
        const category = product.category || '기타';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    console.log(`✅ [Dashboard] 카테고리 통계:`, categoryCount);
    
    // 카테고리별 색상
    const categoryColors = {
        '목걸이': { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: 'fa-gem' },
        '팔찌': { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: 'fa-bracelet' },
        '반지': { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: 'fa-ring' },
        '핸드폰 줄': { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', icon: 'fa-mobile-alt' },
        '기타': { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', icon: 'fa-box' }
    };
    
    // 카드형 통계 표시
    const container = document.getElementById('categoryChart');
    if (container) {
        const categoryCards = Object.entries(categoryCount)
            .sort((a, b) => b[1] - a[1])
            .map(([category, count]) => {
                const style = categoryColors[category] || categoryColors['기타'];
                const percentage = ((count / products.length) * 100).toFixed(1);
                return `
                    <div style="background: ${style.bg}; padding: 20px; border-radius: 12px; color: white;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <i class="fas ${style.icon}" style="font-size: 1.5rem; opacity: 0.8;"></i>
                            <span style="font-size: 0.9rem; opacity: 0.9;">${category}</span>
                        </div>
                        <div style="font-size: 2rem; font-weight: bold; margin-bottom: 5px;">${count}개</div>
                        <div style="font-size: 0.85rem; opacity: 0.8;">${percentage}%</div>
                    </div>
                `;
            }).join('');
        
        container.parentElement.innerHTML = `
            <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin-bottom: 20px; color: #2c5f4f; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-chart-pie"></i> 카테고리별 제품 분포
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
                    ${categoryCards}
                </div>
            </div>
        `;
    }
}

// 인기 제품 TOP 5
async function loadTopProducts() {
    console.log('🏆 [Dashboard] 인기 제품 TOP 5 로딩...');
    
    const products = window.adminProducts || [];
    const orders = window.adminOrders || [];
    
    if (products.length === 0) {
        console.log('⚠️ [Dashboard] 제품 데이터 없음');
        return;
    }
    
    // 제품별 판매 횟수 계산
    const productSales = {};
    orders.forEach(order => {
        if (order.status === '취소') return;
        
        let orderProducts = [];
        try {
            if (typeof order.products === 'string') {
                orderProducts = JSON.parse(order.products);
            } else if (Array.isArray(order.products)) {
                orderProducts = order.products;
            }
        } catch (e) {
            console.warn('제품 파싱 오류:', e);
        }
        
        orderProducts.forEach(item => {
            const productId = item.id || item.product_id;
            productSales[productId] = (productSales[productId] || 0) + (item.quantity || 1);
        });
    });
    
    // 판매량 기준 상위 5개 제품
    const topProducts = products
        .map(product => ({
            ...product,
            sales: productSales[product.id] || 0
        }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);
    
    console.log(`✅ [Dashboard] 인기 제품 TOP 5:`, topProducts.map(p => p.name));
    
    // HTML 렌더링
    const container = document.getElementById('topProductsList');
    if (!container) return;
    
    if (topProducts.length === 0 || topProducts.every(p => p.sales === 0)) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #999;">
                <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <p>판매 데이터가 없습니다</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = topProducts.map((product, index) => `
        <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: ${index % 2 === 0 ? '#f8f9fa' : 'white'}; border-radius: 10px; margin-bottom: 10px;">
            <div style="font-size: 1.5rem; font-weight: bold; color: ${index === 0 ? '#d4af37' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#999'}; width: 30px; text-align: center;">
                ${index + 1}
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: #333; margin-bottom: 5px;">${product.name}</div>
                <div style="font-size: 0.85rem; color: #999;">
                    ${product.price.toLocaleString()}원 · ${product.category}
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 1.2rem; font-weight: bold; color: #2c5f4f;">${product.sales}개</div>
                <div style="font-size: 0.8rem; color: #999;">판매</div>
            </div>
        </div>
    `).join('');
}

// 최근 추가한 제품
async function loadRecentProducts() {
    console.log('📦 [Dashboard] 최근 제품 로딩...');
    
    const products = window.adminProducts || [];
    
    if (products.length === 0) {
        console.log('⚠️ [Dashboard] 제품 데이터 없음');
        return;
    }
    
    // 최근 5개 제품 (created_at 기준)
    const recentProducts = [...products]
        .sort((a, b) => {
            const dateA = new Date(a.created_at || 0);
            const dateB = new Date(b.created_at || 0);
            return dateB - dateA;
        })
        .slice(0, 5);
    
    console.log(`✅ [Dashboard] 최근 제품 ${recentProducts.length}개`);
    
    // HTML 렌더링
    const container = document.getElementById('recentProductsList');
    if (!container) return;
    
    container.innerHTML = recentProducts.map(product => {
        const createdDate = product.created_at ? new Date(product.created_at) : new Date();
        const timeAgo = getTimeAgo(createdDate);
        
        return `
            <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: white; border: 1px solid #e0e0e0; border-radius: 10px; margin-bottom: 10px;">
                <img src="${product.image_url || 'https://placehold.co/60x60/2c5f4f/ffffff?text=No+Image'}" 
                     alt="${product.name}" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #333; margin-bottom: 5px;">${product.name}</div>
                    <div style="font-size: 0.85rem; color: #999;">
                        ${product.price.toLocaleString()}원 · ${product.category}
                    </div>
                </div>
                <div style="text-align: right; font-size: 0.8rem; color: #999;">
                    ${timeAgo}
                </div>
            </div>
        `;
    }).join('');
}

// 최근 주문
async function loadRecentOrders() {
    console.log('📋 [Dashboard] 최근 주문 로딩...');
    
    const orders = window.adminOrders || [];
    
    if (orders.length === 0) {
        console.log('⚠️ [Dashboard] 주문 데이터 없음');
        const container = document.getElementById('recentOrdersList');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <p>주문 데이터가 없습니다</p>
                </div>
            `;
        }
        return;
    }
    
    // 최근 5개 주문
    const recentOrders = [...orders]
        .sort((a, b) => {
            const dateA = new Date(a.order_date || a.created_at || 0);
            const dateB = new Date(b.order_date || b.created_at || 0);
            return dateB - dateA;
        })
        .slice(0, 5);
    
    console.log(`✅ [Dashboard] 최근 주문 ${recentOrders.length}개`);
    
    // HTML 렌더링
    const container = document.getElementById('recentOrdersList');
    if (!container) return;
    
    container.innerHTML = recentOrders.map(order => {
        const orderDate = new Date(order.order_date || order.created_at);
        const timeAgo = getTimeAgo(orderDate);
        
        const statusColors = {
            '대기': '#ff9800',
            '확인중': '#2196f3',
            '배송준비': '#9c27b0',
            '배송중': '#00bcd4',
            '배송완료': '#4caf50',
            '취소': '#f44336'
        };
        
        const statusColor = statusColors[order.status] || '#999';
        
        return `
            <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: white; border: 1px solid #e0e0e0; border-radius: 10px; margin-bottom: 10px;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #333; margin-bottom: 5px;">
                        ${order.order_number || 'N/A'}
                    </div>
                    <div style="font-size: 0.85rem; color: #999;">
                        ${order.customer_name || '고객명 없음'} · ${(order.total_amount || 0).toLocaleString()}원
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="display: inline-block; padding: 5px 12px; background: ${statusColor}; color: white; border-radius: 20px; font-size: 0.8rem; font-weight: 600; margin-bottom: 5px;">
                        ${order.status || '대기'}
                    </div>
                    <div style="font-size: 0.8rem; color: #999;">
                        ${timeAgo}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 시간 경과 계산
function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
}

// ===== 전역 함수 노출 =====
window.loadDashboard = loadDashboard;
window.loadSalesStats = loadSalesStats;
window.loadCategoryStats = loadCategoryStats;
window.loadTopProducts = loadTopProducts;
window.loadRecentProducts = loadRecentProducts;
window.loadRecentOrders = loadRecentOrders;

console.log('✅ [Admin] admin-dashboard.js 로드 완료 (그래프 제거, 카드형 통계) - 모든 함수 전역 노출됨');
