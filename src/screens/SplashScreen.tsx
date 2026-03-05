import React, { useEffect } from 'react';
import { View, Animated, StyleSheet, Image } from 'react-native';
import { Layout, Text } from '../components';
import { storageService } from '../services/auth/StorageService';

export default function SplashScreen({ navigation }: any) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const checkAutoLogin = async () => {
      try {
        // 토큰 존재 여부 확인
        const token = await storageService.getAccessToken();
        
        // 최소 애니메이션 시간을 보장하기 위해 2초 대기
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (token) {
          // 토큰이 있으면 메인 화면으로 이동
          navigation.replace('MainTabs');
        } else {
          // 토큰이 없으면 로그인 화면으로 이동
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Auto login check failed:', error);
        navigation.replace('Login');
      }
    };

    checkAutoLogin();
  }, []);

  return (
    <Layout edges={['top', 'bottom', 'left', 'right']} backgroundColor="#fcfbf8" style={styles.center}>
      <View style={styles.spacer} />
      
      <Animated.View style={[styles.animatedContent, { opacity: fadeAnim }]}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/puppynote-icon.png')}
            style={styles.logoImage}
          />
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>PuppyNote</Text>
          <Text style={styles.subtitleText}>Growth & Health Tracker</Text>
        </View>
      </Animated.View>

      <View style={styles.footer}/>
    </Layout>
  );
}

const styles = StyleSheet.create({
  center: {
    paddingHorizontal: 32,
    paddingBottom: 64,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spacer: {
    flex: 1,
  },
  animatedContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  titleText: {
    color: '#0f172a',
    fontSize: 40,
    fontWeight: 'bold',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitleText: {
    color: '#eebd2b',
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    maxWidth: 320,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 24,
  },
  footerText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#eebd2b33',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#eebd2b',
    borderRadius: 999,
    width: '33%',
  },
});

