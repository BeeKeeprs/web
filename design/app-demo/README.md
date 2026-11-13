# 홈페이지 앱 데모 (public/app-demo)

모바일 앱(`D:\webee-web\mobile`)을 `react-native-web`으로 빌드해 홈페이지 폰 화면에 넣은 결과물입니다.
서버·로그인 없이 돌도록 가짜 로그인과 가짜 API(`install.ts`)를 끼워 넣습니다. 앱 원본은 수정하지 않습니다.

## 다시 만드는 법
1. 앱 폴더를 새 위치로 복사합니다(`node_modules`, `android`, `.env`, `.git` 제외). 같은 드라이브(D:)여야 하고,
   `node_modules`는 원본으로 junction 연결합니다. (다른 드라이브면 expo-router가 라우트를 못 찾습니다.)
2. 복사본 `app/_layout.tsx`에서 `const showFooter = ...` 줄을 `const showFooter = false;`로 바꿔 하단 메뉴바를 끕니다.
   복사본에 이 폴더의 `install.ts`를 `src/demo/install.ts`로 넣고, `app/_layout.tsx` 맨 위에 `import "@/demo/install";`을 추가합니다.
3. 복사본 `app.json`에서 `userInterfaceStyle` 줄을 지우고 `"experiments": { "baseUrl": "/app-demo" }`와 `web.output: "single"`을 넣습니다.
4. `build-demo.sh`를 실행합니다(키·비밀값은 모두 빈 값으로 빌드). 결과 `dist/`를 이 프로젝트의 `public/app-demo/`로 복사합니다.
5. `next.config.ts`의 rewrites가 `/app-demo/<route>`를 `index.html`로 보내 줍니다.

앱 화면이 바뀌면 위 과정을 다시 돌려야 홈페이지에도 반영됩니다. 용량은 약 40MB입니다.

리포트 요약 UI: 빌드 전 이 폴더의 `ReportPanel.tsx`를 복사본 `src/features/hive-home/components/ReportPanel.tsx`에 적용합니다. 요약의 온도 유지·벌 출입·증가율은 홈페이지용 예시이며 실제 측정값이 아닙니다.

요약 배너: `DemoSummaryBanner.tsx`를 같은 components 폴더로 복사하고, `screens/hive-control.tsx`에서 import하여 `<HiveStatusPager>` 바로 앞에 `<DemoSummaryBanner />`를 배치합니다.

`hive-control.tsx`는 데모 화면 배치 복사본입니다. 빌드 전 `src/screens/hive-control.tsx`에 적용하면 요약 → 온도 → 리포트 → 조작 → 벌 교체 순서를 유지합니다.

농장 리포트 인트로 색상: 이 폴더의 `report.tsx`를 복사본 `src/screens/report.tsx`에 적용합니다. 상단 카드, 단계 번호, 하단 버튼을 한 가지 파란색 계열로 맞춘 홈페이지 데모 화면입니다.
