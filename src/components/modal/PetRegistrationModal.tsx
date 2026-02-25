import React, { useState } from 'react';
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
import { petService } from '../../services/PetService';
import { storageService } from '../../services/auth/StorageService';
import { DatePickerModal } from '../index';

interface PetRegistrationModalProps {
  visible: boolean;
  onSuccess: (petId: number, petName: string) => void;
  onClose?: () => void;
}

export default function PetRegistrationModal({
  visible,
  onSuccess,
  onClose,
}: PetRegistrationModalProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

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
      alert('펫 이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      let profileImageUrl = '';

      // 1. 이미지 업로드 (이미지가 선택된 경우)
      if (image) {
        const filename = image.split('/').pop() || 'pet_profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        
        profileImageUrl = await storageService.uploadImage('PUPPY_PROFILE', image, filename, type);
      }

      // 2. 펫 등록
      const petData = await petService.registerPet({
        name,
        birthDate: birthDate || undefined,
        profileImageUrl: profileImageUrl || undefined,
      });

      onSuccess(petData.petId, petData.petName);
    } catch (error: any) {
      alert(error.message || '펫 등록 중 오류가 발생했습니다.');
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
              <Text style={styles.modalTitle}>우리 아이 등록하기</Text>
              <Text style={styles.modalSubtitle}>함께할 반려동물의 정보를 입력해주세요.</Text>

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
                    <Text style={styles.submitButtonText}>등록하기</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
      <DatePickerModal
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onConfirm={setBirthDate}
        initialDate={birthDate}
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
