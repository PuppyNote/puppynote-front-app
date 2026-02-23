import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Layout from '../components/Layout';

export default function LoginScreen({ navigation }: any) {
  return (
    <Layout edges={['top', 'bottom', 'left', 'right']} style={styles.center}>
      <View style={styles.headerContainer}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>📖</Text>
        </View>
        <Text style={styles.titleText}>PuppyNote</Text>
        <Text style={styles.subtitleText}>Daily care for your best friend</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <TextInput 
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#94a3b8"
          />
          <TextInput 
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('MainTabs')}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtonGroup}>
          <TouchableOpacity style={styles.kakaoButton} activeOpacity={0.8}>
            <Text style={styles.socialButtonText}>💬 Continue with Kakao</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
            <Text style={styles.socialButtonText}>G Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity>
          <Text style={styles.signupLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  center: {
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 64,
  },
  logoBox: {
    width: 96,
    height: 96,
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoEmoji: {
    color: '#eebd2b',
    fontSize: 48,
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    color: '#0f172a',
  },
  subtitleText: {
    color: '#64748b',
    marginTop: 8,
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
    maxWidth: 384,
  },
  inputGroup: {
    gap: 12,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    fontSize: 14,
  },
  loginButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#eebd2b',
    borderRadius: 999,
    shadowColor: '#eebd2b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  dividerLine: {
    height: 1,
    flex: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  socialButtonGroup: {
    gap: 12,
  },
  kakaoButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#FEE500',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: 'white',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
  signupContainer: {
    marginTop: 48,
    flexDirection: 'row',
    gap: 4,
  },
  signupText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  signupLink: {
    color: '#eebd2b',
    fontWeight: 'bold',
  },
});
