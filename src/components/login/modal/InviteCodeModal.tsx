import React, { useState } from 'react';
import { View, StyleSheet, Modal, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CustomText as Text } from '../../common/item/CustomText';
import CustomAlert from '../../common/modal/CustomAlert';
import { useAlert } from '../../../hooks/useAlert';

interface InviteCodeModalProps {
  visible: boolean;
  onSuccess: (petId: number, petName: string) => void;
  onBack: () => void;
}

export default function InviteCodeModal({
  visible,
  onSuccess,
  onBack,
}: InviteCodeModalProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { alertConfig, showSimpleAlert, hideAlert } = useAlert();

  const handleSubmit = async () => {
    if (!code) {
      showSimpleAlert('알림', '초대코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual invite code API call
      // const response = await petService.joinWithInviteCode(code);
      // onSuccess(response.petId, response.petName);
      
      console.log('Joining with code:', code);
      // Temporary success mock
      // onSuccess(1, '초대된 펫');
      
      showSimpleAlert('알림', '초대코드 기능은 현재 준비 중입니다.');
    } catch (error: any) {
      showSimpleAlert('오류', error.message || '초대코드 확인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>초대코드 입력</Text>
          <Text style={styles.modalSubtitle}>전달받은 초대코드를 입력하여{"\n"}기존 펫 정보를 공유받을 수 있습니다.</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="코드를 입력하세요"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={onBack}
              disabled={isLoading}
            >
              <Text style={styles.backButtonText}>이전으로</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.submitButton, !code && styles.disabledButton]} 
              onPress={handleSubmit}
              disabled={isLoading || !code}
            >
              {isLoading ? (
                <ActivityIndicator color="#0f172a" />
              ) : (
                <Text style={styles.submitButtonText}>확인</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#0f172a',
  },
  buttonGroup: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#475569',
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 16,
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
