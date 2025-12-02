# 설정 가이드 (Setup Guide)

## 1. Supabase 설정

1. [Supabase](https://supabase.com/) 프로젝트 생성.
2. **SQL Editor**에서 `letters` 테이블 생성:
   ```sql
   create table letters (
     id uuid default gen_random_uuid() primary key,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     content text not null
   );
   ```

3. **RLS (Row Level Security) 설정**: 데이터베이스 보안을 위해 아래 SQL을
   실행하여 정책을 추가하세요. (필수)
   ```sql
   -- RLS 활성화
   alter table letters enable row level security;

   -- 익명 사용자(누구나) 편지 저장 허용
   create policy "Enable insert for anon users" on "public"."letters"
   as permissive for insert to anon with check (true);

   -- 익명 사용자(누구나) ID로 편지 조회 허용
   create policy "Enable select for anon users" on "public"."letters"
   as permissive for select to anon using (true);
   ```

## 2. Cloudflare Turnstile 설정

도메인이 없어도 **localhost**에서 테스트할 수 있습니다.

### 방법 A: 테스트용 더미 키 사용 (개발용)

Cloudflare에 가입하지 않고 바로 테스트하려면 아래 키를 사용하세요. (항상 성공함)

- **Site Key**: `1x00000000000000000000AA`
- **Secret Key**: `1x0000000000000000000000000000000AA`

### 방법 B: 실제 키 발급 (배포용)

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) > Turnstile 이동.
2. 사이트 추가 (Add Site).
3. **Domain 입력 주의사항**:
   - `https://`나 뒤의 `/`를 **제외하고** 입력하세요.
   - ❌ `https://nuucard.vercel.app/`
   - ✅ `nuucard.vercel.app`
   - 로컬 테스트 시: `localhost` 입력.

## 3. 환경 변수 (.env.local)

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 내용을 채워주세요.

````env
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudflare Turnstile (필수 - 테스트용 더미 키 예시)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA

# Kakao Share (선택 - 공유 기능용)
NEXT_PUBLIC_KAKAO_JS_KEY=your_kakao_javascript_key

# Google Sheets (선택 - 주문 데이터 저장용)
GOOGLE_CLIENT_EMAIL=your_google_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_SHEET_ID=your_google_sheet_id

# 설정 가이드 (Setup Guide)

## 1. Supabase 설정

1. [Supabase](https://supabase.com/) 프로젝트 생성.
2. **SQL Editor**에서 `letters` 테이블 생성:
   ```sql
   create table letters (
     id uuid default gen_random_uuid() primary key,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     content text not null
   );
````

3. **RLS (Row Level Security) 설정**: 데이터베이스 보안을 위해 아래 SQL을
   실행하여 정책을 추가하세요. (필수)
   ```sql
   -- RLS 활성화
   alter table letters enable row level security;

   -- 익명 사용자(누구나) 편지 저장 허용
   create policy "Enable insert for anon users" on "public"."letters"
   as permissive for insert to anon with check (true);

   -- 익명 사용자(누구나) ID로 편지 조회 허용
   create policy "Enable select for anon users" on "public"."letters"
   as permissive for select to anon using (true);
   ```

## 2. Cloudflare Turnstile 설정

도메인이 없어도 **localhost**에서 테스트할 수 있습니다.

### 방법 A: 테스트용 더미 키 사용 (개발용)

Cloudflare에 가입하지 않고 바로 테스트하려면 아래 키를 사용하세요. (항상 성공함)

- **Site Key**: `1x00000000000000000000AA`
- **Secret Key**: `1x0000000000000000000000000000000AA`

### 방법 B: 실제 키 발급 (배포용)

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) > Turnstile 이동.
2. 사이트 추가 (Add Site).
3. **Domain 입력 주의사항**:
   - `https://`나 뒤의 `/`를 **제외하고** 입력하세요.
   - ❌ `https://nuucard.vercel.app/`
   - ✅ `nuucard.vercel.app`
   - 로컬 테스트 시: `localhost` 입력.

## 3. 환경 변수 (.env.local)

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 내용을 채워주세요.

```env
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudflare Turnstile (필수 - 테스트용 더미 키 예시)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA

# Kakao Share (선택 - 공유 기능용)
NEXT_PUBLIC_KAKAO_JS_KEY=your_kakao_javascript_key

# Google Sheets (선택 - 주문 데이터 저장용)
GOOGLE_CLIENT_EMAIL=your_google_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_SHEET_ID=your_google_sheet_id

# Analytics (선택 - 통계/분석용)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
NEXT_PUBLIC_CLOUDFLARE_BEACON_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 🔑 ID/Token 발급 방법

#### 1. Google Analytics (GA4)

1. [Google Analytics](https://analytics.google.com/) 접속 및 계정 생성.
2. **관리(Admin)** > **데이터 스트림(Data Streams)** > **웹(Web)** 선택.
3. 웹사이트 URL 입력 (`nuucard.vercel.app`) 및 스트림 생성.
4. **측정 ID (Measurement ID)** 복사 (예: `G-XXXXXXXXXX`).

#### 2. Microsoft Clarity

1. [Microsoft Clarity](https://clarity.microsoft.com/) 접속 및 프로젝트 생성.
2. **Settings** > **Overview** 이동.
3. **Project ID** 복사 (예: `k9...` 형태의 문자열).

#### 3. Cloudflare Web Analytics

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) 접속.
2. **Web Analytics** 메뉴 선택 > **Add a site**.
3. 도메인 입력 (`nuucard.vercel.app`) (자신의 도메인이 없다면 건너뛰거나 임의
   입력).
4. **JS Snippet** 복사 화면에서 `token` 값만 추출.
   - 코드 예: `{"token": "THIS_IS_THE_TOKEN"}`
   - `THIS_IS_THE_TOKEN` 부분만 복사.

## 4. 실행

```bash
npm install
npm run dev
```
