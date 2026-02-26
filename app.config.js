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
      bundleIdentifier: "com.puppynote"
    },
    android: {
      package: "com.puppynote",
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
      "expo-secure-store",
      "expo-notifications",
      [
        "@react-native-seoul/kakao-login",
        {
          kakaoAppKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY
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
