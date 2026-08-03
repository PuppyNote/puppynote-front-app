import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { CustomText as Text } from '../common/item/CustomText';

interface WebViewSplashProps {
  /** false가 되면 페이드아웃 후 스스로 언마운트되지 않고 pointerEvents만 해제합니다. */
  visible: boolean;
  onHidden?: () => void;
}

/**
 * WebView가 첫 화면을 그릴 때까지 덮어두는 스플래시.
 * 기존 `SplashScreen`과 동일한 비주얼을 쓰되, 네비게이션 없이 오버레이로만 동작합니다.
 */
export default function WebViewSplash({ visible, onHidden }: WebViewSplashProps) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [logoAnim]);

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(1);
      return;
    }
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onHidden?.();
    });
  }, [visible, fadeAnim, onHidden]);

  return (
    <Animated.View
      style={[styles.overlay, { opacity: fadeAnim }]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Animated.View style={[styles.content, { opacity: logoAnim }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/puppynote-icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.titleText}>PuppyNote</Text>
        <Text style={styles.subtitleText}>Growth & Health Tracker</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fcfaf2',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
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
  titleText: {
    color: '#0f172a',
    fontSize: 40,
    fontWeight: 'bold',
    letterSpacing: -1,
    marginTop: 32,
    marginBottom: 8,
  },
  subtitleText: {
    color: '#eebd2b',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
