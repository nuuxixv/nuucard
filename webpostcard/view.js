import CryptoJS from 'crypto-js';

const SECRET_KEY = 'nuucard-xmas-secret-key';

document.addEventListener('DOMContentLoaded', () => {
  const envelope = document.getElementById('envelope');
  const sealArea = document.getElementById('seal-area');
  const letterPaper = document.getElementById('letterPaper');
  const messageDisplay = document.getElementById('messageDisplay');
  const errorMsg = document.getElementById('errorMsg');
  
  const tearWrapper = document.getElementById('tearWrapper');
  const tearCover = document.getElementById('tearCover');
  const tearHandle = document.getElementById('tearHandle');

  // URL 파라미터 파싱
  const urlParams = new URLSearchParams(window.location.search);
  const encryptedData = urlParams.get('data');
  const skin = urlParams.get('skin') || 'basic'; // 스킨 정보 없으면 basic

  // 1. 스킨 적용 (박스 컨셉이라 일단 basic 유지하되, 필요시 확장)
  // envelope.className = `container skin-${skin}`; 
  
  if (!encryptedData) {
    sealArea.style.display = 'none';
    errorMsg.textContent = '잘못된 접근입니다. 편지 데이터가 없습니다.';
    return;
  }

  // --- Custom Drag Logic ---
  let isDragging = false;
  let startX = 0;
  let wrapperWidth = 0;

  function startDrag(e) {
    isDragging = true;
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    wrapperWidth = tearWrapper.offsetWidth;
    
    // 드래그 중 텍스트 선택 방지
    document.body.style.userSelect = 'none';
  }

  function onDrag(e) {
    if (!isDragging) return;
    
    const currentX = (e.touches ? e.touches[0].clientX : e.clientX);
    // wrapper의 오른쪽 끝 좌표
    const wrapperRect = tearWrapper.getBoundingClientRect();
    const wrapperRight = wrapperRect.right;
    
    // 당긴 거리 (오른쪽 -> 왼쪽)
    let pullDistance = wrapperRight - currentX;
    
    // 범위 제한 (0 ~ width)
    if (pullDistance < 0) pullDistance = 0;
    if (pullDistance > wrapperWidth) pullDistance = wrapperWidth;

    // UI 업데이트
    // 1. 커버 너비 줄이기 (전체 - 당긴 거리)
    const newWidth = wrapperWidth - pullDistance;
    tearCover.style.width = `${newWidth}px`;
    
    // 2. 핸들 위치 이동 (right 값 증가)
    tearHandle.style.right = `${pullDistance - 30}px`; // -30은 핸들 절반 보정

    // 햅틱 (일정 간격마다)
    if (navigator.vibrate && Math.floor(pullDistance) % 20 === 0) {
      navigator.vibrate(5);
    }

    // 완료 체크 (90% 이상 뜯었을 때)
    if (pullDistance > wrapperWidth * 0.9) {
      finishTear();
    }
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.userSelect = '';

    // 덜 뜯었으면 원위치
    const currentWidth = parseFloat(tearCover.style.width);
    // wrapperWidth가 계산되지 않았을 경우 대비
    const totalWidth = tearWrapper.offsetWidth;
    
    // 10% 미만으로 남았을 때만 완료 처리하고, 그 외엔 복귀 (여기선 90% 이상 뜯어야 완료이므로)
    // 현재 커버 너비가 전체의 10%보다 크면 (즉, 90% 미만으로 뜯었으면) 원위치
    if (parseFloat(tearCover.style.width) > totalWidth * 0.1) {
      tearCover.style.transition = 'width 0.3s ease';
      tearHandle.style.transition = 'right 0.3s ease';
      
      tearCover.style.width = '100%';
      tearHandle.style.right = '-40px'; // 초기 위치

      setTimeout(() => {
        tearCover.style.transition = '';
        tearHandle.style.transition = '';
      }, 300);
    }
  }

  function finishTear() {
    isDragging = false;
    document.body.style.userSelect = '';
    
    // 완전히 뜯긴 상태 고정
    tearCover.style.width = '0px';
    tearHandle.style.display = 'none';
    
    if (navigator.vibrate) navigator.vibrate([50, 50, 100]);

    // 박스 열림 애니메이션 (CSS 클래스 추가)
    envelope.classList.add('opened');

    setTimeout(() => {
      openLetter();
    }, 800);
  }

  // 이벤트 리스너 등록
  if (tearHandle) {
    tearHandle.addEventListener('mousedown', startDrag);
    tearHandle.addEventListener('touchstart', startDrag);
    
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag);
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
  }

  function openLetter() {
    try {
      // 햅틱 피드백 (성공)
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);

      const decodedStr = decodeURIComponent(encryptedData);
      const bytes = CryptoJS.AES.decrypt(decodedStr, SECRET_KEY);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);

      if (!originalText) throw new Error('Decryption failed');

      // UI 전환 애니메이션
      sealArea.style.display = 'none';
      
      // 엽서 이미지 처리 (WebP + JPG)
      const cardParam = urlParams.get('card');
      console.log('Card Param:', cardParam);

      if (cardParam) {
        const pictureEl = document.createElement('picture');
        pictureEl.style.display = 'block';
        pictureEl.style.width = '100%';
        pictureEl.style.marginBottom = '1rem';
        
        const sourceWebp = document.createElement('source');
        sourceWebp.srcset = `/assets/postcards/${cardParam}.webp`;
        sourceWebp.type = 'image/webp';
        
        const imgEl = document.createElement('img');
        imgEl.src = `/assets/postcards/${cardParam}.jpg`;
        imgEl.alt = 'Christmas Postcard';
        imgEl.style.width = '100%';
        imgEl.style.borderRadius = '8px';
        imgEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        
        pictureEl.appendChild(sourceWebp);
        pictureEl.appendChild(imgEl);
        
        messageDisplay.before(pictureEl);
      }

      messageDisplay.textContent = originalText;
      
      // 편지지 등장
      setTimeout(() => {
        letterPaper.classList.add('opened');
      }, 100);

    } catch (error) {
      console.error('Decryption error:', error);
      // 에러 시 복구 로직은 복잡하므로 간단히 알림
      errorMsg.textContent = '편지를 열 수 없습니다. (데이터 손상)';
      alert('편지를 열 수 없습니다. 링크를 다시 확인해주세요.');
    }
  }
});
