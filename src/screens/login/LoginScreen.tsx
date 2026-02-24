import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Layout, Text, CustomAlert } from '../../components';
import { authService } from '../../services/AuthService';
import { storageService } from '../../services/StorageService';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom Alert State
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showAlert = (title: string, message: string, onConfirm = () => setAlertConfig(prev => ({ ...prev, visible: false }))) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      onConfirm,
    });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('알림', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(email, password);

      // Save tokens
      await storageService.saveAccessToken(response.accessToken);
      await storageService.saveRefreshToken(response.refreshToken);

      setIsLoading(false);
      navigation.replace('MainTabs');
    } catch (error: any) {
      setIsLoading(false);
      showAlert('오류', error.message || '로그인에 실패했습니다.');
    }
  };

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
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput 
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor="#94a3b8"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#0f172a" />
          ) : (
            <Text style={styles.loginButtonText}>로그인</Text>
          )}
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

      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
      />
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
