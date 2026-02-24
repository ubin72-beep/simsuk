// ========================================
// 대시보드 통계 및 차트
// ========================================

let salesChart = null;
let categoryChart = null;

// 대시보드 로드
async function loadDashboard() {
    try {
        await Promise.all([
            loadSalesChart(),
            loadCategoryChart(),
            loadTopProducts(),
            loadRecentOrders()
        ]);
    } catch (error) {
        console.error('대시보드 로딩 오류:', error);
    }
}

// 매출 그래프 (최근 7일)
async function loadSalesChart() {
    try {
        const response = await fetch('tables/orders?limit=1000');
        const result = await response.json();
        
        if (!result.data || result.data.length === 0) {
            return;
        }
        
        // 최근 7일 날짜 생성
        const days = [];
        const salesData = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            days.push(`${date.getMonth() + 1}/${date.getDate()}`);
            
            // 해당 날짜의 매출 계산
            const dayOrders = result.data.filter(order => {
                const orderDate = new Date(order.order_date || order.created_at);
                return orderDate.toISOString().split('T')[0] === dateStr &&
                       order.status !== '취소';
            });
            
            const dayTotal = dayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
            salesData.push(dayTotal);
        }
        
        // 차트 생성
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;
        
        if (salesChart) {
            salesChart.destroy();
        }
        
        salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: '매출액 (원)',
                    data: salesData,
                    borderColor: '#2c5f4f',
                    backgroundColor: 'rgba(44, 95, 79, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: '#d4af37',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return '매출: ' + context.parsed.y.toLocaleString('ko-KR') + '원';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('ko-KR') + '원';
                            }
                        }
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('매출 그래프 로딩 오류:', error);
    }
}

