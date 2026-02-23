import React, { useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Layout } from '../components';

export default function SplashScreen({ navigation }: any) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout edges={['top', 'bottom', 'left', 'right']} backgroundColor="#fcfbf8" style={styles.center}>
      <View style={styles.spacer} />
      
      <Animated.View style={[styles.animatedContent, { opacity: fadeAnim }]}>
        <View style={styles.logoContainer}>
          <View style={styles.logoInnerOverlay} />
          <Text style={styles.logoEmoji}>📖</Text>
          <View style={styles.pawEmojiContainer}>
            <Text style={styles.pawEmoji}>🐾</Text>
          </View>
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>PuppyNote</Text>
          <Text style={styles.subtitleText}>Growth & Health Tracker</Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.loadingContainer}>
          <Text style={styles.footerText}>
            Starting your journey with your furry friend...
          </Text>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
        </View>
      </View>
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
    backgroundColor: '#eebd2b1a',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#eebd2b33',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  logoInnerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#eebd2b0d',
  },
  logoEmoji: {
    color: '#eebd2b',
    fontSize: 60,
  },
  pawEmojiContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -4,
  },
  pawEmoji: {
    color: '#eebd2b',
    fontSize: 40,
    fontWeight: 'bold',
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
