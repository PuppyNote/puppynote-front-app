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
        NSHumanReadableCopyright: "Copyright © 2026 PuppyNote. All rights reserved."
      },
      config: {}
    },
    android: {
      versionCode: 4, // 필요시 packageJson.version을 기반으로 자동 계산 로직 추가 가능
      package: "com.puppynote",
      googleServicesFile: "./google-services.json",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY || ""
        }
      },
      permissions: [
        "android.permission.CALL_PHONE"
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
        "react-native-android-widget",
        {
          widgets: [
            {
              name: "WeeklyCalendar",
              label: "주간 산책 캘린더",
              description: "이번 주 산책 기록을 확인하세요.",
              minWidth: "160dp",
              minHeight: "110dp",
              targetCellWidth: 2,
              targetCellHeight: 1
            },
            {
              name: "MonthlyCalendar",
              label: "월간 산책 캘린더",
              description: "이번 달 산책 기록을 확인하세요.",
              minWidth: "160dp",
              minHeight: "160dp",
              targetCellWidth: 2,
              targetCellHeight: 2
            }
          ]
        }
      ],
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
          kakaoAppKey: process.env.KAKAO_NATIVE_APP_KEY || ""
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "15ac1ca0-2636-4f5e-a117-8fd5eaff2c24"
      },
      supportUrl: "https://github.com/tkdrl/puppynote-front-app"
    }
  }
};