// 카테고리별 판매 비율
async function loadCategoryChart() {
    try {
        const response = await fetch('tables/orders?limit=1000');
        const result = await response.json();
        
        if (!result.data || result.data.length === 0) {
            return;
        }
        
        // 카테고리별 주문 건수 집계
        const categoryCounts = {
            '목걸이': 0,
            '팔찌': 0,
            '반지': 0
        };
        
        result.data.forEach(order => {
            if (order.status === '취소') return;
            
            try {
                let products = [];
                if (typeof order.products === 'string') {
                    products = JSON.parse(order.products);
                } else if (Array.isArray(order.products)) {
                    products = order.products;
                }
                
                products.forEach(product => {
                    // 제품 정보에서 카테고리 추정 (이름에서 판단)
                    const name = product.name || '';
                    if (name.includes('목걸이') || name.includes('necklace')) {
                        categoryCounts['목걸이']++;
                    } else if (name.includes('팔찌') || name.includes('bracelet')) {
                        categoryCounts['팔찌']++;
                    } else if (name.includes('반지') || name.includes('ring')) {
                        categoryCounts['반지']++;
                    }
                });
            } catch (e) {
                // 파싱 오류 무시
            }
        });
        
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;
        
        if (categoryChart) {
            categoryChart.destroy();
        }
        
        categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['목걸이', '팔찌', '반지'],
                datasets: [{
                    data: [categoryCounts['목걸이'], categoryCounts['팔찌'], categoryCounts['반지']],
                    backgroundColor: [
                        '#2c5f4f',
                        '#d4af37',
                        '#8b7355'
                    ],
                    borderWidth: 3,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return context.label + ': ' + context.parsed + '건 (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('카테고리 차트 로딩 오류:', error);
    }
}

// 인기 제품 TOP 5
async function loadTopProducts() {
    try {
        const response = await fetch('tables/orders?limit=1000');
        const result = await response.json();
        
        if (!result.data || result.data.length === 0) {
            document.getElementById('topProductsContainer').innerHTML = '<div class="empty-state"><p>주문 데이터가 없습니다</p></div>';
            return;
        }
        
        // 제품별 판매 건수 집계
        const productCounts = {};
        
        result.data.forEach(order => {
            if (order.status === '취소') return;
            
            try {
                let products = [];
                if (typeof order.products === 'string') {
                    products = JSON.parse(order.products);
                } else if (Array.isArray(order.products)) {
                    products = order.products;
                }
                
                products.forEach(product => {
                    const name = product.name || '알 수 없음';
                    productCounts[name] = (productCounts[name] || 0) + (product.quantity || 1);
                });
            } catch (e) {
                // 파싱 오류 무시
            }
        });
        
        // 상위 5개 제품
        const topProducts = Object.entries(productCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        if (topProducts.length === 0) {
            document.getElementById('topProductsContainer').innerHTML = '<div class="empty-state"><p>판매 데이터가 없습니다</p></div>';
            return;
        }
        
        // HTML 생성
        const html = `
            <div style="display: grid; gap: 15px;">
                ${topProducts.map((item, index) => `
                    <div style="display: flex; align-items: center; gap: 20px; padding: 20px; background: ${index === 0 ? 'linear-gradient(135deg, #fff9e6 0%, #fff 100%)' : '#f8f8f8'}; border-radius: 10px; border-left: 4px solid ${index === 0 ? '#d4af37' : '#2c5f4f'};">
                        <div style="font-size: 2rem; font-weight: 700; color: ${index === 0 ? '#d4af37' : '#666'}; min-width: 40px; text-align: center;">
                            ${index + 1}
                        </div>
                        <div style="flex: 1;">
                            <h4 style="margin-bottom: 5px; color: #2c5f4f;">${item[0]}</h4>
                            <p style="color: #666; font-size: 0.9rem;">판매 수량: <strong>${item[1]}개</strong></p>
                        </div>
                        ${index === 0 ? '<div style="font-size: 2rem;">🏆</div>' : ''}
                    </div>
                `).join('')}
            </div>
        `;
        
        document.getElementById('topProductsContainer').innerHTML = html;
        
    } catch (error) {
        console.error('인기 제품 로딩 오류:', error);
        document.getElementById('topProductsContainer').innerHTML = '<div class="empty-state"><p>데이터 로딩 실패</p></div>';
    }
}

// 최근 주문 5건
async function loadRecentOrders() {
    try {
        const response = await fetch('tables/orders?limit=5&sort=-created_at');
        const result = await response.json();
        
        if (!result.data || result.data.length === 0) {
            document.getElementById('recentOrdersContainer').innerHTML = '<div class="empty-state"><p>최근 주문이 없습니다</p></div>';
            return;
        }
        
        displayOrders(result.data, 'recentOrdersContainer');
        
    } catch (error) {
        console.error('최근 주문 로딩 오류:', error);
    }
}

// displayOrders 함수 오버로드 (컨테이너 ID 지정 가능)
function displayOrdersInContainer(orders, containerId) {
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
    
    const statusColors = {
        '접수': '#3498db',
        '확인중': '#f39c12',
        '배송준비': '#9b59b6',
        '배송중': '#1abc9c',
        '배송완료': '#27ae60',
        '취소': '#e74c3c'
    };
    
    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 150px;">주문번호</th>
                    <th style="width: 100px;">고객명</th>
                    <th style="width: 120px;">주문금액</th>
                    <th style="width: 150px;">상태</th>
                    <th style="width: 150px;">주문일시</th>
                    <th style="width: 80px;">액션</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => {
                    const orderDate = new Date(order.order_date || order.created_at);
                    return `
                        <tr>
                            <td><strong style="color:#2c5f4f;">${order.order_number}</strong></td>
                            <td>${order.customer_name}</td>
                            <td><strong style="color:#d4af37;">${formatPrice(order.total_amount)}원</strong></td>
                            <td>
                                <select onchange="quickChangeOrderStatus('${order.id}', this)" 
                                        style="padding:5px 10px;border-radius:20px;border:2px solid ${statusColors[order.status]};background:${statusColors[order.status]}20;color:${statusColors[order.status]};font-weight:600;font-size:0.85rem;cursor:pointer;">
                                    <option value="접수" ${order.status === '접수' ? 'selected' : ''}>접수</option>
                                    <option value="확인중" ${order.status === '확인중' ? 'selected' : ''}>확인중</option>
                                    <option value="배송준비" ${order.status === '배송준비' ? 'selected' : ''}>배송준비</option>
                                    <option value="배송중" ${order.status === '배송중' ? 'selected' : ''}>배송중</option>
                                    <option value="배송완료" ${order.status === '배송완료' ? 'selected' : ''}>배송완료</option>
                                    <option value="취소" ${order.status === '취소' ? 'selected' : ''}>취소</option>
                                </select>
                            </td>
                            <td style="font-size:0.9rem;color:#666;">${orderDate.toLocaleString('ko-KR')}</td>
                            <td>
                                <button class="btn-icon" onclick="viewOrderDetail('${order.id}')" title="상세보기">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}
