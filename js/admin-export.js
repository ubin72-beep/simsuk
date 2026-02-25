// ========================================
// 데이터 내보내기 (Excel/CSV)
// ========================================

// 제품 목록 CSV 다운로드
function exportProductsCSV() {
    if (allProducts.length === 0) {
        showToast('내보낼 제품 데이터가 없습니다', 'warning');
        return;
    }
    
    // CSV 헤더
    const headers = ['제품ID', '제품명', '카테고리', '가격', '재료', '효능', '설명', '탄생석', '추천여부', '재고여부', '등록일'];
    
    // CSV 데이터
    const rows = allProducts.map(product => {
        const birthstones = product.birthstone_months && product.birthstone_months.length > 0
            ? product.birthstone_months.join(',')
            : '없음';
        
        return [
            product.id || '',
            product.name || '',
            product.category || '',
            product.price || 0,
            product.materials || '',
            product.benefits || '',
            (product.description || '').replace(/\n/g, ' '),
            birthstones,
            product.featured ? '추천' : '',
            product.in_stock ? '재고있음' : '품절',
            new Date(product.created_at).toLocaleString('ko-KR')
        ];
    });
    
    // CSV 생성
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // BOM 추가 (엑셀 한글 깨짐 방지)
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 다운로드
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `심석_제품목록_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showToast(`제품 ${allProducts.length}개 데이터를 다운로드했습니다`, 'success');
}

// 주문 목록 CSV 다운로드
function exportOrdersCSV() {
    if (allOrders.length === 0) {
        showToast('내보낼 주문 데이터가 없습니다', 'warning');
        return;
    }
    
    // CSV 헤더
    const headers = ['주문ID', '주문번호', '주문일시', '고객명', '전화번호', '이메일', '카카오톡ID', '배송주소', '주문금액', '상태', '특별요청'];
    
    // CSV 데이터
    const rows = allOrders.map(order => {
        return [
            order.id || '',
            order.order_number || '',
            new Date(order.order_date || order.created_at).toLocaleString('ko-KR'),
            order.customer_name || '',
            order.customer_phone || '',
            order.customer_email || '',
            order.customer_kakao || '',
            (order.shipping_address || '').replace(/\n/g, ' '),
            order.total_amount || 0,
            order.status || '',
            (order.special_request || '').replace(/\n/g, ' ')
        ];
    });
    
    // CSV 생성
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // BOM 추가
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 다운로드
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `심석_주문목록_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showToast(`주문 ${allOrders.length}개 데이터를 다운로드했습니다`, 'success');
}

// 주문 상세 CSV 다운로드 (제품 정보 포함)
function exportOrdersDetailCSV() {
    if (allOrders.length === 0) {
        showToast('내보낼 주문 데이터가 없습니다', 'warning');
        return;
    }
    
    // CSV 헤더
    const headers = ['주문ID', '주문번호', '주문일시', '고객명', '전화번호', '이메일', '배송주소', '주문금액', '상태', '제품명', '수량', '단가', '소계'];
    
    // CSV 데이터 (주문당 제품 행으로 분리)
    const rows = [];
    
    allOrders.forEach(order => {
        try {
            let products = [];
            if (typeof order.products === 'string') {
                products = JSON.parse(order.products);
            } else if (Array.isArray(order.products)) {
                products = order.products;
            }
            
            if (products.length === 0) {
                // 제품 정보 없는 경우
                rows.push([
                    order.id || '',
                    order.order_number || '',
                    new Date(order.order_date || order.created_at).toLocaleString('ko-KR'),
                    order.customer_name || '',
                    order.customer_phone || '',
                    order.customer_email || '',
                    (order.shipping_address || '').replace(/\n/g, ' '),
                    order.total_amount || 0,
                    order.status || '',
                    '제품 정보 없음',
                    '',
                    '',
                    ''
                ]);
            } else {
                // 각 제품을 별도 행으로
                products.forEach((product, index) => {
                    rows.push([
                        index === 0 ? order.id : '',
                        index === 0 ? order.order_number : '',
                        index === 0 ? new Date(order.order_date || order.created_at).toLocaleString('ko-KR') : '',
                        index === 0 ? order.customer_name : '',
                        index === 0 ? order.customer_phone : '',
                        index === 0 ? order.customer_email : '',
                        index === 0 ? (order.shipping_address || '').replace(/\n/g, ' ') : '',
                        index === 0 ? order.total_amount : '',
                        index === 0 ? order.status : '',
                        product.name || '알 수 없음',
                        product.quantity || 1,
                        product.price || 0,
                        (product.price || 0) * (product.quantity || 1)
                    ]);
                });
            }
        } catch (e) {
            // 파싱 오류 시 기본 정보만
            rows.push([
                order.id || '',
                order.order_number || '',
                new Date(order.order_date || order.created_at).toLocaleString('ko-KR'),
                order.customer_name || '',
                order.customer_phone || '',
                order.customer_email || '',
                (order.shipping_address || '').replace(/\n/g, ' '),
                order.total_amount || 0,
                order.status || '',
                '파싱 오류',
                '',
                '',
                ''
            ]);
        }
    });
    
    // CSV 생성
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // BOM 추가
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 다운로드
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `심석_주문상세_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showToast('주문 상세 데이터를 다운로드했습니다', 'success');
}

// 전체 데이터 다운로드 (제품 + 주문)
function exportAllData() {
    exportProductsCSV();
    setTimeout(() => {
        exportOrdersDetailCSV();
    }, 500);
    
    showToast('전체 데이터 다운로드가 시작되었습니다', 'success');
}
