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
