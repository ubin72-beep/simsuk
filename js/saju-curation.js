/**
 * 사주 기반 탄생석 큐레이션 시스템
 * 생년월일을 기반으로 오행 분석 및 보완석 추천
 */

// 오행별 특성 및 보완석 매칭 데이터
const OHANG_DATA = {
    wood: {
        name: '목(木)',
        color: '청색, 녹색',
        characteristics: '성장, 발전, 창의력',
        deficiency: '우유부단함, 결단력 부족, 추진력 약함',
        stones: [
            { name: '헤마타이트', reason: '강한 기운으로 결단력과 추진력 강화', element: 'metal' },
            { name: '흑요석', reason: '보호 에너지로 안정감 제공', element: 'water' },
            { name: '타이거아이', reason: '용기와 집중력 향상', element: 'earth' }
        ]
    },
    fire: {
        name: '화(火)',
        color: '적색, 보라색',
        characteristics: '열정, 활력, 적극성',
        deficiency: '불안정, 과도한 감정 기복, 인내심 부족',
        stones: [
            { name: '담수진주', reason: '차분함과 평온함으로 감정 안정', element: 'water' },
            { name: '로즈쿼츠', reason: '부드러운 에너지로 마음의 평화', element: 'earth' },
            { name: '아쿠아마린', reason: '냉정함과 이성적 판단력 강화', element: 'water' }
        ]
    },
    earth: {
        name: '토(土)',
        color: '황색, 갈색',
        characteristics: '안정, 신뢰, 현실감',
        deficiency: '변화 거부, 고집, 유연성 부족',
        stones: [
            { name: '헤마타이트', reason: '혈액순환 개선으로 활력 증진', element: 'metal' },
            { name: '시트린', reason: '긍정 에너지로 마음의 유연성 향상', element: 'fire' },
            { name: '마노', reason: '새로운 시작과 변화 수용력 강화', element: 'wood' }
        ]
    },
    metal: {
        name: '금(金)',
        color: '백색, 금색',
        characteristics: '정의, 결단력, 논리성',
        deficiency: '냉정함, 감성 부족, 경직됨',
        stones: [
            { name: '로즈쿼츠', reason: '사랑과 따뜻함으로 감성 회복', element: 'earth' },
            { name: '담수진주', reason: '부드러운 여성성과 포용력 증진', element: 'water' },
            { name: '문스톤', reason: '직관력과 감수성 향상', element: 'water' }
        ]
    },
    water: {
        name: '수(水)',
        color: '흑색, 청색',
        characteristics: '지혜, 유연성, 적응력',
        deficiency: '우울함, 의지 부족, 방향성 상실',
        stones: [
            { name: '헤마타이트', reason: '강한 의지력과 집중력 제공', element: 'metal' },
            { name: '카넬리안', reason: '열정과 활력 에너지 충전', element: 'fire' },
            { name: '호박', reason: '따뜻한 기운으로 우울함 해소', element: 'earth' }
        ]
    }
};

// 월별 탄생석 데이터
const BIRTHSTONE_DATA = {
    1: { name: '가넷', color: '진홍색', meaning: '진실, 우정, 정절' },
    2: { name: '자수정', color: '보라색', meaning: '성실, 평화, 고귀' },
    3: { name: '아쿠아마린', color: '청록색', meaning: '침착, 용기, 총명' },
    4: { name: '다이아몬드', color: '무색', meaning: '청결, 영원한 사랑' },
    5: { name: '에메랄드', color: '녹색', meaning: '행복, 행운, 재생' },
    6: { name: '진주/문스톤', color: '백색', meaning: '건강, 장수, 부' },
    7: { name: '루비', color: '적색', meaning: '정열, 애정, 위엄' },
    8: { name: '페리도트', color: '연녹색', meaning: '부부애, 화목, 행복' },
    9: { name: '사파이어', color: '청색', meaning: '자애, 성실, 진실' },
    10: { name: '오팔', color: '다채색', meaning: '희망, 순결, 행운' },
    11: { name: '토파즈', color: '황색', meaning: '우정, 희망, 건강' },
    12: { name: '터키석', color: '청록색', meaning: '성공, 번영, 건강' }
};

