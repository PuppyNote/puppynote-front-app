# PuppyNote 디자인 스펙 (모바일 웹 이식용)

> **대상 독자**: `puppynote-front-web` 모바일 웹 개발자
> **기준일**: 2026-08-03 / 기준 커밋: `cbc0dd5`
> **기준 원칙**: `figma_tokens.json`(문서상 토큰)과 실제 화면 코드가 다르면 **실제 코드가 기준**입니다.
> 이 문서의 모든 값은 `src/` 아래 실제 `StyleSheet` 코드를 전수 조사해 뽑은 값입니다.

---

## 0. 요약 — 먼저 알아야 할 것

| 항목 | 현황 |
|---|---|
| 스타일링 방식 | NativeWind v4가 설치되어 있으나 **거의 쓰이지 않음**. 화면 대부분은 `StyleSheet.create` + HEX 하드코딩 |
| `tailwind.config.js` | `theme.extend`가 **비어 있음** → 디자인 토큰이 Tailwind에 전혀 반영되어 있지 않음 |
| `figma_tokens.json` | 14개 색상 토큰만 정의. 실제 코드는 **38개 이상**의 색상값을 사용 중 |
| 색상 계열 | 브랜드 옐로우(`#eebd2b`) + Tailwind **slate** 계열 + Tailwind semantic 계열 |
| 다크모드 | **없음** (`app.config.js`의 `userInterfaceStyle: "light"` 고정) |
| 폰트 | 커스텀 폰트 없음. `CustomText`가 `fontFamily: 'sans-serif'`만 지정 (로그인 입력창만 Android에서 `monospace`) |

**웹 이식 시 권장**: 아래 §2의 "정규 토큰(권장)" 표를 그대로 CSS 변수 / Tailwind `theme.extend`로 옮기고,
§3의 화면별 대조표로 실제 화면을 맞춰가면 됩니다. §2 표의 이름은 이 프로젝트에서 새로 정한 것이므로
웹 쪽에서 그대로 쓰셔도 되고, 값만 가져가셔도 됩니다.

---

## 1. `figma_tokens.json` 문서 토큰 vs 실제 코드 사용 대조

### 1-1. 문서에 정의되어 있고 실제로도 쓰이는 토큰 (14개, 전부 사용 중)

| 토큰 경로 | 값 | 코드 내 사용 횟수 | 실제 역할 |
|---|---|---:|---|
| `colors.brand.primary` | `#eebd2b` | 94 | 주 브랜드 색. 주요 버튼 배경, 강조 텍스트, 활성 탭, 로딩 인디케이터 |
| `colors.brand.background` | `#fcfaf2` | 20 | 앱 전체 화면 배경 (`Layout` 기본값), TopBar 배경 |
| `colors.neutral.white` | `#ffffff` | `'white'` 리터럴 다수 + `#fff` 7 | 카드/모달/입력창 배경 |
| `colors.neutral.50` | `#f8fafc` | 16 | 보조 배경 (리스트 아이템, 선택 안 된 칩) |
| `colors.neutral.100` | `#f1f5f9` | 52 | 카드 테두리, 구분선, 비활성 칩 배경 |
| `colors.neutral.200` | `#e2e8f0` | 25 | 입력창 테두리, 하단탭 상단 보더, 디바이더 |
| `colors.neutral.400` | `#94a3b8` | 60 | placeholder 텍스트, 비활성 아이콘, 캡션 |
| `colors.neutral.500` | `#64748b` | 49 | 보조 텍스트(subtitle, label) |
| `colors.neutral.900` | `#0f172a` | 85 | 기본 본문/제목 텍스트 |
| `colors.semantic.success.bg` | `#f0fdf4` | 3 | 성공 뱃지 배경 |
| `colors.semantic.success.main` | `#22c55e` | 3 | 성공 뱃지 텍스트 |
| `colors.semantic.warning.bg` | `#fff7ed` | 3 | 경고 뱃지 배경 |
| `colors.semantic.warning.main` | `#f97316` | 3 | 경고 뱃지 텍스트 |
| `colors.semantic.error.bg` | `#fef2f2` | 4 | 에러 뱃지/삭제 영역 배경 |
| `colors.semantic.error.main` | `#ef4444` | 24 | 에러 텍스트, 삭제 버튼, 알림 뱃지 점 |

### 1-2. ⚠️ 실제 코드에는 있는데 문서 토큰에는 **없는** 색상 (24개)

이게 이번 조사의 핵심입니다. figma_tokens.json만 보고 이식하면 아래 색이 전부 누락됩니다.

