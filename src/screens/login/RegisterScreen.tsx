import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Platform } from 'react-native';
import { Layout, Text, CustomAlert } from '../../components';
import { authService } from '../../services/AuthService';

export default function RegisterScreen({ navigation }: any) {
  const [showVerification, setShowVerification] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Validation states
  const [errors, setErrors] = useState({
    email: false,
    nickname: false,
    password: false,
    confirmPassword: false,
  });
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  // Verification states
  const [timer, setTimer] = useState(180); // 3 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [receivedCode, setReceivedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Custom Alert State
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Timer logic
  useEffect(() => {
    if (isTimerActive && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const showAlert = (title: string, message: string, onConfirm = () => setAlertConfig(prev => ({ ...prev, visible: false }))) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      onConfirm,
    });
  };

  const handleSendVerification = async () => {
    if (!email) {
      setErrors(prev => ({ ...prev, email: true }));
      showAlert('알림', '이메일 주소를 입력해주세요.');
      return;
    }
    setErrors(prev => ({ ...prev, email: false }));

    if (isLoading || isCooldown) return;

    setIsLoading(true);
    setIsCooldown(true);

    try {
      const code = await authService.sendVerification(email);
      setReceivedCode(code);
      setShowVerification(true);
      setTimer(180);
      setIsTimerActive(true);
      setIsVerified(false);
      showAlert('알림', '인증번호가 발송되었습니다.');
    } catch (error: any) {
      const errorMessage = error?.message || '인증번호 발송에 실패했습니다.';
      showAlert('오류', errorMessage);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsCooldown(false);
      }, 2000);
    }
  };

  const handleVerifyCode = () => {
    if (timer === 0) {
      showAlert('오류', '인증 시간이 만료되었습니다. 다시 시도해주세요.');
      return;
    }

    if (!verificationCode) {
      showAlert('알림', '인증번호를 입력해주세요.');
      return;
    }

    if (verificationCode === receivedCode) {
      setIsVerified(true);
      setIsTimerActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      showAlert('오류', '인증번호가 일치하지 않습니다.');
    }
  };

  const handleRegister = async () => {
    const newErrors = {
      email: !isVerified,
      nickname: !nickname,
      password: !password,
      confirmPassword: !confirmPassword,
    };
    setErrors(newErrors);

    const isPasswordMismatch = password !== confirmPassword;
    setPasswordMismatch(isPasswordMismatch);

    if (newErrors.email) {
      showAlert('알림', '이메일 인증을 완료해주세요.');
      return;
    }

    if (newErrors.nickname || newErrors.password || newErrors.confirmPassword) {
      showAlert('알림', '모든 필드를 입력해주세요.');
      return;
    }

    if (isPasswordMismatch) {
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        email,
        nickName: nickname,
        password
      });
      setIsLoading(false);
      showAlert('성공', '회원가입이 완료되었습니다.', () => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
        navigation.navigate('Login');
      });
    } catch (error: any) {
      setIsLoading(false);
      showAlert('오류', error.message || '회원가입에 실패했습니다.');
    }
  };

  return (
    <Layout edges={['top', 'bottom', 'left', 'right']} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
              <Text style={styles.label}>이메일 주소</Text>
              <View style={styles.rowInputGroup}>
                <TextInput 
                  style={[
                    styles.input, 
                    { flex: 1 },
                    errors.email && !isVerified && styles.errorInput
                  ]}
                  placeholder="example@email.com"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (errors.email) setErrors(prev => ({ ...prev, email: false }));
                  }}
                  editable={!isVerified}
                />
                <TouchableOpacity 
                  style={[
                    styles.verifyButton, 
                    (isVerified || isCooldown || isLoading) && styles.disabledButton
                  ]}
                  onPress={handleSendVerification}
                  activeOpacity={0.7}
                  disabled={isVerified || isCooldown || isLoading}
                >
                  {isLoading && (isCooldown || !showVerification) ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.verifyButtonText}>
                      {isVerified ? '인증완료' : '인증하기'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              
              {showVerification && !isVerified && (
                <View style={styles.verificationContainer}>
                  <View style={styles.rowInputGroup}>
                    <TextInput 
                      style={[styles.input, { flex: 1 }]}
                      placeholder="인증번호 6자리 입력"
                      placeholderTextColor="#94a3b8"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={verificationCode}
                      onChangeText={setVerificationCode}
                    />
                    <TouchableOpacity 
                      style={styles.confirmCodeButton}
                      onPress={handleVerifyCode}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.verifyButtonText}>확인</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.helperRow}>
                    <Text style={styles.helperText}>이메일로 전송된 인증번호를 입력해주세요.</Text>
                    <Text style={styles.timerText}>{formatTime(timer)}</Text>
                  </View>
                </View>
              )}

              {isVerified && (
                <View style={styles.successContainer}>
                  <Text style={styles.successText}>✓ 이메일 인증이 완료되었습니다.</Text>
                </View>
              )}
            </View>

            <View>
              <Text style={styles.label}>닉네임</Text>
              <TextInput 
                style={[styles.input, errors.nickname && styles.errorInput]}
                placeholder="닉네임을 입력해주세요"
                placeholderTextColor="#94a3b8"
                value={nickname}
                onChangeText={(val) => {
                  setNickname(val);
                  if (errors.nickname) setErrors(prev => ({ ...prev, nickname: false }));
                }}
              />
            </View>

            <View>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput 
                style={[styles.input, errors.password && styles.errorInput]}
                placeholder="8자 이상의 비밀번호"
                placeholderTextColor="#94a3b8"
                secureTextEntry={true}
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  if (errors.password) setErrors(prev => ({ ...prev, password: false }));
                }}
              />
            </View>
            <View>
              <Text style={styles.label}>비밀번호 확인</Text>
              <TextInput 
                style={[
                  styles.input, 
                  (errors.confirmPassword || passwordMismatch) && styles.errorInput
                ]}
                placeholder="비밀번호를 다시 입력해주세요"
                placeholderTextColor="#94a3b8"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={(val) => {
                  setConfirmPassword(val);
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: false }));
                  if (passwordMismatch) setPasswordMismatch(false);
                }}
              />
              {passwordMismatch && (
                <Text style={styles.errorMessage}>비밀번호가 일치하지 않습니다.</Text>
              )}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={handleRegister}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading && !isCooldown && showVerification ? (
              <ActivityIndicator size="small" color="#0f172a" />
            ) : (
              <Text style={styles.registerButtonText}>가입하기</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>이미 계정이 있으신가요?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}>로그인</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
    borderWidth: 1,
    borderColor: 'transparent',
  },
  errorInput: {
    borderColor: '#ef4444',
  },
  errorMessage: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  verifyButton: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    height: 52, 
  },
  confirmCodeButton: {
    backgroundColor: '#64748b',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#e2e8f0',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  verificationContainer: {
    marginTop: 12,
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  helperText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  timerText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  successContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  successText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
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
