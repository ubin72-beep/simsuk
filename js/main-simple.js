/*
 * 심석 메인 페이지 - 제품 표시 (페이지네이션)
 */

console.log('🚀 메인 페이지 로드');

let allProducts = [];
let currentPage = 1;
const productsPerPage = 12; // 한 페이지에 12개

// localStorage에서 제품 로드
function loadProducts() {
    try {
        const data = localStorage.getItem('adminProducts') || localStorage.getItem('products');
        if (data) {
            allProducts = JSON.parse(data);
            console.log(`✅ 제품 로드: ${allProducts.length}개`);
        } else {
            allProducts = [];
            console.log('⚠️ 제품 없음');
        }
        return allProducts;
    } catch (error) {
        console.error('❌ 로드 실패:', error);
        allProducts = [];
        return allProducts;
    }
}

// 제품 카드 생성
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cursor = 'pointer';
    
    const naverLink = product.naver_link || 'https://smartstore.naver.com/simsuk';
    
    // 카드 클릭 시 네이버로 이동
    card.onclick = () => {
        window.open(naverLink, '_blank');
    };
    
    card.innerHTML = `
        <div class="product-image" style="width: 100%; height: 250px; overflow: hidden; border-radius: 8px; background: #f5f5f5;">
            <img src="${product.image_url || 'https://via.placeholder.com/300x300?text=제품이미지'}" 
                 alt="${product.name}"
                 style="width: 100%; height: 100%; object-fit: cover;"
                 onerror="this.src='https://via.placeholder.com/300x300?text=제품이미지'">
        </div>
        <div class="product-info" style="padding: 15px;">
            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">${product.category || '제품'}</div>
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #333;">${product.name}</h3>
            <div style="font-size: 18px; font-weight: 700; color: #2c5f4f; margin-bottom: 12px;">${(product.price || 0).toLocaleString()}원</div>
            <button style="width: 100%; padding: 10px; background: #03C75A; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
                네이버 스마트스토어에서 보기
            </button>
        </div>
    `;
    
    return card;
}

// 제품 표시 (페이지네이션)
function displayProducts(page = 1) {
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.log('⚠️ productsGrid 없음');
        return;
    }
    
    currentPage = page;
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = allProducts.slice(startIndex, endIndex);
    
    console.log(`📄 페이지 ${page}: ${productsToShow.length}개 표시 (전체 ${allProducts.length}개)`);
    
    grid.innerHTML = '';
    
    if (productsToShow.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <div style="font-size: 48px; margin-bottom: 20px;">📦</div>
                <div style="font-size: 18px; color: #666; margin-bottom: 10px;">등록된 제품이 없습니다</div>
                <div style="font-size: 14px; color: #999;">관리자 페이지에서 제품을 등록해주세요</div>
            </div>
        `;
        return;
    }
    
    productsToShow.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
    
    // 페이지네이션 업데이트
    updatePagination();
}

// 페이지네이션 버튼
function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    pagination.innerHTML = '';
    
    // 이전 버튼
    if (currentPage > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '이전';
        prevBtn.onclick = () => displayProducts(currentPage - 1);
        prevBtn.style.cssText = 'padding: 10px 20px; margin: 0 5px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 6px;';
        pagination.appendChild(prevBtn);
    }
    
    // 페이지 번호
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.onclick = () => displayProducts(i);
            pageBtn.style.cssText = `padding: 10px 15px; margin: 0 5px; border: 1px solid #ddd; background: ${i === currentPage ? '#2c5f4f' : 'white'}; color: ${i === currentPage ? 'white' : '#333'}; cursor: pointer; border-radius: 6px; font-weight: ${i === currentPage ? '600' : '400'};`;
            pagination.appendChild(pageBtn);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.cssText = 'padding: 10px; color: #999;';
            pagination.appendChild(dots);
        }
    }
    
    // 다음 버튼
    if (currentPage < totalPages) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = '다음';
        nextBtn.onclick = () => displayProducts(currentPage + 1);
        nextBtn.style.cssText = 'padding: 10px 20px; margin: 0 5px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 6px;';
        pagination.appendChild(nextBtn);
    }
}

// 3초마다 자동 새로고침
setInterval(() => {
    const previousLength = allProducts.length;
    loadProducts();
    
    if (allProducts.length !== previousLength) {
        console.log(`🔄 제품 수 변경: ${previousLength}개 → ${allProducts.length}개`);
        displayProducts(currentPage);
    }
}, 3000);

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM 로드 완료');
    
    loadProducts();
    displayProducts(1);
    
    console.log('✅ 초기화 완료');
});

// 전역 함수
window.loadProducts = loadProducts;
window.displayProducts = displayProducts;

console.log('✅ 메인 페이지 스크립트 로드 완료');
