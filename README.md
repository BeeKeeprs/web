# ourbee 아워비 제품 소개 사이트

스마트 벌통과 개폐기를 소개하는 Next.js 랜딩페이지입니다. 벌통 조회와 기기 관리는 별도의 휴대폰 앱에서 제공합니다.

## 실행

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm build
```

## 구성

- `src/app/page.tsx`: 제품 소개, 사용 방법, FAQ, 이메일 문의
- `src/app/globals.css`: 반응형 디자인, 로컬 Pretendard 폰트
- `src/app/not-found.tsx`: 삭제된 웹 앱 주소를 포함한 404 안내
- `public/images/strawberry-greenhouse.png`: AI로 생성한 딸기꽃 사진
- `design/`: 디자인 참고와 구현 검증 기록

기존 웹 앱 화면, 로그인 상태 관리, 검색·진단 API 프록시, 리포트와 농약 기능 및 전용 자산은 제거했습니다. 이전 경로는 404를 반환합니다.

문의 링크는 기존 페이지의 `support@webee.kr`을 유지했습니다. 실제 메일 수신 여부나 기기 동작·설치 호환성은 이번 웹 작업에서 검증하지 않았습니다. 웹사이트는 별도의 API 환경변수 없이 렌더링됩니다.

## 인터랙티브 탐색

제품 사진 전환·확대, 목표 온도 조절, 제공된 측정 기록의 시간 선택·재생·비교 그래프, 출입구 열기·닫기 시뮬레이션, 단계별 설치 안내를 제공합니다. 체험은 로컬 상태만 사용하며 기기나 API에 연결하지 않습니다. 변경 내용과 검증 결과는 `design/hardware-phone-notes.md`에 기록했습니다.

## 실제 제품·앱 화면

현재 첫 화면은 제공된 스마트벌통 본체·설치 사진과 앱 캡처를 사용합니다. 목표 온도 조작과 실제 측정 기록 탐색을 체험할 수 있습니다. 데이터 출처와 검증, 외부 플러그인의 실행 제한은 `design/hardware-phone-notes.md`에 기록했습니다.

## Vercel 배포

화면 브랜드는 ourbee / 아워비입니다. 새 문의 메일이 확정되기 전에는 기존 `support@webee.kr`을 유지합니다. 제공된 실제 앱 캡처는 원본 그대로 표시합니다.

메타데이터·사이트맵·robots는 `SITE_URL`을 우선 사용하고, 미설정 시 Vercel의 `VERCEL_PROJECT_PRODUCTION_URL`을 사용합니다. 로컬 기본값은 `http://localhost:3000`입니다. 새 도메인을 연결할 때 `SITE_URL`을 지정하고 다시 배포합니다.

`.vercelignore`는 로컬 환경변수 파일, 디자인 작업 기록, 별도 작업 폴더를 CLI 업로드에서 제외합니다. 인증정보와 `.vercel` 연결 설정은 커밋하지 않습니다.

## 방문 분석

모든 페이지에 Google Analytics 4(`G-QLKGH4HHRP`)와 Google Tag Manager(`GTM-PH5ZNKVV`)를 공통 레이아웃에서 한 번씩 불러옵니다. GTM 컨테이너에서 같은 GA4 측정 ID를 다시 실행하면 페이지뷰가 중복 집계되므로, GTM에서는 별도의 GA4 구성 태그를 추가하지 않습니다.

Meta Pixel(`1528209969075771`)은 모든 페이지에서 `PageView`를 기록합니다. Facebook 도메인 인증 메타태그는 JavaScript가 아닌 서버 렌더링된 `<head>`에 포함됩니다.
