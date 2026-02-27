// ========================================
// 할인 관리 기능
// ========================================

let adminDiscounts = [];
let currentDiscountId = null;

// 할인 로드
async function loadDiscounts() {
    console.log('💰 [Admin] 할인 로딩 시작...');
    
    // localStorage에서 할인 불러오기
    const savedDiscounts = localStorage.getItem('adminDiscounts');
    
    if (savedDiscounts) {
        try {
            adminDiscounts = JSON.parse(savedDiscounts);
            console.log(`✅ [Admin] localStorage에서 할인 ${adminDiscounts.length}개 로드`);
        } catch (e) {
            console.warn('⚠️ [Admin] localStorage 파싱 오류:', e);
            adminDiscounts = getDefaultDiscounts();
            localStorage.setItem('adminDiscounts', JSON.stringify(adminDiscounts));
        }
    } else {
        console.log('⚠️ [Admin] localStorage에 할인 없음 - 기본 데이터 사용');
        adminDiscounts = getDefaultDiscounts();
        localStorage.setItem('adminDiscounts', JSON.stringify(adminDiscounts));
        console.log('💾 [Admin] 기본 할인을 localStorage에 저장');
    }
    
    // 만료된 할인 자동 비활성화
    autoDeactivateExpiredDiscounts();
    
    console.log(`✅ [Admin] 할인 ${adminDiscounts.length}개 로드 완료`);
    renderDiscountsTable(adminDiscounts);
    updateDiscountBadge();
}

// 기본 할인 데이터
function getDefaultDiscounts() {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    return [
        {
            id: 'discount_1',
            name: '오픈 기념 할인',
            rate: 20,
            startDate: today.toISOString().split('T')[0],
            endDate: nextMonth.toISOString().split('T')[0],
            description: '심석 오픈을 기념하여 전 제품 20% 할인',
            active: true,
            created_at: Date.now()
        }
    ];
}

// 만료된 할인 자동 비활성화
function autoDeactivateExpiredDiscounts() {
    const today = new Date().toISOString().split('T')[0];
    let updated = false;
    
    adminDiscounts.forEach(discount => {
        if (discount.active && discount.endDate < today) {
            discount.active = false;
            updated = true;
            console.log(`⏰ [Admin] 만료된 할인 비활성화: ${discount.name}`);
        }
    });
    
    if (updated) {
        try {
            localStorage.setItem('adminDiscounts', JSON.stringify(adminDiscounts));
        } catch (e) {
            console.error('❌ [Admin] localStorage 저장 실패:', e);
        }
    }
}

