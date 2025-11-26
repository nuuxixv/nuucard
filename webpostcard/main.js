import CryptoJS from 'crypto-js';

const SECRET_KEY = 'nuucard-xmas-secret-key'; 

document.addEventListener('DOMContentLoaded', () => {
  const messageInput = document.getElementById('messageInput');
  const encryptBtn = document.getElementById('encryptBtn');
  const resultArea = document.getElementById('result-area');
  const skinSelector = document.getElementById('skinSelector');
  const imageSelector = document.getElementById('imageSelector');
  const senderContainer = document.getElementById('senderContainer');
  
  let selectedSkin = 'basic';
  let selectedCard = '';

  // 스킨 선택 로직
  if (skinSelector) {
    skinSelector.addEventListener('click', (e) => {
      if (e.target.classList.contains('skin-option')) {
        document.querySelectorAll('.skin-option').forEach(el => el.classList.remove('selected'));
        e.target.classList.add('selected');
        selectedSkin = e.target.dataset.skin;
        
        senderContainer.className = `container skin-${selectedSkin}`;
        
        const isDark = ['red', 'green', 'navy'].includes(selectedSkin);
        senderContainer.style.color = isDark ? 'white' : '#333';
        document.querySelector('h1').style.color = isDark ? 'white' : '#333';
        document.querySelectorAll('.label').forEach(el => el.style.color = isDark ? 'rgba(255,255,255,0.8)' : '#555');
      }
    });
  }

  // 엽서 선택 로직
  if (imageSelector) {
    imageSelector.addEventListener('click', (e) => {
      // img 태그나 div 태그 클릭 시 상위 .img-option 찾기
      const option = e.target.closest('.img-option');
      if (option) {
        document.querySelectorAll('.img-option').forEach(el => {
          el.classList.remove('selected');
          el.style.borderColor = 'transparent';
          if(el.dataset.card === '') el.style.borderColor = '#eee';
        });
        
        option.classList.add('selected');
        option.style.borderColor = '#333';
        selectedCard = option.dataset.card;
      }
    });
  }

  if (encryptBtn) {
    encryptBtn.addEventListener('click', () => {
      const message = messageInput.value.trim();
      if (!message) {
        alert('메시지를 입력해주세요!');
        return;
      }

      try {
        const encrypted = CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
        const safeEncrypted = encodeURIComponent(encrypted);

        const currentUrl = window.location.href;
        const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
        
        let viewLink = `${baseUrl}/view.html?data=${safeEncrypted}&skin=${selectedSkin}`;
        if (selectedCard) {
          viewLink += `&card=${selectedCard}`;
        }

        linkDisplay.textContent = viewLink;
        resultArea.style.display = 'block';
        
        // 결과 영역 텍스트 색상 보정 (어두운 배경일 때 잘 보이도록)
        if(['red', 'green', 'navy'].includes(selectedSkin)) {
             linkDisplay.style.color = '#333'; // 링크 박스는 항상 밝은 배경이므로 글자는 어둡게
             document.querySelector('#result-area p').style.color = 'white';
        }

      } catch (error) {
        console.error('Encryption failed:', error);
        alert('암호화 중 오류가 발생했습니다.');
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = linkDisplay.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert('링크가 복사되었습니다! 친구에게 전달하세요.');
      }).catch(err => {
        console.error('Copy failed:', err);
        alert('복사에 실패했습니다. 직접 드래그해서 복사해주세요.');
      });
    });
  }
});