| HEX | 사용 횟수 | Tailwind 대응 | 실제 역할 | 대표 사용처 |
|---|---:|---|---|---|
| `#cbd5e1` | 17 | slate-300 | 비활성 보더, 휠피커 구분선, 비활성 버튼 | `WheelPicker`, `AddSupplyScreen`, `SettingScreen` |
| `#475569` | 17 | slate-600 | 모달 본문 텍스트, 취소 버튼 텍스트 | `DatePickerModal`, `WithdrawalModal`, `SplashScreen` |
| `#334155` | 16 | slate-700 | 강조된 보조 텍스트, 리스트 라벨 | `PostCard`, `Calendar`, `SettingScreen` |
| `#1e293b` | 8 | slate-800 | 검색바 입력 텍스트, 카드 제목 | `SearchBar`, `FoodScreen`, `WalkDetailModal` |
| `#eebd2b1a` | 6 | brand @ 10% | 브랜드 색 반투명 보더/배경 (8자리 HEX) | `TopBar`, `AddTopBar`, `TimePickerModal` |
| `#fffbeb` | 4 | amber-50 | 산책한 날 캘린더 원, 태그 칩 배경 | `Calendar`, `AddPostScreen`, `HomeScreen` |
| `#fef3c7` | 4 | amber-100 | 아이콘 박스 배경(옐로우 계열) | `EntryOptionModal`, `HomeScreen`, `WalkManagement` |
| `#fee2e2` | 3 | red-100 | 삭제 영역 보더/배경 | `WalkDetailModal`, `SettingScreen` |
| `#E9ECEF` | 3 | (Bootstrap gray-200) | **Switch 컴포넌트 OFF 트랙 색** | `TimePickerCard`, `AlarmItem`, `AlertSettingModal` |
| `#FEE500` | 2 (+`#FEE50033` 1) | 카카오 옐로우 | **Switch ON 트랙 색** (알람 토글) | `TimePickerCard`, `AlarmItem` |
| `#f4f3f4` | 2 | — | **Switch OFF thumb 색** | `TimePickerCard`, `AlarmItem` |
| `#10b981` | 2 | emerald-500 | 인증 성공 메시지 텍스트 | `RegisterScreen`, `PasswordResetScreen` |
| `#9ca3af` | 1 | gray-400 | 산책 위치 캡션 (여기만 slate가 아닌 gray 사용 — **불일치**) | `WalkManagement` |
| `#6b7280` | 1 | gray-500 | 산책 시간 텍스트 (동일하게 gray — **불일치**) | `WalkManagement` |
| `#fefce8` | 1 | yellow-50 | 펫 이미지 placeholder 배경 | `HomeScreen` |
| `#fcfbf8` | 1 | — | **스플래시 전용 배경** (앱 배경 `#fcfaf2`와 미세하게 다름 — **불일치**) | `SplashScreen` |
| `#f59e0b` | 1 | amber-500 | 팁 카드 그림자 색 | `HomeScreen` |
| `#b45309` | 1 | amber-700 | 팁 카드 본문 텍스트 | `HomeScreen` |
| `#e0f2fe` | 1 | sky-100 | 초대코드 아이콘 박스 배경 | `EntryOptionModal` |
| `#fecaca` | 1 | red-200 | 회원탈퇴 버튼 보더 | `SettingScreen` |
| `#3e3e3e` | 1 | — | iOS Switch `ios_backgroundColor` | `TimePickerCard` |
| `#eebd2b33` | 1 | brand @ 20% | 스플래시 프로그레스바 트랙 | `SplashScreen` |
| `#000` | 34 | — | 그림자 색 전용 (`shadowColor`). **텍스트 색으로는 안 씀** | 전역 |
| `rgba(0,0,0,0.5)` | 13 | — | 모달 딤(dimmed) 오버레이 | 모든 모달 |

### 1-3. borderRadius 토큰 vs 실제

문서 토큰: `small 8px` / `medium 16px` / `large 32px` / `full 9999px`

실제 코드에서 쓰이는 값 (사용 횟수순):

| 값 | 횟수 | 토큰 매칭 |
|---:|---:|---|
| `16` | 37 | ✅ `medium` — **가장 많이 쓰임** (카드, 입력창, 모달 내부 블록) |
| `999` | 27 | ⚠️ 토큰은 `9999`인데 코드는 대부분 `999`로 씀 (렌더 결과는 동일) |
| `12` | 17 | ❌ 토큰 없음 — 작은 칩/뱃지 |
| `24` | 17 | ❌ 토큰 없음 — 큰 카드, 모달 시트 |
| `20` | 10 | ❌ 토큰 없음 |
| `8` | 8 | ✅ `small` |
| `28` | 6 | ❌ 토큰 없음 (원형 아이콘 56px의 절반) |
| `9999` | 4 | ✅ `full` |
| `4`, `14`, `22`, `32`, `50` | 각 2~4 | 부분 매칭 |
| `2`, `5`, `9`, `10`, `18`, `30` | 각 1~2 | ❌ 일회성 |

> **웹 이식 권장 스케일**: `8 / 12 / 16 / 20 / 24 / 28 / 32 / 9999`. `large: 32px`는 실제로 거의 안 쓰이니 `24`를 추가하세요.

