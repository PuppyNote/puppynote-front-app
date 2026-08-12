import 'dotenv/config';
const packageJson = require('./package.json');

export default {
  expo: {
    name: "PuppyNote",
    slug: "puppynote-front-app",
    platforms: ["ios", "android"],
    scheme: "puppynote",
    version: packageJson.version,
    orientation: "portrait",
    icon: "./assets/puppynote-icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/puppynote-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.puppynote",
      buildNumber: packageJson.version,
      usesAppleSignIn: true,
      googleServicesFile: "./GoogleService-Info.plist",
      icon: "./assets/puppynote-ios-app-icon.png",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSHumanReadableCopyright: "Copyright © 2026 PuppyNote. All rights reserved.",
        NSCameraUsageDescription: "사진 촬영 후 게시물/기록에 첨부하기 위해 카메라 접근 권한이 필요합니다.",
        NSPhotoLibraryUsageDescription: "사진을 게시물/기록에 첨부하기 위해 사진 보관함 접근 권한이 필요합니다."
      },
      config: {}
    },
    android: {
      versionCode: 4,
      package: "com.puppynote",
      googleServicesFile: "./google-services.json",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY || ""
        }
      },
      // CAMERA는 expo-image-picker가 자기 AndroidManifest.xml에 <uses-permission
      // CAMERA>를 무조건 선언해서 여기서 빼도 최종 매니페스트에는 항상 포함된다
      // (Gradle 매니페스트 병합). 그래서 react-native-webview의
      // RNCWebViewModuleImpl#needsCameraPermission()은 "CAMERA가 선언돼 있는데
      // 런타임 허용은 안 됨" 상태를 계속 만나 <input capture> 캡처 인텐트를 조용히
      // 스킵한다(별도 권한 요청 로직이 그 라이브러리에 없음). 진짜 수정은 여기서
      // permissions를 건드리는 게 아니라 WebViewShellScreen 마운트 시점에
      // 런타임 권한을 먼저 받아두는 것 - src/screens/webview/WebViewShellScreen.tsx 참고.
      permissions: [
        "android.permission.CALL_PHONE",
        "android.permission.CAMERA",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_EXTERNAL_STORAGE"
      ],
      adaptiveIcon: {
        foregroundImage: "./assets/puppynote-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      favicon: "./assets/puppynote-icon.png"
    },
    plugins: [
      "expo-apple-authentication",
      [
        "expo-build-properties",
        {
          android: {
            "extraMavenRepos": ["https://devrepo.kakao.com/nexus/content/groups/public/"],
            "kotlinVersion": "2.0.21"
          },
          ios: {
            "useFrameworks": "static"
          }
        }
      ],
      [
        "@react-native-seoul/kakao-login",
        {
          kakaoAppKey: "73b344514a367fc1b7112b90e90b2267"
        }
      ]
    ],
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "https://api.puppynote.co.kr",
      eas: {
        projectId: "15ac1ca0-2636-4f5e-a117-8fd5eaff2c24"
      },
      supportUrl: "https://github.com/tkdrl/puppynote-front-app"
    }
  }
};
