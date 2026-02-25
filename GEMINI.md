# PuppyNote Front-end Project

A React Native application built with Expo for managing pet-related activities, health, and supplies.

## 🚀 Project Overview

- **Purpose:** A comprehensive pet management tool for tracking walks, health records, and pet supplies.
- **Main Technologies:**
    - **Framework:** [Expo](https://expo.dev/) (SDK 54) / React Native (0.81)
    - **Language:** TypeScript
    - **Navigation:** [React Navigation v7](https://reactnavigation.org/)
    - **Styling:** [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
    - **API Client:** Axios with custom interceptors for authentication.
    - **State/Storage:** Expo Secure Store for sensitive data.

## 📁 Directory Structure

- `src/components`: Reusable UI components (Buttons, Cards, Modals, Tabs).
- `src/navigation`: Navigation configuration and stack/tab definitions.
- `src/screens`: Individual screens organized by feature (Home, Health, Supply, Walk, Login).
- `src/services`: 
    - `ApiService.ts`: Centralized Axios instance with base URL and interceptors.
    - `auth/`: Authentication, storage, and device-related services.
- `assets`: Static assets including icons for the bottom tab and login buttons.

## 🛠 Building and Running

Ensure you have the Expo CLI and necessary mobile emulators/physical devices set up.

- **Start Development Server:**
  ```bash
  npm start
  ```
- **Run on Android:**
  ```bash
  npm run android
  ```
- **Run on iOS:**
  ```bash
  npm run ios
  ```
- **Run on Web:**
  ```bash
  npm run web
  ```

## 🏗 Development Conventions

### 1. Styling
- The project supports **NativeWind (Tailwind CSS)**. Use utility classes for rapid styling.
- Standard `StyleSheet` is also used in some legacy or complex components. 
- Global styles are defined in `global.css`.

### 2. API Interaction
- All API calls should go through `apiService` located in `src/services/ApiService.ts`.
- The base URL is `https://sangkihan.co.kr/puppynote`.
- Authentication tokens are automatically handled by request interceptors using `StorageService`.
- Expected response format: `ApiResponse<T>` which includes `statusCode`, `message`, and `data`.

### 3. Navigation
- Defined in `src/navigation/AppNavigator.tsx`.
- Uses a `MainTabs` structure for the core app experience.
- Custom components like `BottomTab` and `TopBar` are used for a consistent look.

### 4. Components
- Prefer functional components with hooks.
- Use the custom `Layout` component for consistent screen padding and safe area handling.
- Use `CustomText` or `Text` from components to ensure proper font rendering if applicable.

<!-- ## 📝 TODO / Roadmap -->
<!-- - [ ] Implement full health record management.
- [ ] Add real-time walk tracking.
- [ ] Integrate push notifications (Expo Notifications is already installed). -->
