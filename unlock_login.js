// 로그인 차단 해제 스크립트
// 브라우저 콘솔(F12 → Console)에서 실행하세요

localStorage.removeItem('loginAttempts');
console.log('✅ 로그인 차단이 해제되었습니다.');
location.reload();
