import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Layout, Text } from '../../components';

export default function RegisterScreen({ navigation }: any) {
  const [showVerification, setShowVerification] = useState(false);

  return (
    <Layout edges={['top', 'bottom', 'left', 'right']} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.logoBox}>
            <Image 
              source={require('../../../assets/puppynote-icon.png')}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.titleText}>회원가입</Text>
          <Text style={styles.subtitleText}>퍼피노트와 함께 반려견의 일상을 기록하세요</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <View>
              <Text style={styles.label}>이름</Text>
              <TextInput 
                style={styles.input}
                placeholder="성함을 입력해주세요"
                placeholderTextColor="#94a3b8"
              />
            </View>
            
            <View>
              <Text style={styles.label}>이메일 주소</Text>
              <View style={styles.rowInputGroup}>
                <TextInput 
                  style={[styles.input, { flex: 1 }]}
                  placeholder="example@email.com"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.verifyButton}
                  onPress={() => setShowVerification(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.verifyButtonText}>인증하기</Text>
                </TouchableOpacity>
              </View>
              
              {showVerification && (
                <View style={styles.verificationContainer}>
                  <TextInput 
                    style={styles.input}
                    placeholder="인증번호 6자리 입력"
                    placeholderTextColor="#94a3b8"
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                  <Text style={styles.helperText}>이메일로 전송된 인증번호를 입력해주세요.</Text>
                </View>
              )}
            </View>

            <View>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput 
                style={styles.input}
                placeholder="8자 이상의 비밀번호"
                placeholderTextColor="#94a3b8"
                secureTextEntry={true}
              />
            </View>
            <View>
              <Text style={styles.label}>비밀번호 확인</Text>
              <TextInput 
                style={styles.input}
                placeholder="비밀번호를 다시 입력해주세요"
                placeholderTextColor="#94a3b8"
                secureTextEntry={true}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>가입하기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>이미 계정이 있으신가요?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}>로그인</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 64,
    paddingBottom: 32,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoBox: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 64,
    height: 64,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    color: '#0f172a',
  },
  subtitleText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 384,
  },
  inputGroup: {
    gap: 20,
    marginBottom: 32,
  },
  rowInputGroup: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
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
  verifyButton: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  verificationContainer: {
    marginTop: 12,
  },
  helperText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 6,
    marginLeft: 4,
  },
  registerButton: {
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
  },
  registerButtonText: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginContainer: {
    marginTop: 40,
    flexDirection: 'row',
    gap: 4,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  loginLink: {
    color: '#eebd2b',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