### 1-4. spacing 토큰 vs 실제

문서 토큰: `xs 4` / `sm 8` / `md 12` / `lg 16` / `xl 20` / `xxl 24`

실제 padding·margin·gap 값 분포:

| 값 | 횟수 | 토큰 |
|---:|---:|---|
| `16` | 108 | ✅ `lg` — 최다 |
| `24` | 83 | ✅ `xxl` |
| `8` | 73 | ✅ `sm` |
| `12` | 64 | ✅ `md` |
| `20` | 47 | ✅ `xl` |
| `4` | 44 | ✅ `xs` |
| `32` | 20 | ❌ 토큰 없음 (화면 좌우 여백: 로그인/스플래시) |
| `40` | 19 | ❌ 토큰 없음 |
| `6`, `10`, `14`, `18` | 각 3~12 | ❌ 스케일 밖 (미세 조정용) |
| `48`, `60`, `64`, `100`, `120` | 각 3~7 | ❌ 대형 여백 |

> **웹 이식 권장**: 기존 6단계 + `xxxl: 32px`, `huge: 40px` 추가. 4의 배수 스케일이므로 Tailwind 기본 spacing(4px 단위)과 그대로 호환됩니다.

### 1-5. shadow 토큰 vs 실제

문서 토큰 `shadows.card`: `x0 y2 blur8 spread0 rgba(0,0,0,0.05)` → **`Card.tsx`와 정확히 일치** ✅

하지만 코드에는 토큰화되지 않은 그림자가 3종 더 있습니다:

| 이름(제안) | 값 | 사용처 | CSS 등가 |
|---|---|---|---|
| `shadow.card` ✅토큰 | `#000` / offset(0,2) / radius 8 / opacity 0.05 / elevation 2 | `Card`, 대부분의 카드 | `box-shadow: 0 2px 8px rgba(0,0,0,0.05)` |
| `shadow.input` | `#000` / offset(0,1) / radius 2 / opacity 0.05 / elevation 2 | 로그인 입력창, TopBar 아이콘 | `box-shadow: 0 1px 2px rgba(0,0,0,0.05)` |
| `shadow.brand` | `#eebd2b` / offset(0,4) / radius 8 / opacity 0.2 / elevation 4 | 주요 CTA 버튼 (17곳) | `box-shadow: 0 4px 8px rgba(238,189,43,0.2)` |
| `shadow.modal` | `#000` / opacity 0.1~0.3 / radius 10~20 | 모달 시트, FAB | `box-shadow: 0 4px 16px rgba(0,0,0,0.1)` |

> RN의 `elevation`은 웹에 대응 개념이 없으니 무시하고 `box-shadow`만 쓰면 됩니다.

### 1-6. 타이포그래피 (문서 토큰에 아예 없음 — 코드에서 추출)

| fontSize | 횟수 | 용도 (제안 이름) |
|---:|---:|---|
| `10` | 7 | `caption-xs` |
| `11` | 4 | — |
| `12` | 40 | `caption` — 뱃지, 라벨, 캡션 |
| `13` | 15 | — |
| `14` | 50 | `body` — 본문 기본 |
| `15` | 16 | — |
| `16` | 55 | `body-lg` — **최다**, 리스트 제목 |
| `18` | 24 | `title-sm` |
| `20` | 17 | `title` |
| `22` | 4 | — |
| `24` | 15 | `heading` — TopBar 제목 |
| `28` | 6 | — |
| `30` | 3 | `display-sm` — 로그인 로고 텍스트 |
| `32` | 3 | — |
| `40` | 2 | `display` — 스플래시 로고 텍스트 |

| fontWeight | 횟수 | 웹 등가 |
|---|---:|---|
| `'bold'` | 119 | `700` |
| `'600'` | 29 | `600` |
| `'500'` | 22 | `500` |
| `'700'` | 4 | `700` |
| `'300'` | 4 | `300` |

- **letterSpacing**: 제목류에 `-0.5` ~ `-1`, 대문자 라벨에 `+1` ~ `+2`
- **fontFamily**: 커스텀 폰트 **없음**. `CustomText`가 `sans-serif` 지정.
  단, `LoginScreen`의 `input`만 Android에서 `monospace` (의도된 것인지 확인 필요 — **불일치 후보**)

---

## 2. 정규 토큰 (웹 이식용 권장안)

실제 코드 기준으로 재정리한 값입니다. 그대로 CSS 변수 / Tailwind `theme.extend`에 넣으세요.

