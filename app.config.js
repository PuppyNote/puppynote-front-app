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
      // CAMERA를 일부러 선언하지 않습니다: react-native-webview 13.15.0의
      // RNCWebViewModuleImpl#needsCameraPermission()이 "매니페스트에 CAMERA가
      // 있는데 런타임 허용은 안 된 상태"면 캡처 인텐트를 그냥 null로 두고 조용히
      // 포기합니다(별도 권한 요청 로직 없음) - <input capture> 눌러도 아무 반응이
      // 없던 원인이 이것입니다. CAMERA를 선언 안 하면 이 라이브러리는 카메라 촬영을
      // 외부 카메라 앱에 위임하는 경로를 타는데, 그 경로는 우리 앱이 CAMERA 권한을
      // 가질 필요가 없습니다. ponytail: 네이티브 카메라 기능(예: expo-camera)을
      // 앱에서 직접 쓰게 되면 그때 런타임 권한 요청 플로우를 붙이고 다시 선언하세요.
      permissions: [
        "android.permission.CALL_PHONE",
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
