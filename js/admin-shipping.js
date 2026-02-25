// ========================================
// 빠른 주문 상태 변경 및 배송 관리
// ========================================

// 빠른 상태 변경 (테이블에서 바로 변경)
async function quickChangeOrderStatus(orderId, selectElement) {
    const newStatus = selectElement.value;
    const order = adminOrders.find(o => o.id === orderId);
    
    if (!order) return;
    
    // 이전 상태와 같으면 무시
    if (order.status === newStatus) return;
    
    try {
        const response = await fetch(`tables/orders/${orderId}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            showToast(`주문 상태가 "${newStatus}"(으)로 변경되었습니다`, 'success');
            
            // 로컬 데이터 업데이트
            order.status = newStatus;
            
            // 통계 업데이트
            updateOrderStats();
            
            // 배송중으로 변경 시 송장번호 입력 제안
            if (newStatus === '배송중') {
                setTimeout(() => {
                    if (confirm('배송 정보를 입력하시겠습니까?')) {
                        viewOrderDetail(orderId);
                    }
                }, 500);
            }
        } else {
            throw new Error('상태 변경 실패');
        }
    } catch (error) {
        console.error('상태 변경 오류:', error);
        showToast('주문 상태 변경 중 오류가 발생했습니다', 'error');
        
        // 실패 시 이전 상태로 복원
        selectElement.value = order.status;
    }
}

// 배송 정보 추가 (주문에 송장번호 등록)
async function addShippingInfo(orderId) {
    const order = adminOrders.find(o => o.id === orderId);
    if (!order) return;
    
    // 배송 정보 입력 모달 표시
    showShippingModal(order);
}

// 배송 정보 모달 표시
function showShippingModal(order) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'shippingModal';
    
    const currentShipping = order.shipping_company || '';
    const currentTracking = order.tracking_number || '';
    
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeShippingModal()"></div>
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2><i class="fas fa-shipping-fast"></i> 배송 정보 입력</h2>
                <button class="modal-close" onclick="closeShippingModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div style="background:#f8f8f8;padding:15px;border-radius:8px;margin-bottom:20px;">
                    <p><strong>주문번호:</strong> ${order.order_number}</p>
                    <p><strong>고객명:</strong> ${order.customer_name}</p>
                    <p><strong>연락처:</strong> ${order.customer_phone}</p>
                </div>
                
                <form id="shippingForm" onsubmit="handleShippingSubmit(event, '${order.id}')">
                    <div class="form-group">
                        <label><i class="fas fa-truck"></i> 배송사 *</label>
                        <select id="shippingCompany" required>
                            <option value="">선택하세요</option>
                            <option value="우체국택배" ${currentShipping === '우체국택배' ? 'selected' : ''}>우체국택배</option>
                            <option value="CJ대한통운" ${currentShipping === 'CJ대한통운' ? 'selected' : ''}>CJ대한통운</option>
                            <option value="한진택배" ${currentShipping === '한진택배' ? 'selected' : ''}>한진택배</option>
                            <option value="로젠택배" ${currentShipping === '로젠택배' ? 'selected' : ''}>로젠택배</option>
                            <option value="롯데택배" ${currentShipping === '롯데택배' ? 'selected' : ''}>롯데택배</option>
                            <option value="GS25" ${currentShipping === 'GS25' ? 'selected' : ''}>GS25 편의점택배</option>
                            <option value="CU" ${currentShipping === 'CU' ? 'selected' : ''}>CU 편의점택배</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-barcode"></i> 송장번호 *</label>
                        <input type="text" id="trackingNumber" value="${currentTracking}" 
                               placeholder="송장번호를 입력하세요" required>
                        <small>숫자만 입력 (하이픈 없이)</small>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-calendar"></i> 발송일</label>
                        <input type="date" id="shippingDate" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-comment"></i> 배송 메모</label>
                        <textarea id="shippingMemo" rows="3" placeholder="배송 관련 메모 (선택사항)">${order.shipping_memo || ''}</textarea>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> 저장
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="closeShippingModal()">
                            <i class="fas fa-times"></i> 취소
                        </button>
                    </div>
                </form>
                
                ${currentTracking ? `
                    <div style="margin-top:20px;padding-top:20px;border-top:2px solid #e0e0e0;">
                        <h4 style="margin-bottom:10px;color:#2c5f4f;">
                            <i class="fas fa-link"></i> 배송 추적
                        </h4>
                        <button onclick="openTrackingLink('${currentShipping}', '${currentTracking}')" 
                                class="btn btn-secondary" style="width:100%;">
                            <i class="fas fa-external-link-alt"></i> 배송 조회하기
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// 배송 정보 저장
async function handleShippingSubmit(event, orderId) {
    event.preventDefault();
    
    const shippingData = {
        shipping_company: document.getElementById('shippingCompany').value,
        tracking_number: document.getElementById('trackingNumber').value.replace(/[^0-9]/g, ''),
        shipping_date: document.getElementById('shippingDate').value,
        shipping_memo: document.getElementById('shippingMemo').value,
        status: '배송중' // 자동으로 배송중 상태로 변경
    };
    
    try {
        const response = await fetch(`tables/orders/${orderId}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(shippingData)
        });
        
        if (response.ok) {
            showToast('배송 정보가 저장되었습니다', 'success');
            closeShippingModal();
            loadOrders();
        }
    } catch (error) {
        console.error('배송 정보 저장 오류:', error);
        showToast('배송 정보 저장 중 오류가 발생했습니다', 'error');
    }
}

// 배송 모달 닫기
function closeShippingModal() {
    const modal = document.getElementById('shippingModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// 배송 추적 링크 열기
function openTrackingLink(company, trackingNumber) {
    const trackingUrls = {
        '우체국택배': `https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm?sid1=${trackingNumber}`,
        'CJ대한통운': `https://www.cjlogistics.com/ko/tool/parcel/tracking?gnbInvcNo=${trackingNumber}`,
        '한진택배': `https://www.hanjin.com/kor/CMS/DeliveryMgr/WaybillResult.do?mCode=MN038&schLang=KR&wblnumText2=${trackingNumber}`,
        '로젠택배': `https://www.ilogen.com/web/personal/trace/${trackingNumber}`,
        '롯데택배': `https://www.lotteglogis.com/home/reservation/tracking/index?InvNo=${trackingNumber}`,
        'GS25': `https://www.cvsnet.co.kr/invoice/tracking.do?invoice_no=${trackingNumber}`,
        'CU': `https://www.cupost.co.kr/postbox/delivery/localResult.cupost?invoice_no=${trackingNumber}`
    };
    
    const url = trackingUrls[company];
    if (url) {
        window.open(url, '_blank');
    } else {
        showToast('배송 추적 링크가 설정되지 않았습니다', 'warning');
    }
}