```js
// tailwind.config.js (puppynote-front-web)
theme: {
  extend: {
    colors: {
      brand: {
        DEFAULT: '#eebd2b',
        10: 'rgba(238,189,43,0.10)',  // 코드상 #eebd2b1a
        20: 'rgba(238,189,43,0.20)',  // 코드상 #eebd2b33
        bg:  '#fcfaf2',               // 앱 전역 배경
      },
      ink: {                          // = Tailwind slate. 텍스트/보더 전반
        900: '#0f172a',  // 기본 텍스트
        800: '#1e293b',  // 입력 텍스트
        700: '#334155',  // 강조 보조 텍스트
        600: '#475569',  // 모달 본문
        500: '#64748b',  // 보조 텍스트
        400: '#94a3b8',  // placeholder / 캡션
        300: '#cbd5e1',  // 비활성 보더
        200: '#e2e8f0',  // 보더 / 디바이더
        100: '#f1f5f9',  // 카드 보더 / 비활성 배경
         50: '#f8fafc',  // 보조 배경
      },
      success: { DEFAULT: '#22c55e', bg: '#f0fdf4', alt: '#10b981' },
      warning: { DEFAULT: '#f97316', bg: '#fff7ed' },
      error:   { DEFAULT: '#ef4444', bg: '#fef2f2', border: '#fee2e2', borderStrong: '#fecaca' },
      amber:   { 50: '#fffbeb', 100: '#fef3c7', 500: '#f59e0b', 700: '#b45309' },
      sky:     { 100: '#e0f2fe' },
      yellow:  { 50: '#fefce8' },
      kakao:   { DEFAULT: '#FEE500' },
      switchOff: { track: '#E9ECEF', thumb: '#f4f3f4' },
      dim: 'rgba(0,0,0,0.5)',         // 모달 오버레이
    },
    borderRadius: {
      sm: '8px', md: '12px', lg: '16px', xl: '20px',
      '2xl': '24px', '3xl': '28px', '4xl': '32px', full: '9999px',
    },
    spacing: {
      xs: '4px', sm: '8px', md: '12px', lg: '16px',
      xl: '20px', '2xl': '24px', '3xl': '32px', '4xl': '40px',
    },
    boxShadow: {
      card:  '0 2px 8px rgba(0,0,0,0.05)',
      input: '0 1px 2px rgba(0,0,0,0.05)',
      brand: '0 4px 8px rgba(238,189,43,0.2)',
      modal: '0 4px 16px rgba(0,0,0,0.1)',
    },
    fontSize: {
      'caption-xs': '10px', caption: '12px', body: '14px',
      'body-lg': '16px', 'title-sm': '18px', title: '20px',
      heading: '24px', 'display-sm': '30px', display: '40px',
    },
  },
}
```

---

## 3. 화면별 / 컴포넌트별 실제 사용 색상 대조표

> 괄호 안 숫자는 해당 파일에서의 등장 횟수입니다. 파일 경로는 `puppynote-front-app` 기준.

### 3-1. 공통 레이아웃 / 셸

| 파일 | 사용 색상 |
|---|---|
| `src/components/common/item/Layout.tsx` | `#fcfaf2`(1) — 화면 배경 기본값 |
| `src/components/common/item/TopBar.tsx` | `#fcfaf2`(3, 헤더 배경·뱃지 보더) `#0f172a`(2, 제목·뒤로가기) `#ef4444`(1, 알림 점) `#eebd2b1a`(1, 아이콘 보더) `#eebd2b`(1) `#000`(1, 그림자) |
| `src/components/common/item/AddTopBar.tsx` | `#0f172a`(2) `#fcfaf2`(1) `#eebd2b1a`(1) `#eebd2b`(1) `#cbd5e1`(1) |
| `src/components/common/item/BottomTab.tsx` | `#e2e8f0`(1, 상단 보더) + `rgba(255,255,255,0.95)` 배경 |
| `src/components/common/item/PetTab.tsx` | `#f1f5f9`(1) |

### 3-2. 공통 컴포넌트

| 파일 | 사용 색상 |
|---|---|
| `src/components/common/card/Card.tsx` | `#f1f5f9`(1, 보더) `#000`(1, 그림자) + `white` 배경 / radius 16 / padding 20 |
| `src/components/common/card/TimePickerCard.tsx` | `#eebd2b`(3) `#f1f5f9`(2) `#0f172a`(2) `#fff`(1) `#FEE50033`(1) `#FEE500`(1) `#f8fafc`(1) `#f4f3f4`(1) `#E9ECEF`(1) `#64748b`(1) `#475569`(1) `#3e3e3e`(1) |
| `src/components/common/item/Badge.tsx` | success `#f0fdf4`/`#22c55e`, warning `#fff7ed`/`#f97316`, error `#fef2f2`/`#ef4444`, neutral `#f1f5f9`/`#64748b` — radius 9999 |
| `src/components/common/item/SearchBar.tsx` | `#fff`(2) `#94a3b8`(2) `#f1f5f9`(1) `#eebd2b`(1) `#1e293b`(1) `#000`(1) |
| `src/components/common/item/MultiImageSelector.tsx` | `#94a3b8`(2) `#f1f5f9`(1) `#e2e8f0`(1) |
| `src/components/common/item/PagedFlatList.tsx` | `#eebd2b`(2, 로딩 인디케이터) `#94a3b8`(1) |
| `src/components/common/item/PhotoGallery.tsx` | `#f1f5f9`(1) |
| `src/components/common/item/ScrollableTab.tsx` | `#64748b`(2) `#fcfaf2`(1) `#ef4444`(1) `#eebd2b`(1) `#e2e8f0`(1) `#000`(1) |
| `src/components/common/item/WheelPicker.tsx` | `#cbd5e1`(1) `#0f172a`(1) |
| `src/components/common/item/FloatingActionButton.tsx` | `#eebd2b`(2) |

