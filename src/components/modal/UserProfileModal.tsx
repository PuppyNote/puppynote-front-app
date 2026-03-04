import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CustomText as Text } from '../CustomText';
import { authService, UserProfile } from '../../services/auth/AuthService';
import { storageService } from '../../services/auth/StorageService';
import CustomAlert from './CustomAlert';
import { useAlert } from '../../hooks/useAlert';

interface UserProfileModalProps {
  visible: boolean;
  onSuccess: () => void;
  onClose: () => void;
  initialData: UserProfile | null;
}

export default function UserProfileModal({
  visible,
  onSuccess,
  onClose,
  initialData,
}: UserProfileModalProps) {
  const [nickName, setNickName] = useState('');
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { alertConfig, showSimpleAlert, hideAlert } = useAlert();

  useEffect(() => {
    if (visible && initialData) {
      setNickName(initialData.nickName || '');
      setProfileUrl(initialData.profileUrl || null);
    }
  }, [visible, initialData]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileUrl(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    if (!nickName.trim()) {
      showSimpleAlert('알림', '닉네임을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      let finalProfileUrl = profileUrl;

      // 이미지가 새로 선택되었고, 기존 URL과 다른 경우 업로드
      if (profileUrl && profileUrl !== initialData?.profileUrl && !profileUrl.startsWith('http')) {
        const filename = profileUrl.split('/').pop() || 'user_profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        
        // StorageService의 uploadImage는 업로드된 URL을 반환한다고 가정
        finalProfileUrl = await storageService.uploadImage('USER_PROFILE', profileUrl, filename, type);
      }

      await authService.updateProfile({
        nickName,
        profileUrl: finalProfileUrl,
      });

      showSimpleAlert('성공', '프로필이 수정되었습니다.', onSuccess);
    } catch (error: any) {
      showSimpleAlert('오류', error.message || '프로필 수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>내 프로필 수정</Text>
              <Text style={styles.modalSubtitle}>사용하실 닉네임과 사진을 설정해주세요.</Text>

              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {profileUrl ? (
                  <Image source={{ uri: profileUrl }} style={styles.previewImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.cameraIcon}>📷</Text>
                    <Text style={styles.imagePickerText}>사진 추가</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>닉네임</Text>
                <TextInput
                  style={styles.input}
                  placeholder="닉네임을 입력하세요"
                  value={nickName}
                  onChangeText={setNickName}
                  maxLength={20}
                />
                <Text style={styles.emailLabel}>이메일: {initialData?.email}</Text>
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, !nickName.trim() && styles.disabledButton]}
                  onPress={handleUpdate}
                  disabled={isLoading || !nickName.trim()}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#0f172a" />
                  ) : (
                    <Text style={styles.submitButtonText}>수정 완료</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>

      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm || hideAlert}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    maxHeight: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0f172a',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  imagePicker: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  imagePickerText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  inputGroup: {
    gap: 12,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 4,
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 14,
  },
  emailLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 4,
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#475569',
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#eebd2b',
    alignItems: 'center',
    shadowColor: '#eebd2b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
});
