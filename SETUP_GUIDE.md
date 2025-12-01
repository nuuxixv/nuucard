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

## 2. Cloudflare Turnstile 설정
도메인이 없어도 **localhost**에서 테스트할 수 있습니다.

### 방법 A: 테스트용 더미 키 사용 (개발용)
Cloudflare에 가입하지 않고 바로 테스트하려면 아래 키를 사용하세요. (항상 성공함)
*   **Site Key**: `1x00000000000000000000AA`
*   **Secret Key**: `1x0000000000000000000000000000000AA`

### 방법 B: 실제 키 발급 (배포용)
1. [Cloudflare Dashboard](https://dash.cloudflare.com/) > Turnstile 이동.
2. 사이트 추가 (Add Site).
3. **Domain 입력 주의사항**:
    *   `https://`나 뒤의 `/`를 **제외하고** 입력하세요.
    *   ❌ `https://nuucard.vercel.app/`
    *   ✅ `nuucard.vercel.app`
    *   로컬 테스트 시: `localhost` 입력.

## 3. 환경 변수 (.env.local)
프로젝트 루트에 `.env.local` 파일을 생성하고 아래 내용을 채워주세요.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudflare Turnstile (테스트용 더미 키 예시)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

## 4. 실행
```bash
npm install
npm run dev
```