### 3-3. 공통 모달

| 파일 | 사용 색상 |
|---|---|
| `src/components/common/modal/CustomAlert.tsx` | `#64748b`(2) `#0f172a`(2) `#f1f5f9`(1) `#eebd2b`(1) `#000`(1) |
| `src/components/common/modal/DatePickerModal.tsx` | `#eebd2b`(2) `#0f172a`(2) `#eebd2b1a`(1) `#64748b`(1) `#475569`(1) |
| `src/components/common/modal/TimePickerModal.tsx` | `#0f172a`(3) `#eebd2b`(2) `#eebd2b1a`(1) `#64748b`(1) |
| `src/components/common/modal/GlobalDetailModal.tsx` | `#fcfaf2`(1) `#e2e8f0`(1) `#64748b`(1) `#0f172a`(1) |
| `src/components/common/modal/PetRegistrationModal.tsx` | `#0f172a`(4) `#eebd2b`(3) `#e2e8f0`(3) `#f8fafc`(2) `#f1f5f9`(2) `#94a3b8`(2) `#64748b`(2) `#cbd5e1`(1) `#475569`(1) `#334155`(1) |

> 모든 모달의 딤 배경은 `rgba(0, 0, 0, 0.5)`로 통일되어 있습니다 (12곳). 예외 1곳: `WalkDetailModal`의 삭제 확인은 `rgba(254, 242, 242, 0.9)`.

### 3-4. 로그인 / 온보딩

| 파일 | 사용 색상 |
|---|---|
| `src/screens/SplashScreen.tsx` | `#eebd2b`(2, 서브타이틀·프로그레스) `#fcfbf8`(1, ⚠️ 배경 — 앱 배경과 미세 불일치) `#eebd2b33`(1) `#475569`(1) `#0f172a`(1, 40px 로고 텍스트) |
| `src/screens/login/LoginScreen.tsx` | `#94a3b8`(4, placeholder·디바이더 라벨) `#eebd2b`(3, CTA 배경·링크) `#0f172a`(3, 제목·CTA 텍스트) `#64748b`(2) `#e2e8f0`(1, 디바이더 라인) `#000`(1) |
| `src/screens/login/RegisterScreen.tsx` | `#94a3b8`(6) `#0f172a`(4) `#ef4444`(3, 검증 에러) `#eebd2b`(3) `#64748b`(3) `#e2e8f0`(1) `#475569`(1) `#10b981`(1, 인증 성공) `#000`(1) |
| `src/screens/login/PasswordResetScreen.tsx` | `#94a3b8`(5) `#0f172a`(4) `#ef4444`(3) `#eebd2b`(3) `#64748b`(2) `#e2e8f0`(1) `#475569`(1) `#10b981`(1) `#000`(1) |
| `src/components/login/modal/EntryOptionModal.tsx` | `#fef3c7`(1, 펫등록 아이콘박스) `#e0f2fe`(1, 초대코드 아이콘박스) `#f8fafc`(1) `#f1f5f9`(1) `#94a3b8`(1) `#64748b`(1) `#1e293b`(1) `#0f172a`(1) |
| `src/components/login/modal/InviteCodeModal.tsx` | `#0f172a`(4) `#eebd2b`(2) `#f8fafc`(1) `#f1f5f9`(1) `#e2e8f0`(1) `#cbd5e1`(1) `#94a3b8`(1) `#64748b`(1) `#475569`(1) |

**로그인 CTA 버튼 스펙 (웹에서 그대로 재현할 것)**
```
background: #eebd2b; color: #0f172a; font-weight: 700;
padding: 16px 0; border-radius: 999px; width: 100%;
box-shadow: 0 4px 8px rgba(238,189,43,0.2);
```
**로그인 입력창 스펙**
```
background: #fff; border-radius: 16px; padding: 16px 20px; font-size: 14px;
box-shadow: 0 1px 2px rgba(0,0,0,0.05); placeholder-color: #94a3b8;
```
소셜 버튼: 이미지 에셋(`assets/loginButton/kakao.png`, `apple.png`), 56×56, radius 28, gap 16.
애플 버튼은 **iOS에서만 노출**됩니다.

### 3-5. 홈

