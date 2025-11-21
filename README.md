# nuucard - 연말 엽서 판매 웹사이트

감성적인 디자인과 부드러운 애니메이션으로 직접 찍은 사진 엽서를 판매하는
프리미엄 웹사이트입니다.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## ✨ 주요 기능

### 🎬 스플래시 화면

- 진입 시 "nuucard" 로고와 함께 부드러운 오프닝 애니메이션
- Blur → Clear 효과로 몽환적인 느낌 연출

### 🖼️ 메인 갤러리

- **Swiper.js** 기반 슬라이드쇼
- 휠, 키보드, 드래그 인터랙션 지원
- **마우스 오버 시 고화질 확대** (돋보기 효과)
- **Flip 버튼**으로 엽서 앞면/뒷면 전환 (3D 애니메이션)

### 🛒 장바구니

- 우측 상단 고정 아이콘 (상품 수량 뱃지 표시)
- 모달 형태의 장바구니 UI
- 수량 조절 및 삭제 기능
- 총 금액 자동 계산

### 📝 주문서 (Checkout)

- 이름, 연락처(자동 하이픈 서식), 이메일 입력
- **카카오 주소 API** 연동 (우편번호 검색)
- 응원 메시지 입력 (선택)
- 계좌번호 안내 (무통장 입금 방식)

### 🧾 영수증

- 주문 완료 시 영수증 형태의 UI 표시
- **html2canvas**로 이미지 저장 기능
- 영수증 스타일: 도트 패턴 배경, 바코드 데코레이션

### 📊 Google Sheets 연동

- 주문 데이터를 실시간으로 구글 시트에 저장
- 상품별 수량을 개별 컬럼으로 저장하여 집계 용이
- 서비스 계정 기반 인증

---

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Carousel**: Swiper.js
- **Image Capture**: html2canvas
- **Icons**: Lucide React
- **Backend**: Google Sheets API (googleapis)
- **Deployment**: Vercel

---

## 🎨 디자인 시스템

### 컬러 팔레트

- **Background (Paper)**: `#F5F5F0` - 따뜻한 미색의 종이 느낌
- **Text (Ink)**: `#1A1A1A` - 눈이 편안한 짙은 먹색
- **Accent**: `#D4A373` - 고급스러운 샌드 베이지/골드 톤
- **Muted**: `#8E8E93` - 보조 텍스트용 그레이

### 타이포그래피

- **폰트**: Pretendard (한글/영문 통합)
- Apple 기본 폰트 스타일과 유사한 깔끔한 고딕체

---

## 📂 프로젝트 구조

```
postcard-shop/
├── public/
│   └── images/
│       └── postcards/
│           ├── thumbnails/      # 썸네일 이미지 (900x1200px)
│           ├── high-res/        # 고화질 이미지 (2400x3200px)
│           └── back.jpg         # 엽서 뒷면 (공통)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── order/
│   │   │       └── route.ts     # Google Sheets API 엔드포인트
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── SplashScreen.tsx     # 스플래시 화면
│   │   ├── Gallery.tsx          # 메인 갤러리 (Swiper)
│   │   ├── MagnifierImage.tsx   # 돋보기 확대 컴포넌트
│   │   ├── CartButton.tsx       # 장바구니 버튼
│   │   ├── CartModal.tsx        # 장바구니 모달
│   │   ├── CheckoutForm.tsx     # 주문서 폼
│   │   └── Receipt.tsx          # 영수증
│   ├── store/
│   │   └── cartStore.ts         # Zustand 장바구니 상태 관리
│   └── lib/
│       ├── constants.ts         # 엽서 데이터
│       └── utils.ts             # 유틸리티 함수
├── .env.local                   # 환경 변수 (Git 제외)
└── README.md
```

---

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/nuuxixv/nuucard.git
cd nuucard
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력:

```env
GOOGLE_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID="your-spreadsheet-id"
```

#### Google Sheets API 설정 방법:

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성
3. **Google Sheets API** 사용 설정
4. **서비스 계정** 생성 및 JSON 키 다운로드
5. 구글 스프레드시트에 서비스 계정 이메일을 **편집자** 권한으로 초대
6. 스프레드시트 URL에서 ID 추출:
   ```
   https://docs.google.com/spreadsheets/d/[THIS_IS_THE_ID]/edit
   ```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 📊 Google Sheets 데이터 구조

스프레드시트 첫 번째 행(헤더)에 다음 내용을 입력:

| A        | B    | C      | D      | E    | F           | G       | H               | I              | J            | K            | L            |
| -------- | ---- | ------ | ------ | ---- | ----------- | ------- | --------------- | -------------- | ------------ | ------------ | ------------ |
| 주문일시 | 이름 | 연락처 | 이메일 | 주소 | 응원 메시지 | 총 금액 | Sunset in Seoul | Winter Silence | Cafe Morning | Ocean Breeze | Night Lights |

- **A~E**: 고객 정보
- **F**: 응원 메시지
- **G**: 총 결제 금액
- **H~L**: 각 상품별 주문 수량 (0 또는 양수)

각 상품 열 하단에 `=SUM(H:H)` 같은 수식을 넣으면 총 주문량이 자동 계산됩니다.

---

## 🖼️ 이미지 관리

### 권장 이미지 크기

- **썸네일**: 900 x 1200px (100~300KB)
- **고화질**: 2400 x 3200px (500KB~1.5MB)
- **뒷면**: 900 x 1200px (100~200KB)

### 이미지 교체 방법

1. `public/images/postcards/` 폴더에 이미지 파일 배치
2. `src/lib/constants.ts`에서 `POSTCARDS` 배열 수정:

```typescript
{
  id: "card-01",
  title: "내 엽서 제목",
  price: 1500,
  image: "/images/postcards/thumbnails/card-01.jpg",
  highResImage: "/images/postcards/high-res/card-01.jpg",
  description: "엽서 설명",
}
```

---

## 🌐 배포 (Vercel)

### 1. GitHub에 푸시

```bash
git add .
git commit -m "Update postcards"
git push
```

### 2. Vercel 배포

1. [vercel.com](https://vercel.com) 접속 및 GitHub 로그인
2. **Import Project** → `nuuxixv/nuucard` 선택
3. **Environment Variables** 설정:
   - `GOOGLE_CLIENT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_SHEET_ID`
4. **Deploy** 클릭

---

## 📝 커스터마이징

### 계좌번호 변경

`src/components/CheckoutForm.tsx` 파일에서 계좌번호 수정:

```typescript
<p className="text-sm text-[#1A1A1A]">
    카카오뱅크 3333-XX-XXXXXX (예금주: 김건우)
</p>;
```

### 상품 추가/수정

`src/lib/constants.ts`에서 `POSTCARDS` 배열 수정

### 가격 변경

각 엽서의 `price` 값 수정 (단위: 원)

---

## 🐛 알려진 이슈

### 영수증 저장 실패

- **원인**: html2canvas의 CORS 제한
- **해결**: `useCORS: true`, `allowTaint: true` 옵션 적용됨
- **대안**: 사용자에게 스크린샷 안내

---

## 📄 라이선스

MIT License

---

## 👤 제작자

**nuuxixv**

- GitHub: [@nuuxixv](https://github.com/nuuxixv)

---

## 🙏 감사의 말

이 프로젝트는 **Google Deepmind Antigravity**의 도움으로 제작되었습니다.
