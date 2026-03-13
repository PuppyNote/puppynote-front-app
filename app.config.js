import 'dotenv/config';

export default {
  expo: {
    name: "PuppyNote",
    slug: "puppynote-front-app",
    scheme: "puppynote",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/puppynote-app-icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/puppynote-app-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.puppynote",
      googleServicesFile: "./GoogleService-Info.plist",
      icon: "./assets/puppynote-app-icon.png",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      },
      // iOS에서 Google Maps 설정을 제거하여 Apple Maps가 기본이 되도록 함
      config: {
        // googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ""
      }
    },
    android: {
      versionCode: 3,
      package: "com.puppynote",
      googleServicesFile: "./google-services.json",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY || ""
        }
      },
      adaptiveIcon: {
        foregroundImage: "./assets/puppynote-app-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      favicon: "./assets/puppynote-app-icon.png"
    },
    plugins: [
      // react-native-maps 플러그인을 제거하여 iOS에서 Google Maps 종속성을 빼버림
      // "react-native-maps", 
      [
        "expo-build-properties",
        {
          android: {
            "extraMavenRepos": ["https://devrepo.kakao.com/nexus/content/groups/public/"]
          },
          ios: {
            "useFrameworks": "static"
          }
        }
      ],
      [
        "@react-native-seoul/kakao-login",
        {
          kakaoAppKey: process.env.KAKAO_NATIVE_APP_KEY || "",
          kotlinVersion: "2.0.21"
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "15ac1ca0-2636-4f5e-a117-8fd5eaff2c24"
      }
    }
  }
};