| 파일 | 사용 색상 |
|---|---|
| `src/screens/home/HomeScreen.tsx` | `#eebd2b`(7) `#0f172a`(7) `#64748b`(5) `#f1f5f9`(3) `#e2e8f0`(3) `#000`(3) `#fffbeb`(2) `#ef4444`(2) `#94a3b8`(2) `#334155`(2) `#fff7ed`(1) `#fefce8`(1, 펫이미지 placeholder) `#fef3c7`(1) `#fef2f2`(1) `#fcfaf2`(1) `#f97316`(1) `#f8fafc`(1) `#f59e0b`(1, 팁카드 그림자) `#f0fdf4`(1) `#b45309`(1, 팁카드 텍스트) `#22c55e`(1) |

> 홈이 21개 색을 쓰는 **최다 사용 화면**입니다. 날씨/팁/펫프로필/요약카드가 한 화면에 모여 있어 그렇습니다.

### 3-6. 산책

| 파일 | 사용 색상 |
|---|---|
| `src/screens/walk/WalkManagement.tsx` | `#94a3b8`(3) `#000`(2) `#fef3c7`(1) `#f1f5f9`(1) `#eebd2b`(1) `#9ca3af`(1, ⚠️gray) `#6b7280`(1, ⚠️gray) `#0f172a`(1) |
| `src/screens/walk/AddWalkScreen.tsx` | `#0f172a`(4) `#e2e8f0`(3) `#eebd2b`(2) `#94a3b8`(2) `#fcfaf2`(1) `#f1f5f9`(1) `#cbd5e1`(1) `#64748b`(1) `#475569`(1) |
| `src/components/walk/card/Calendar.tsx` | `#eebd2b`(5) `#fffbeb`(1, 산책한 날 원) `#f8fafc`(1) `#f1f5f9`(1) `#94a3b8`(1) `#64748b`(1) `#334155`(1) `#0f172a`(1) |
| `src/components/walk/item/ActivityItem.tsx` | `#f1f5f9`(1) `#94a3b8`(1) `#64748b`(1) `#0f172a`(1) `#000`(1) |
| `src/components/walk/item/AlarmItem.tsx` | `#fff`/`#f4f3f4`(Switch thumb) `#FEE500`/`#E9ECEF`(Switch track) `#ef4444`(1) `#eebd2b`(1) `#cbd5e1`(1) `#0f172a`(1) `#000`(1) |
| `src/components/walk/modal/AlarmManagementModal.tsx` | `#eebd2b`(5) `#f8fafc`(1) `#94a3b8`(1) `#64748b`(1) |
| `src/components/walk/modal/WalkDetailModal.tsx` | `#f1f5f9`(3) `#ef4444`(2) `#eebd2b`(2) `#94a3b8`(2) `#1e293b`(2) `#fef2f2`(1) `#fee2e2`(1) `#475569`(1) `#000`(1) |

### 3-7. 용품

| 파일 | 사용 색상 |
|---|---|
| `src/screens/supply/SuppliesScreen.tsx` | `#eebd2b`(2) `#94a3b8`(1) |
| `src/screens/supply/AddSupplyScreen.tsx` | `#0f172a`(5) `#000`(4) `#f1f5f9`(3) `#94a3b8`(3) `#eebd2b`(2) `#e2e8f0`(2) `#cbd5e1`(2) `#fcfaf2`(1) `#64748b`(1) |
| `src/screens/supply/CategoryManagementScreen.tsx` | `#f1f5f9`(2) `#cbd5e1`(2) `#334155`(2) `#fff`(1) `#fee2e2`(1) `#fcfaf2`(1) `#ef4444`(1) `#eebd2b`(1) `#e2e8f0`(1) `#94a3b8`(1) `#64748b`(1) `#475569`(1) `#0f172a`(1) `#000`(1) |
| `src/components/supply/item/SupplyItem.tsx` | `#f1f5f9`(1) `#94a3b8`(1) `#0f172a`(1) `#000`(1) |
| `src/components/supply/modal/SuppliesDetailModal.tsx` | `#0f172a`(5) `#eebd2b`(4) `#64748b`(3) `#f1f5f9`(2) `#cbd5e1`(1) `#94a3b8`(1) `#334155`(1) `#000`(1) |
| `src/components/supply/modal/CategoryPickerModal.tsx` | `#64748b`(2) `#f8fafc`(1) `#f1f5f9`(1) `#334155`(1) `#0f172a`(1) |
| `src/components/supply/modal/CyclePickerModal.tsx` | `#eebd2b`(2) `#0f172a`(2) `#eebd2b1a`(1) `#64748b`(1) `#475569`(1) |
| `src/components/supply/modal/UserCategoryPickerModal.tsx` | `#eebd2b`(2) `#0f172a`(2) `#eebd2b1a`(1) `#64748b`(1) |

### 3-8. 커뮤니티

