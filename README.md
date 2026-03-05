# 🐾 PuppyNote (퍼피노트) - Front-end

PuppyNote는 반려동물의 산책 기록, 건강 상태, 물품 관리 및 가족 공유 기능을 제공하는 통합 반려동물 케어 플랫폼입니다. Expo와 React Native를 기반으로 제작되어 iOS와 Android 환경에서 원활한 사용자 경험을 제공합니다.

## 🚀 주요 기능

### 1. 산책 관리 (Walk Management)
- 실시간 산책 기록 및 과거 산책 이력 조회.
- 산책 거리, 시간 등 상세 데이터 관리.
- 산책 상세 모달을 통한 빠른 정보 확인.

### 2. 물품 및 소모품 관리 (Supplies)
- 사료, 간식, 배변 패드 등 반려동물 용품 재고 관리.
- 사용자 정의 카테고리 생성 및 관리 기능.
- 물품별 상세 정보 및 구매 주기 기록.

### 3. 가족 공유 및 관리 (Family Group)
- 초대 코드를 통한 가족 구성원 초대 및 공동 관리.
- 반려동물 프로필 등록 및 공유.
- 가족 구성원 간 실시간 활동 공유.

### 4. 알림 및 커스텀 설정 (Notification & Settings)
- 푸시 알림을 통한 활동 리마인더 및 알람 관리.
- 앱 내 알림 이력 확인.
- 테마 및 사용자 프로필 설정.

## 🛠 Tech Stack

- **Framework:** [Expo](https://expo.dev/) (SDK 54) / [React Native](https://reactnative.dev/)
- **Language:** TypeScript
- **Styling:** [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Navigation:** [React Navigation v7](https://reactnavigation.org/)
- **API Client:** Axios (Custom Interceptors for Auth)
- **Security:** Expo Secure Store (JWT & Sensitive Data)
- **Build Tool:** EAS (Expo Application Services)

## 📁 프로젝트 구조

```text
src/
├── components/      # 재사용 가능한 UI 컴포넌트 (Button, Modal, Card 등)
├── navigation/      # Stack 및 Tab 네비게이션 설정 (AppNavigator)
├── screens/         # 각 기능별 화면 (Home, Walk, Health, Supply, Auth 등)
├── services/        # API 호출 및 비즈니스 로직 (ApiService, AuthService 등)
├── types/           # 공통 타입 및 인터페이스 정의
├── utils/           # 날짜 계산, 포맷팅 등 유틸리티 함수
└── context/         # 전역 상태 관리를 위한 React Context
```

## ⚙️ 시작하기

### 사전 준비
- Node.js (LTS 버전 권장)
- npm 또는 yarn
- Expo Go 앱 (실기기 테스트용)

### 설치 및 실행
1. 의존성 패키지 설치:
   ```bash
   npm install
   ```
2. 환경 변수 설정:
   루트 디렉토리에 `.env` 파일을 생성하고 필요한 API Base URL 등을 설정합니다.

3. 앱 실행:
   ```bash
   # Expo 개발 서버 시작
   npm start

   # 플랫폼별 실행
   npm run android
   npm run ios
   ```

