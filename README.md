# nuucard - The Warmest Letter (MVP)

디지털 코드(Code)로 가장 따뜻한 아날로그 편지의 물성(Texture)을 전하는 디지로그(Digi-log) 편지 서비스입니다.

![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

## ✨ 주요 기능

### 💌 시크릿 레터 (Secret Letter)
- **클라이언트 측 암호화**: 편지 내용은 브라우저에서 암호화되어 서버로 전송됩니다. 서버는 암호문만 저장하며, 복호화 키는 절대 서버에 저장되지 않습니다.
- **URL 해시 복호화**: `domain.com/view/[id]#[Key]` 형태의 링크를 통해서만 편지를 읽을 수 있습니다.
- **시크릿 센드**: 보낸 사람의 이름을 숨기고 익명으로 마음을 전할 수 있습니다.

### 🖼️ 감성 갤러리 (Emotional Gallery)
- **Masonry Layout**: 핀터레스트 스타일의 반응형 그리드 (모바일 2열, 데스크탑 4열)로 사진을 아름답게 보여줍니다.
- **EXIF 데이터**: 사진의 촬영 정보(카메라, 렌즈, 조리개 등)를 자동으로 추출하여 보여줍니다.
- **필터링**: 태그 기반의 부드러운 필터링 애니메이션을 제공합니다.

### 🎬 시네마틱 경험 (Cinematic Experience)
- **Expanding Cards**: 사진 선택 시 부드럽게 확장되는 애니메이션으로 몰입감을 줍니다.
- **Mobile First**: 모바일 환경에 최적화된 UX/UI를 제공합니다.

## 🛠️ 기술 스택

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Framer Motion (Animation)
- **Layout**: react-masonry-css
- **Database**: Supabase (PostgreSQL)
- **Security**: crypto-js (AES-256 Client-side Encryption), Cloudflare Turnstile
- **Analytics**: Google Analytics 4 (GA4), Microsoft Clarity
- **Social**: KakaoTalk Share API
- **Tools**: exifr (Metadata Extraction)

## 🚀 시작하기

### 1. 환경 변수 설정
`.env.local` 파일을 생성하고 설정을 입력하세요.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
NEXT_PUBLIC_KAKAO_JS_KEY=your_kakao_js_key
NEXT_PUBLIC_GA_ID=your_ga4_measurement_id
NEXT_PUBLIC_CLARITY_ID=your_clarity_project_id
```

### 2. 설치 및 실행

```bash
npm install
npm run dev
```

### 3. 사진 데이터 관리 (자동화)
새로운 사진을 `public/images/gallery/original`에 넣고 아래 스크립트를 실행하면, EXIF 정보를 추출하여 `src/data/photos.json`을 자동으로 업데이트합니다.
**50장 이상의 대량의 사진**도 스크립트 한 번으로 손쉽게 관리할 수 있습니다.

```bash
node scripts/update-photos.js
```

## 📂 프로젝트 구조

```
nuucard/
├── scripts/
│   └── update-photos.js # 사진 메타데이터 추출 스크립트
├── src/
│   ├── app/
│   │   ├── gallery/     # 갤러리 페이지
│   │   ├── write/       # 편지 작성 페이지
│   │   ├── view/        # 편지 조회 페이지
│   │   └── page.tsx     # 메인 페이지
│   ├── data/
│   │   └── photos.json  # 사진 데이터 (EXIF 포함)
│   ├── lib/
│   │   ├── crypto.ts    # 암호화 유틸리티
│   │   └── constants.ts
│   └── components/
└── public/
    └── images/
        └── gallery/
            ├── original/ # 원본 사진 (EXIF 추출용)
            └── webp/     # 웹용 최적화 이미지
```

## 📅 로드맵 (Roadmap)

- [x] 기본 편지 작성 및 조회 (암호화)
- [x] 갤러리 및 사진 선택 UX 개선
- [x] 모바일 반응형 레이아웃 (2열 그리드)
- [x] EXIF 데이터 자동 추출
- [ ] **세부 UX 개선** (마이크로 인터랙션, 로딩 상태 등)
- [x] **카카오 알림톡 연동** (공유하기 기능 강화)
- [ ] **GA 및 Clarity 연동** (사용자 행동 분석)
- [ ] **기타 검수 고도화** (크로스 브라우징, 성능 최적화)

## 📄 라이선스
MIT License