| 파일 | 사용 색상 |
|---|---|
| `src/screens/community/CommunityScreen.tsx` | `#fcfaf2`(2) `#f1f5f9`(2) `#f8fafc`(1) `#eebd2b`(1) `#000`(1) |
| `src/screens/community/CommunityDetailScreen.tsx` | `#f1f5f9`(3) `#fcfaf2`(2) `#ef4444`(2) `#eebd2b`(2) `#64748b`(2) `#94a3b8`(1) `#334155`(1) `#0f172a`(1) |
| `src/screens/community/AddPostScreen.tsx` | `#eebd2b`(6) `#f1f5f9`(2) `#94a3b8`(2) `#334155`(2) `#0f172a`(2) `#000`(2) `#fffbeb`(1, 태그칩) `#fcfaf2`(1) `#f8fafc`(1) `#e2e8f0`(1) `#cbd5e1`(1) `#475569`(1) |
| `src/screens/community/MyPostsScreen.tsx` | `#fcfaf2`(1) |
| `src/components/community/card/PostCard.tsx` | `#94a3b8`(2) `#f8fafc`(1) `#f1f5f9`(1) `#ef4444`(1, 좋아요) `#eebd2b`(1) `#64748b`(1) `#334155`(1) `#0f172a`(1) |

### 3-9. 건강 / 사료(AI 검색)

| 파일 | 사용 색상 |
|---|---|
| `src/components/health/item/HealthItem.tsx` | `#0f172a`(2) `#f8fafc`(1) `#f1f5f9`(1) `#eebd2b`(1) `#94a3b8`(1) `#64748b`(1) `#000`(1) |
| `src/components/health/item/CategoryTab.tsx` | (HEX 없음 — NativeWind 클래스 사용) |
| `src/screens/health/HealthScreen.tsx` | (HEX 없음 — NativeWind 클래스 사용) |
| `src/screens/food/FoodScreen.tsx` | `#eebd2b`(4) `#1e293b`(4) `#f1f5f9`(3) `#94a3b8`(3) `#475569`(3) `#ef4444`(2) `#64748b`(2) `#fff7ed`(1) `#fff`(1) `#fef2f2`(1) `#f97316`(1) `#f0fdf4`(1) `#22c55e`(1) `#0f172a`(1) `#000`(1) |

> ⚠️ `HealthScreen`과 `CategoryTab`만 NativeWind 유틸 클래스를 쓰고 나머지는 전부 `StyleSheet`입니다. 웹 이식 시엔 전부 CSS로 통일하면 됩니다.

### 3-10. 설정 / 알림

| 파일 | 사용 색상 |
|---|---|
| `src/screens/setting/SettingScreen.tsx` | `#94a3b8`(2) `#000`(2) `#fee2e2`(1) `#fecaca`(1, 탈퇴버튼 보더) `#fcfaf2`(1) `#f8fafc`(1) `#ef4444`(1) `#eebd2b`(1) `#e2e8f0`(1) `#cbd5e1`(1) `#64748b`(1) `#334155`(1) `#0f172a`(1) |
| `src/screens/setting/FamilyManagementScreen.tsx` | `#0f172a`(4) `#f1f5f9`(3) `#eebd2b`(3) `#94a3b8`(2) `#000`(2) `#fcfaf2`(1) `#f8fafc`(1) `#e2e8f0`(1) `#cbd5e1`(1) `#64748b`(1) `#334155`(1) |
| `src/screens/notification/AlertHistoryScreen.tsx` | `#eebd2b`(3) `#fcfaf2`(1) `#cbd5e1`(1) `#94a3b8`(1) `#334155`(1) `#000`(1) |
| `src/components/setting/modal/AlertSettingModal.tsx` | `#eebd2b`(2, Switch ON) `#fff`(1) `#f1f5f9`(1) `#E9ECEF`(1, Switch OFF) `#64748b`(1) `#0f172a`(1) `#000`(1) |
| `src/components/setting/modal/UserProfileModal.tsx` | `#f1f5f9`(3) `#94a3b8`(3) `#0f172a`(3) `#eebd2b`(2) `#e2e8f0`(2) `#f8fafc`(1) `#cbd5e1`(1) `#64748b`(1) `#475569`(1) `#334155`(1) |
| `src/components/setting/modal/WithdrawalModal.tsx` | `#ef4444`(3) `#f1f5f9`(1) `#cbd5e1`(1) `#64748b`(1) `#475569`(1) `#0f172a`(1) |

---

## 4. 발견된 불일치 목록 (웹 이식 시 통일 권장)

