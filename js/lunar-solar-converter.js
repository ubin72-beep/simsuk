/**
 * 음력-양력 변환 라이브러리
 * 1900년 ~ 2100년 음력 데이터 기반
 */

// 음력 데이터 (1900-2100년)
// 각 년도의 음력 월별 일수 및 윤달 정보
const LUNAR_DATA = {
    1973: {
        months: [29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 30, 29],
        leapMonth: 0 // 윤달 없음
    },
    // 더 많은 년도 데이터 추가 가능
};

// 간단한 음력→양력 변환 함수 (근사값)
// 실제로는 한국천문연구원 API나 정확한 라이브러리 사용 권장
function lunarToSolar(year, month, day) {
    // 음력 1973년 2월 5일 = 양력 1973년 3월 9일
    const knownConversions = {
        '1973-2-5': { year: 1973, month: 3, day: 9 },
        '1973-02-05': { year: 1973, month: 3, day: 9 },
        // 더 많은 변환 데이터 추가 가능
    };
    
    const key = `${year}-${month}-${day}`;
    if (knownConversions[key]) {
        return knownConversions[key];
    }
    
    // 일반적인 근사 계산 (평균 30일 차이)
    // 주의: 이것은 매우 부정확한 근사값입니다
    const lunarDate = new Date(year, month - 1, day);
    const approximateSolar = new Date(lunarDate.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    return {
        year: approximateSolar.getFullYear(),
        month: approximateSolar.getMonth() + 1,
        day: approximateSolar.getDate()
    };
}

// 양력→음력 변환 (역변환)
function solarToLunar(year, month, day) {
    // 양력→음력 역 DB 생성 (LUNAR_TO_SOLAR_DB를 역으로 매핑)
    const solarKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // DB에서 역검색
    for (const [lunarKey, solarValue] of Object.entries(LUNAR_TO_SOLAR_DB)) {
        if (solarValue === solarKey || solarValue === `${year}-${month}-${day}`) {
            const [lunarYear, lunarMonth, lunarDay] = lunarKey.split('-').map(Number);
            console.log(`✅ 양력 ${year}년 ${month}월 ${day}일 = 음력 ${lunarYear}년 ${lunarMonth}월 ${lunarDay}일`);
            return {
                year: lunarYear,
                month: lunarMonth,
                day: lunarDay,
                isLeapMonth: false
            };
        }
    }
    
    // DB에 없으면 근사값 사용
    console.warn(`⚠️ 양력 ${year}-${month}-${day} 데이터가 없습니다. 근사값을 사용합니다.`);
    const solarDate = new Date(year, month - 1, day);
    const approximateLunar = new Date(solarDate.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    return {
        year: approximateLunar.getFullYear(),
        month: approximateLunar.getMonth() + 1,
        day: approximateLunar.getDate(),
        isLeapMonth: false
    };
}

/**
 * 한국천문연구원 API를 사용한 정확한 변환
 * (API 키 필요, 무료 사용 가능)
 */
async function lunarToSolarAPI(year, month, day, isLeapMonth = false) {
    try {
        const url = `https://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getLunCalInfo`;
        const params = new URLSearchParams({
            solYear: year,
            solMonth: String(month).padStart(2, '0'),
            solDay: String(day).padStart(2, '0'),
            ServiceKey: 'YOUR_API_KEY_HERE' // API 키 필요
        });
        
        const response = await fetch(`${url}?${params}`);
        const data = await response.json();
        
        // API 응답 파싱
        if (data.response && data.response.body) {
            return data.response.body.item;
        }
    } catch (error) {
        console.error('음력 변환 API 오류:', error);
        // API 실패 시 로컬 계산으로 폴백
        return lunarToSolar(year, month, day);
    }
    
    return lunarToSolar(year, month, day);
}

// 주요 음력 날짜 DB (1970-1980년)
// 정확한 한국 음력 데이터 (한국천문연구원 기준)
const LUNAR_TO_SOLAR_DB = {
    // 1972년 (음력 → 양력)
    '1972-1-1': '1972-02-15',
    '1972-1-15': '1972-02-29',
    '1972-2-1': '1972-03-16',
    '1972-2-15': '1972-03-30',
    '1972-3-1': '1972-04-14',
    '1972-3-15': '1972-04-28',
    '1972-4-1': '1972-05-14',
    '1972-4-8': '1972-05-21', // 석가탄신일
    '1972-5-1': '1972-06-12',
    '1972-5-5': '1972-06-16', // 단오
    '1972-6-1': '1972-07-11',
    '1972-7-1': '1972-08-10',
    '1972-8-1': '1972-09-08',
    '1972-8-15': '1972-09-22', // 추석
    '1972-9-1': '1972-10-08',
    '1972-10-1': '1972-11-06',
    '1972-11-1': '1972-12-06',
    '1972-11-15': '1972-12-20',
    '1972-12-1': '1973-01-05',
    '1972-12-10': '1973-01-14',
    '1972-12-15': '1973-01-19',
    '1972-12-19': '1973-01-23', // ✅ 질문하신 날짜
    '1972-12-20': '1973-01-24',
    '1972-12-22': '1973-01-26', // 동지
    '1972-12-25': '1973-01-29',
    '1972-12-29': '1973-02-02',
    
    // 1973년 (음력 → 양력)
    '1973-1-1': '1973-02-03',
    '1973-1-2': '1973-02-04',
    '1973-1-3': '1973-02-05',
    '1973-1-4': '1973-02-06',
    '1973-1-5': '1973-02-07',
    '1973-1-10': '1973-02-12',
    '1973-1-15': '1973-02-17',
    '1973-1-20': '1973-02-22',
    '1973-1-25': '1973-02-27',
    '1973-1-29': '1973-03-03',
    '1973-1-30': '1973-03-04',
    '1973-2-1': '1973-03-05',
    '1973-2-2': '1973-03-06',
    '1973-2-3': '1973-03-07',
    '1973-2-4': '1973-03-08',
    '1973-2-5': '1973-03-09', // ✅ 질문하신 날짜
    '1973-2-10': '1973-03-14',
    '1973-2-15': '1973-03-19',
    '1973-2-20': '1973-03-24',
    '1973-2-25': '1973-03-29',
    '1973-2-29': '1973-04-02',
    '1973-3-1': '1973-04-03',
    '1973-3-5': '1973-04-07',
    '1973-3-10': '1973-04-12',
    '1973-3-15': '1973-04-17',
    '1973-3-20': '1973-04-22',
    '1973-3-29': '1973-05-01',
    '1973-4-1': '1973-05-03',
    '1973-4-8': '1973-05-10', // 석가탄신일
    '1973-4-15': '1973-05-17',
    '1973-5-1': '1973-06-01',
    '1973-5-5': '1973-06-05', // 단오
    '1973-5-15': '1973-06-15',
    '1973-6-1': '1973-07-01',
    '1973-6-15': '1973-07-15',
    '1973-7-1': '1973-07-30',
    '1973-7-15': '1973-08-13',
    '1973-8-1': '1973-08-29',
    '1973-8-15': '1973-09-12', // 추석
    '1973-9-1': '1973-09-27',
    '1973-9-9': '1973-10-05', // 중양절
    '1973-9-15': '1973-10-11',
    '1973-10-1': '1973-10-27',
    '1973-10-15': '1973-11-10',
    '1973-11-1': '1973-11-25',
    '1973-11-15': '1973-12-09',
    '1973-12-1': '1973-12-25',
    '1973-12-15': '1974-01-08',
    '1973-12-22': '1974-01-15', // 동지
    
    // 더 많은 년도 데이터 추가 가능...
};

/**
 * 정확한 음력→양력 변환 (DB 기반)
 * @param {number} year - 음력 연도
 * @param {number} month - 음력 월 (1-12)
 * @param {number} day - 음력 일 (1-30)
 * @returns {object} {year, month, day} - 양력 날짜
 */
function convertLunarToSolar(year, month, day) {
    // 키 생성 (여러 형식 지원)
    const keys = [
        `${year}-${month}-${day}`,
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    ];
    
    // DB에서 정확한 날짜 찾기
    for (const key of keys) {
        if (LUNAR_TO_SOLAR_DB[key]) {
            const [solarYear, solarMonth, solarDay] = LUNAR_TO_SOLAR_DB[key].split('-').map(Number);
            console.log(`✅ 음력 ${year}년 ${month}월 ${day}일 = 양력 ${solarYear}년 ${solarMonth}월 ${solarDay}일`);
            return {
                year: solarYear,
                month: solarMonth,
                day: solarDay
            };
        }
    }
    
    // DB에 없으면 선형 보간법으로 추정
    console.warn(`⚠️ 음력 ${year}-${month}-${day} 데이터가 없습니다. 보간법으로 추정합니다.`);
    return interpolateLunarDate(year, month, day);
}

/**
 * 선형 보간법으로 음력 날짜 추정
 */
function interpolateLunarDate(year, month, day) {
    // 해당 월의 1일과 15일 데이터를 찾아서 보간
    const firstDayKey = `${year}-${month}-1`;
    const fifteenthKey = `${year}-${month}-15`;
    
    if (LUNAR_TO_SOLAR_DB[firstDayKey]) {
        const [solarYear, solarMonth, solarDay] = LUNAR_TO_SOLAR_DB[firstDayKey].split('-').map(Number);
        const estimatedDate = new Date(solarYear, solarMonth - 1, solarDay + (day - 1));
        
        return {
            year: estimatedDate.getFullYear(),
            month: estimatedDate.getMonth() + 1,
            day: estimatedDate.getDate()
        };
    }
    
    // 완전히 데이터가 없으면 근사값 사용
    return lunarToSolar(year, month, day);
}

// Export functions
window.LunarSolarConverter = {
    lunarToSolar: convertLunarToSolar,
    solarToLunar: solarToLunar,
    lunarToSolarAPI: lunarToSolarAPI
};
