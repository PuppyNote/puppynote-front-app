import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Platform } from 'react-native';
import { Layout, Text, CustomAlert, PetRegistrationModal, EntryOptionModal, InviteCodeModal } from '../../components';
import { authService } from '../../services/auth/AuthService';
import { storageService } from '../../services/auth/StorageService';
import { petService } from '../../services/pet/PetService';
import { useAlert } from '../../hooks/useAlert';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEntryOptionVisible, setIsEntryOptionVisible] = useState(false);
  const [isPetModalVisible, setIsPetModalVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const { alertConfig, showAlert } = useAlert();

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

      // 펫 조회
      const pets = await petService.getPets();
      
      if (pets && pets.length > 0) {
        // 첫번째 펫 정보 저장
        await storageService.saveSelectedPet(pets[0].petId, pets[0].petName);
        setIsLoading(false);
        navigation.replace('MainTabs');
      } else {
        // 등록된 펫이 없으면 선택 팝업 띄우기
        setIsLoading(false);
        setIsEntryOptionVisible(true);
      }
    } catch (error: any) {
      setIsLoading(false);
      showAlert('오류', error.message || '로그인에 실패했습니다.');
    }
  };

  const handleSelectRegisterPet = () => {
    setIsEntryOptionVisible(false);
    setIsPetModalVisible(true);
  };

  const handleSelectInviteCode = () => {
    setIsEntryOptionVisible(false);
    setIsInviteModalVisible(true);
  };

  const handlePetRegistrationSuccess = async (petId: number, petName: string) => {
    setIsPetModalVisible(false);
    await storageService.saveSelectedPet(petId, petName);
    navigation.replace('MainTabs');
  };

  const handleInviteCodeSuccess = async (petId: number, petName: string) => {
    setIsInviteModalVisible(false);
    await storageService.saveSelectedPet(petId, petName);
    navigation.replace('MainTabs');
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
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
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

      <EntryOptionModal 
        visible={isEntryOptionVisible}
        onRegisterPet={handleSelectRegisterPet}
        onEnterInviteCode={handleSelectInviteCode}
      />

      <PetRegistrationModal 
        visible={isPetModalVisible}
        onSuccess={handlePetRegistrationSuccess}
        onClose={() => {
          setIsPetModalVisible(false);
          setIsEntryOptionVisible(true);
        }}
      />

      <InviteCodeModal 
        visible={isInviteModalVisible}
        onSuccess={handleInviteCodeSuccess}
        onBack={() => {
          setIsInviteModalVisible(false);
          setIsEntryOptionVisible(true);
        }}
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
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'sans-serif',
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