// 천간(天干) - 연도별
const HEAVENLY_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const STEM_ELEMENTS = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water'];

// 지지(地支) - 연도별
const EARTHLY_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const BRANCH_ELEMENTS = ['water', 'earth', 'wood', 'wood', 'earth', 'fire', 'fire', 'earth', 'metal', 'metal', 'earth', 'water'];

/**
 * 생년월일을 기반으로 오행 분석
 * @param {string} birthDate - 생년월일 (YYYY-MM-DD)
 * @returns {object} 오행 분석 결과
 */
function analyzeSaju(birthDate) {
    const date = new Date(birthDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 연도 기반 천간지지 계산
    const stemIndex = (year - 4) % 10;
    const branchIndex = (year - 4) % 12;
    
    const stem = HEAVENLY_STEMS[stemIndex];
    const branch = EARTHLY_BRANCHES[branchIndex];
    const stemElement = STEM_ELEMENTS[stemIndex];
    const branchElement = BRANCH_ELEMENTS[branchIndex];
    
    // 오행 점수 계산 (간단한 버전)
    const elementScores = {
        wood: 0,
        fire: 0,
        earth: 0,
        metal: 0,
        water: 0
    };
    
    // 연도의 천간지지 영향
    elementScores[stemElement] += 3;
    elementScores[branchElement] += 2;
    
    // 월 영향 (계절)
    if ([1, 2, 12].includes(month)) elementScores.water += 2; // 겨울
    else if ([3, 4, 5].includes(month)) elementScores.wood += 2; // 봄
    else if ([6, 7, 8].includes(month)) elementScores.fire += 2; // 여름
    else if ([9, 10, 11].includes(month)) elementScores.metal += 2; // 가을
    
    // 부족한 오행 찾기
    const sortedElements = Object.entries(elementScores)
        .sort((a, b) => a[1] - b[1]);
    
    const deficientElement = sortedElements[0][0]; // 가장 부족한 오행
    const dominantElement = sortedElements[4][0]; // 가장 강한 오행
    
    return {
        year,
        month,
        day,
        stem,
        branch,
        stemElement,
        branchElement,
        elementScores,
        deficientElement,
        dominantElement,
        birthstone: BIRTHSTONE_DATA[month]
    };
}

/**
 * 오행 분석 결과를 기반으로 보완석 추천
 * @param {object} sajuResult - analyzeSaju() 결과
 * @returns {object} 추천 결과
 */
function recommendStones(sajuResult) {
    const deficientData = OHANG_DATA[sajuResult.deficientElement];
    const dominantData = OHANG_DATA[sajuResult.dominantElement];
    
    return {
        birthstone: sajuResult.birthstone,
        deficientElement: {
            element: sajuResult.deficientElement,
            name: deficientData.name,
            characteristics: deficientData.characteristics,
            deficiency: deficientData.deficiency,
            recommendedStones: deficientData.stones
        },
        dominantElement: {
            element: sajuResult.dominantElement,
            name: dominantData.name,
            characteristics: dominantData.characteristics
        },
        elementScores: sajuResult.elementScores
    };
}

/**
 * 추천된 돌과 현재 제품 매칭
 * @param {array} recommendedStones - 추천된 돌 목록
 * @param {array} products - 전체 제품 목록
 * @returns {array} 매칭된 제품 목록
 */
function matchProducts(recommendedStones, products) {
    const matched = [];
    
    recommendedStones.forEach(stone => {
        const stoneName = stone.name.toLowerCase();
        products.forEach(product => {
            const productName = product.name.toLowerCase();
            const productMaterial = product.material ? product.material.toLowerCase() : '';
            
            // 제품명이나 재질에 돌 이름이 포함되어 있으면 매칭
            if (productName.includes(stoneName) || 
                productMaterial.includes(stoneName) ||
                productName.includes('헤마타이트') && stoneName.includes('헤마타이트') ||
                productName.includes('진주') && stoneName.includes('진주')) {
                
                matched.push({
                    ...product,
                    recommendedStone: stone.name,
                    reason: stone.reason
                });
            }
        });
    });
    
    return matched;
}

/**
 * 사주 큐레이션 결과를 HTML로 생성
 * @param {string} birthDate - 생년월일
 * @param {array} products - 제품 목록 (옵션)
 * @returns {object} { sajuResult, recommendation, matchedProducts, html }
 */
function generateCurationResult(birthDate, products = [], calendarType = 'solar', calendarTypeText = '양력') {
    const sajuResult = analyzeSaju(birthDate);
    const recommendation = recommendStones(sajuResult);
    const matchedProducts = products.length > 0 ? 
        matchProducts(recommendation.deficientElement.recommendedStones, products) : [];
    
    // HTML 생성
    const html = `
        <div class="saju-curation-result">
            <div class="result-header">
                <h3>🔮 당신을 위한 맞춤 원석 추천</h3>
                <p class="birth-info">${sajuResult.year}년 ${sajuResult.month}월 ${sajuResult.day}일생 (${calendarTypeText})</p>
            </div>
            
            <div class="result-section birthstone-section">
                <h4>💎 당신의 탄생석</h4>
                <div class="stone-card">
                    <div class="stone-name">${recommendation.birthstone.name}</div>
                    <div class="stone-color">${recommendation.birthstone.color}</div>
                    <div class="stone-meaning">${recommendation.birthstone.meaning}</div>
                </div>
            </div>
            
            <div class="result-section ohang-analysis">
                <h4>☯️ 오행 분석</h4>
                <div class="ohang-chart">
                    ${Object.entries(sajuResult.elementScores).map(([element, score]) => `
                        <div class="ohang-bar">
                            <span class="ohang-label">${OHANG_DATA[element].name}</span>
                            <div class="ohang-bar-bg">
                                <div class="ohang-bar-fill" style="width: ${(score / 7) * 100}%"></div>
                            </div>
                            <span class="ohang-score">${score}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="ohang-summary">
                    <p><strong>강한 오행:</strong> ${recommendation.dominantElement.name} - ${recommendation.dominantElement.characteristics}</p>
                    <p><strong>부족한 오행:</strong> ${recommendation.deficientElement.name} - ${recommendation.deficientElement.characteristics}</p>
                    <p class="deficiency-note">${recommendation.deficientElement.deficiency}</p>
                </div>
            </div>
            
            <div class="result-section recommended-stones">
                <h4>✨ ${recommendation.deficientElement.name} 보완석 추천</h4>
                <div class="stones-grid">
                    ${recommendation.deficientElement.recommendedStones.map(stone => `
                        <div class="stone-card recommended">
                            <div class="stone-name">${stone.name}</div>
                            <div class="stone-reason">${stone.reason}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            ${matchedProducts.length > 0 ? `
                <div class="result-section matched-products">
                    <h4>🛍️ 추천 제품</h4>
                    <div class="products-grid">
                        ${matchedProducts.map(product => `
                            <div class="product-card-mini" data-product-id="${product.id}">
                                <img src="${product.image}" alt="${product.name}">
                                <h5>${product.name}</h5>
                                <p class="product-reason">💡 ${product.reason}</p>
                                <p class="product-price">${product.price.toLocaleString()}원</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="result-footer">
                <p class="disclaimer">※ 본 추천은 전통 사주명리학 이론을 기반으로 한 참고 자료입니다.</p>
            </div>
        </div>
    `;
    
    return {
        sajuResult,
        recommendation,
        matchedProducts,
        html
    };
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        analyzeSaju,
        recommendStones,
        matchProducts,
        generateCurationResult,
        OHANG_DATA,
        BIRTHSTONE_DATA
    };
}
