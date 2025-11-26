# 🎄 Project: nuucard (Christmas Sprint)

## 1. Brand Identity (BI)

- **Brand Name:** nuucard
- **Core Concept:** **Digi-log** (디지털로 전하는 아날로그 감성)
- **Visual Key:**
  - `_` (Blinking Cursor): 디지털의 상징
  - **Tear Strip**: 아날로그 봉투를 뜯는 햅틱/애니메이션 경험

## 2. Service Architecture

단순 쇼핑몰이 아닌, **"디지털 엽서 발송 & 실물 소장 플랫폼"**으로 피벗.

### Core User Flow

1. **Create (Sender):**
   - 사진 선택 -> 메시지 작성 (Client-Side 암호화) -> 링크 생성 (봉투 씰링)
2. **Receive (Receiver):**
   - 링크 클릭 -> 봉투 뜯기 인터랙션 -> 편지 해독 및 감상
3. **Convert (Action):**
   - "이 순간 소장하기" (실물 구매) -> 네이버 스마트스토어 연결
4. **Add:**
   - "커피 한 잔 후원하기"

### Key Tech Specs (MVP)

- **Security:** Client-Side Encryption (AES). 서버에 평문 저장 X.
- **Share:** Dynamic OG Image (Optional for MVP, but planned).
- **Payment:** Outlink to SmartStore.

---

## 3. Priority 1: "시크릿 레터" (The Skeleton)

**목표:** 보안(Privacy) 이슈 해결 및 핵심 전송 로직 구현. **Why:** 데이터가
서버에 남지 않는다는 신뢰가 있어야 서비스 가능.

### 구현 상세 (Technical Plan)

#### 기술 스택

- **Framework:** Vite (Vanilla JS) - 모듈 관리 및 번들링 용이성
- **Library:** `crypto-js` (AES 암호화/복호화)
- **Hosting:** Vercel/GitHub Pages (Static Hosting)

#### 페이지 구조

1. **작성 페이지 (`index.html`)**
   - UI: 메시지 입력 `textarea`, "봉인하기" 버튼.
   - Logic:
     - 사용자 입력 텍스트 획득.
     - `crypto-js` AES로 암호화.
     - 암호화된 문자열을 URL Safe하게 인코딩.
     - `currentDomain/view.html?data={EncryptedString}&skin={SelectedSkin}`
       형태의 링크 생성.
     - **[New]** 스킨 선택 시 즉시 배경색 변경 (Preview).

2. **조회 페이지 (`view.html`)**
   - UI: "봉투 뜯기" (슬라이더 인터랙션), 복호화된 텍스트 표시 영역.
   - Logic:
     - URL 파라미터 `data`, `skin` 파싱.
     - `crypto-js` AES로 복호화.
     - 슬라이더 100% 도달 시 봉투 Open 애니메이션.
     - **[New]** 하단 Action Button (소장하기, 나도 보내기).

### Future Improvements (Design)

- **Floating CTA:** 버튼들을 하단에 고정된 플로팅 형태로 변경하여 접근성 향상
  고려.
- **Micro-interactions:** 버튼 클릭 시 파티클 효과 등 추가.

### 개발 로드맵

1. **Project Setup:** Vite 환경 설정, `crypto-js` 설치.
2. **Core Logic:** 암호화/복호화 유틸리티 함수 작성.
3. **UI Implementation:**
   - Sender: 입력 폼 및 링크 생성 화면.
   - Receiver: 데이터 파싱 및 본문 표시 화면.
4. **Verification:** 로컬 환경에서 링크 생성 -> 새 탭에서 열기 -> 내용 확인
   테스트.