// 할인 테이블 렌더링
function renderDiscountsTable(discounts) {
    const container = document.getElementById('discountsTableContainer');
    
    if (discounts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tags"></i>
                <h3>등록된 할인이 없습니다</h3>
                <p style="color: #999; margin-top: 10px;">새 할인 추가 버튼을 클릭하여 할인을 등록하세요</p>
            </div>
        `;
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 200px;">할인명</th>
                    <th style="width: 100px;">할인율</th>
                    <th style="width: 120px;">시작일</th>
                    <th style="width: 120px;">종료일</th>
                    <th style="width: 100px;">상태</th>
                    <th>설명</th>
                    <th style="width: 120px;">액션</th>
                </tr>
            </thead>
            <tbody>
                ${discounts.map(discount => {
                    const isExpired = discount.endDate < today;
                    const isActive = discount.active && !isExpired;
                    const statusColor = isActive ? '#4caf50' : (isExpired ? '#999' : '#ff9800');
                    const statusText = isActive ? '✓ 활성' : (isExpired ? '✗ 만료' : '○ 비활성');
                    
                    return `
                        <tr style="${isActive ? 'background: #f1f8f4;' : ''}">
                            <td>
                                <strong style="color: #2c5f4f;">${discount.name}</strong>
                                ${isActive ? '<span style="margin-left:8px;background:#e74c3c;color:white;padding:2px 8px;border-radius:12px;font-size:0.75rem;font-weight:600;">LIVE</span>' : ''}
                            </td>
                            <td>
                                <span style="color:#e74c3c;font-size:1.2rem;font-weight:700;">${discount.rate}%</span>
                            </td>
                            <td style="font-size:0.9rem;">${formatDate(discount.startDate)}</td>
                            <td style="font-size:0.9rem;">${formatDate(discount.endDate)}</td>
                            <td>
                                <span style="color:${statusColor};font-weight:600;">${statusText}</span>
                            </td>
                            <td style="font-size:0.9rem;color:#666;">${discount.description || '-'}</td>
                            <td>
                                <button class="btn-icon" onclick="editDiscount('${discount.id}')" title="수정">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon" onclick="toggleDiscountActive('${discount.id}')" 
                                        title="${discount.active ? '비활성화' : '활성화'}"
                                        style="color:${discount.active ? '#ff9800' : '#4caf50'};">
                                    <i class="fas fa-${discount.active ? 'pause' : 'play'}-circle"></i>
                                </button>
                                <button class="btn-icon" onclick="deleteDiscount('${discount.id}')" title="삭제" style="color:#e74c3c;">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 할인 추가 모달 열기
function showAddDiscountModal() {
    currentDiscountId = null;
    document.getElementById('discountModalTitle').textContent = '새 할인 추가';
    document.getElementById('discountForm').reset();
    document.getElementById('discountActive').checked = true;
    document.getElementById('discountModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 할인 수정
function editDiscount(discountId) {
    const discount = adminDiscounts.find(d => d.id === discountId);
    if (!discount) {
        showToast('할인을 찾을 수 없습니다', 'error');
        return;
    }
    
    currentDiscountId = discountId;
    document.getElementById('discountModalTitle').textContent = '할인 수정';
    document.getElementById('discountName').value = discount.name;
    document.getElementById('discountRate').value = discount.rate;
    document.getElementById('discountStartDate').value = discount.startDate;
    document.getElementById('discountEndDate').value = discount.endDate;
    document.getElementById('discountDescription').value = discount.description || '';
    document.getElementById('discountActive').checked = discount.active;
    
    document.getElementById('discountModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 할인 저장
async function handleDiscountSubmit(e) {
    e.preventDefault();
    
    const discountData = {
        name: document.getElementById('discountName').value,
        rate: parseInt(document.getElementById('discountRate').value),
        startDate: document.getElementById('discountStartDate').value,
        endDate: document.getElementById('discountEndDate').value,
        description: document.getElementById('discountDescription').value,
        active: document.getElementById('discountActive').checked
    };
    
    // 날짜 유효성 검사
    if (discountData.startDate > discountData.endDate) {
        showToast('종료일은 시작일보다 이후여야 합니다', 'error');
        return;
    }
    
    try {
        if (currentDiscountId) {
            // 수정
            const index = adminDiscounts.findIndex(d => d.id === currentDiscountId);
            if (index !== -1) {
                adminDiscounts[index] = {
                    ...adminDiscounts[index],
                    ...discountData,
                    updated_at: Date.now()
                };
                showToast('할인이 수정되었습니다', 'success');
            }
        } else {
            // 추가
            const newDiscount = {
                id: 'discount_' + Date.now(),
                ...discountData,
                created_at: Date.now(),
                updated_at: Date.now()
            };
            adminDiscounts.push(newDiscount);
            showToast('할인이 추가되었습니다', 'success');
        }
        
        // localStorage에 저장
        try {
            localStorage.setItem('adminDiscounts', JSON.stringify(adminDiscounts));
            console.log('💾 [Admin] 할인 데이터 저장 완료');
        } catch (storageError) {
            if (storageError.name === 'QuotaExceededError') {
                console.error('❌ [Admin] localStorage 용량 초과!');
                showToast('❌ 저장 공간 부족', 'error');
                if (!currentDiscountId) {
                    adminDiscounts.pop();
                }
                return;
            }
            throw storageError;
        }
        
        closeDiscountModal();
        loadDiscounts();
        
    } catch (error) {
        console.error('❌ [Admin] 할인 저장 오류:', error);
        showToast('할인 저장 중 오류가 발생했습니다', 'error');
    }
}

// 할인 활성화/비활성화 토글
async function toggleDiscountActive(discountId) {
    const discount = adminDiscounts.find(d => d.id === discountId);
    if (!discount) {
        showToast('할인을 찾을 수 없습니다', 'error');
        return;
    }
    
    discount.active = !discount.active;
    
    try {
        localStorage.setItem('adminDiscounts', JSON.stringify(adminDiscounts));
        showToast(`할인이 ${discount.active ? '활성화' : '비활성화'}되었습니다`, 'success');
        loadDiscounts();
    } catch (error) {
        console.error('❌ [Admin] 할인 토글 오류:', error);
        showToast('오류가 발생했습니다', 'error');
    }
}

// 할인 삭제
async function deleteDiscount(discountId) {
    const discount = adminDiscounts.find(d => d.id === discountId);
    if (!discount) {
        showToast('할인을 찾을 수 없습니다', 'error');
        return;
    }
    
    if (!confirm(`"${discount.name}"을(를) 정말 삭제하시겠습니까?`)) return;
    
    try {
        const index = adminDiscounts.findIndex(d => d.id === discountId);
        if (index !== -1) {
            adminDiscounts.splice(index, 1);
            
            try {
                localStorage.setItem('adminDiscounts', JSON.stringify(adminDiscounts));
            } catch (e) {
                console.error('❌ [Admin] localStorage 저장 실패:', e);
            }
            
            showToast('할인이 삭제되었습니다', 'success');
            loadDiscounts();
        }
    } catch (error) {
        console.error('❌ [Admin] 삭제 오류:', error);
        showToast('할인 삭제 중 오류가 발생했습니다', 'error');
    }
}

// 모달 닫기
function closeDiscountModal() {
    document.getElementById('discountModal').classList.remove('active');
    document.body.style.overflow = '';
    currentDiscountId = null;
}

// 할인 배지 업데이트
function updateDiscountBadge() {
    const activeDiscounts = adminDiscounts.filter(d => {
        const today = new Date().toISOString().split('T')[0];
        return d.active && d.endDate >= today;
    }).length;
    
    const badge = document.getElementById('discountsTabBadge');
    if (activeDiscounts > 0) {
        badge.textContent = activeDiscounts;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

// 활성 할인 가져오기 (제품에 적용)
function getActiveDiscount() {
    const today = new Date().toISOString().split('T')[0];
    return adminDiscounts.find(d => 
        d.active && 
        d.startDate <= today && 
        d.endDate >= today
    );
}

// 전역으로 export
window.getActiveDiscount = getActiveDiscount;
