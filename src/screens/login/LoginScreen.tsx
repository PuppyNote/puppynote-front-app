import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Layout, Text } from '../../components';

export default function LoginScreen({ navigation }: any) {
  return (
    <Layout edges={['top', 'bottom', 'left', 'right']} style={styles.center}>
      <View style={styles.headerContainer}>
        <View style={styles.logoBox}>
          <Image 
            source={require('../../../assets/puppynote-icon.png')}
            style={styles.logoImage}
          />
        </View>
        <Text style={styles.titleText}>PuppyNote</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <TextInput 
            style={styles.input}
            placeholder="이메일 주소"
            placeholderTextColor="#94a3b8"
          />
          <TextInput 
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor="#94a3b8"
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('MainTabs')}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>또는 다음으로 계속</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtonGroup}>
          <TouchableOpacity activeOpacity={0.8}>
            <Image 
              source={require('../../../assets/loginButton/kakao.png')}
              style={styles.socialButtonImage}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8}>
            <Image 
              source={require('../../../assets/loginButton/google.png')}
              style={styles.socialButtonImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>계정이 없으신가요?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupLink}>회원가입</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 80,
    height: 80,
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButtonImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
