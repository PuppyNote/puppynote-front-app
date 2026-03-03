import 'dotenv/config';

export default {
  expo: {
    name: "PuppyNote",
    slug: "puppynote-front-app",
    scheme: "puppynote",
    version: "1.0.0",
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
      supportsTablet: true,
      bundleIdentifier: "com.puppynote",
      googleServicesFile: "./GoogleService-Info.plist"
    },
    android: {
      package: "com.puppynote",
      googleServicesFile: "./google-services.json",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      },
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
      [
        "expo-build-properties",
        {
          android: {
            "extraMavenRepos": ["https://devrepo.kakao.com/nexus/content/groups/public/"]
          }
        }
      ],
      [
        "expo-build-properties",
        {
          android: {
            "extraMavenRepos": ["https://devrepo.kakao.com/nexus/content/groups/public/"]
          }
        }
      ],
      [
        "@react-native-seoul/kakao-login",
        {
          kakaoAppKey: process.env.KAKAO_NATIVE_APP_KEY,
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
