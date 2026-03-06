import React, { useState, useEffect, useCallback } from 'react';
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
import { CustomText as Text } from '../item/CustomText';
import { petService } from '../../../services/pet/PetService';
import { homeService } from '../../../services/home/HomeService';
import { storageService } from '../../../services/auth/StorageService';
import DatePickerModal from './DatePickerModal';
import CustomAlert from './CustomAlert';
import { useAlert } from '../../../hooks/useAlert';

interface PetRegistrationModalProps {
  visible: boolean;
  onSuccess: (petId: number, petName: string) => void;
  onClose?: () => void;
  editPetId?: number | null; // HomeScreen에서 editPetId로 전달함
}

export default function PetRegistrationModal({
  visible,
  onSuccess,
  onClose,
  editPetId,
}: PetRegistrationModalProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const { alertConfig, showSimpleAlert, hideAlert } = useAlert();

  const isEditMode = !!editPetId;

  const fetchPetDetail = useCallback(async (petId: number) => {
    setIsDataLoading(true);
    try {
      // homeService의 getHomeInfo를 사용하면 기본 정보를 가져올 수 있습니다.
      const data = await homeService.getHomeInfo(petId);
      setName(data.petName || '');
      setBirthDate(data.birthDate || ''); 
      setImage(data.petProfileImageUrl || null);
    } catch (error) {
      console.error('Failed to fetch pet detail:', error);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      if (editPetId) {
        fetchPetDetail(editPetId);
      } else {
        // 등록 모드일 때는 초기화
        setName('');
        setBirthDate('');
        setImage(null);
      }
    }
  }, [visible, editPetId, fetchPetDetail]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!name) {
      showSimpleAlert('알림', '펫 이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      let imageKey = '';

      // 이미지 처리 로직
      if (image && image.startsWith('file://')) {
        const filename = image.split('/').pop() || `pet_${Date.now()}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        
        imageKey = await storageService.uploadImage('PUPPY_PROFILE', image, filename, type);
      } else if (image && image.startsWith('http')) {
        // 기존 이미지를 그대로 사용하는 경우 URL에서 키 추출
        imageKey = image.split('/').pop()?.split('?')[0] || '';
      }

      if (isEditMode && editPetId) {
        await petService.updatePet(editPetId, {
          name,
          birthDate: birthDate || null,
          profileImage: imageKey || null,
        });
        showSimpleAlert('성공', '정보가 수정되었습니다.', () => onSuccess(editPetId, name));
      } else {
        const petData = await petService.registerPet({
          name,
          birthDate: birthDate || undefined,
          profileImage: imageKey || undefined, 
        });
        showSimpleAlert('성공', '반려동물이 등록되었습니다.', () => onSuccess(petData.petId, petData.petName));
      }
    } catch (error: any) {
      showSimpleAlert('오류', error.message || `${isEditMode ? '수정' : '등록'} 중 오류가 발생했습니다.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.modalContent}>
            {isDataLoading ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <ActivityIndicator color="#eebd2b" size="large" />
                <Text style={{ marginTop: 12, color: '#64748b' }}>정보를 불러오는 중...</Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>{isEditMode ? '우리 아이 정보 수정' : '우리 아이 등록하기'}</Text>
                <Text style={styles.modalSubtitle}>
                  {isEditMode ? '수정할 반려동물의 정보를 입력해주세요.' : '함께할 반려동물의 정보를 입력해주세요.'}
                </Text>

                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.previewImage} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.cameraIcon}>📷</Text>
                      <Text style={styles.imagePickerText}>사진 추가</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>이름 (필수)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="이름을 입력하세요"
                    value={name}
                    onChangeText={setName}
                  />

                  <Text style={styles.label}>생년월일</Text>
                  <TouchableOpacity 
                    style={styles.datePickerButton} 
                    onPress={() => setIsDatePickerVisible(true)}
                  >
                    <Text style={[styles.dateText, !birthDate && styles.placeholderText]}>
                      {birthDate || 'YYYY-MM-DD'}
                    </Text>
                    <Text style={styles.calendarIcon}>📅</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonGroup}>
                  {onClose && (
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={onClose}
                      disabled={isLoading}
                    >
                      <Text style={styles.cancelButtonText}>취소</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.submitButton, !name && styles.disabledButton]}
                    onPress={handleRegister}
                    disabled={isLoading || !name}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#0f172a" />
                    ) : (
                      <Text style={styles.submitButtonText}>{isEditMode ? '수정하기' : '등록하기'}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
      <DatePickerModal
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onConfirm={setBirthDate}
        initialDate={birthDate}
      />

      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onCancel={hideAlert}
        type={alertConfig.type}
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
  datePickerButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateText: {
    fontSize: 14,
    color: '#0f172a',
  },
  placeholderText: {
    color: '#94a3b8',
  },
  calendarIcon: {
    fontSize: 16,
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