| # | 내용 | 권장 |
|---|---|---|
| 1 | `SplashScreen` 배경만 `#fcfbf8`, 나머지는 `#fcfaf2` | `#fcfaf2`로 통일 |
| 2 | `WalkManagement`만 gray 계열(`#9ca3af`, `#6b7280`) 사용, 나머지는 slate 계열 | slate(`#94a3b8`, `#64748b`)로 통일 |
| 3 | 알람 토글 Switch만 카카오 옐로우(`#FEE500`), 설정 화면 토글은 브랜드 옐로우(`#eebd2b`) | `#eebd2b`로 통일 |
| 4 | `borderRadius: 999`와 `9999`가 혼재 | 웹은 `9999px` 하나로 |
| 5 | `LoginScreen`의 입력창만 Android에서 `monospace` | 웹은 전부 동일 sans-serif |
| 6 | `figma_tokens.json`에 typography 토큰이 아예 없음 | §2 스케일 채택 |
| 7 | `tailwind.config.js`의 `theme.extend`가 비어 있어 토큰이 코드에 연결되지 않음 | 웹에서는 §2를 반드시 `theme.extend`에 넣고 시작 |

---

## 5. 화면 목록 (이식 대상 전체)

`src/navigation/AppNavigator.tsx` 기준.

**Stack (헤더 없음이 기본)**

| 라우트 | 화면 파일 | 헤더 |
|---|---|---|
| `Splash` | `screens/SplashScreen.tsx` | 없음 |
| `Login` | `screens/login/LoginScreen.tsx` | 없음 |
| `Register` | `screens/login/RegisterScreen.tsx` | 없음 |
| `PasswordReset` | `screens/login/PasswordResetScreen.tsx` | 없음 |
| `MainTabs` | 하단탭 (아래) | TopBar |
| `Walks` | `screens/walk/WalkManagement.tsx` | 없음 |
| `AddWalk` | `screens/walk/AddWalkScreen.tsx` | 없음 |
| `AddSupply` | `screens/supply/AddSupplyScreen.tsx` | 없음 |
| `CategoryManagement` | `screens/supply/CategoryManagementScreen.tsx` | 없음 |
| `CommunityDetail` | `screens/community/CommunityDetailScreen.tsx` | TopBar `게시물` |
| `AddPost` | `screens/community/AddPostScreen.tsx` | 없음 |
| `FamilyManagement` | `screens/setting/FamilyManagementScreen.tsx` | TopBar `가족 관리` |
| `AlertHistory` | `screens/notification/AlertHistoryScreen.tsx` | TopBar `알림 내역` |
| `MyPosts` | `screens/community/MyPostsScreen.tsx` | 없음 |

**하단 탭 (`MainTabs`)** — 순서대로 6개. 전부 헤더 타이틀 `PuppyNote`.

| 탭 | 화면 | 아이콘 에셋 | 비고 |
|---|---|---|---|
| `Home` | `screens/home/HomeScreen.tsx` | `assets/bottomTab/home[-click].png` | |
| `Walk` | `screens/walk/WalkManagement.tsx` | `walk[-click].png` | 펫 미등록 시 **비활성**(opacity 0.3) |
| `Supplies` | `screens/supply/SuppliesScreen.tsx` | `supply[-click].png` | 펫 미등록 시 **비활성** |
| `Community` | `screens/community/CommunityScreen.tsx` | `community[-click].png` | |
| `Food` | `screens/food/FoodScreen.tsx` | `food[-click].png` | AI 음식 검색 |
| `Settings` | `screens/setting/SettingScreen.tsx` | `setting[-click].png` | |

**하단탭 스펙**: `position: fixed; bottom: 0`, 배경 `rgba(255,255,255,0.95)`, `border-top: 1px solid #e2e8f0`,
`padding: 12px 0 32px`, 아이콘 30×30, 활성 시 `transform: scale(1.4)`.

**TopBar 스펙**: 배경 `#fcfaf2`, `padding: (safe-area-top + 8px) 24px 4px`,
제목 24px/700/`#0f172a`/letter-spacing -0.5, 우측 알림 아이콘 36×36 + 미확인 시 `#ef4444` 11px 점(보더 2px `#fcfaf2`).

---

## 6. 에셋

| 경로 | 용도 |
|---|---|
| `assets/puppynote-icon.png` | 앱 아이콘 / 스플래시 로고 / TopBar 좌측 아이콘 |
| `assets/puppynote-ios-app-icon.png` | iOS 앱 아이콘 |
| `assets/bottomTab/*.png` | 하단탭 아이콘 (일반 / `-click` 활성) 6쌍 |
| `assets/loginButton/kakao.png`, `apple.png` | 소셜 로그인 버튼 |
| `assets/alarm/alarm.png` | TopBar 알림 아이콘 |

> 웹으로 옮길 때 이 에셋들은 `puppynote-front-web`으로 복사가 필요합니다. 필요하시면 `ask_employee`로 요청 주세요.

---

## 7. 문의

이 문서에 없는 세부 스펙(특정 화면의 레이아웃, 인터랙션, 애니메이션 등)은
`ask_employee`로 **네이티브 프론트 개발자**에게 문의 주시면 실제 코드를 열어 확인해 드립니다.

관련 문서: [`02-js-bridge-protocol.md`](./02-js-bridge-protocol.md) — 웹에서 앱 네이티브 기능을 호출하는 방법
