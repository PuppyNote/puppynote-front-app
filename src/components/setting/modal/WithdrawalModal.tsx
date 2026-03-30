import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ActivityIndicator, 
} from 'react-native';
import { CustomText as Text } from '../../common/item/CustomText';

interface WithdrawalModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function WithdrawalModal({
  visible,
  onClose,
  onConfirm,
}: WithdrawalModalProps) {
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (visible && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [visible, countdown]);

  useEffect(() => {
    if (visible) {
      setCountdown(5);
    }
  }, [visible]);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>회원 탈퇴</Text>
          <Text style={styles.warningText}>
            회원탈퇴할 경우 복구할 수 없습니다.
          </Text>
          <Text style={styles.modalSubtitle}>
            정말 탈퇴하시겠습니까? 모든 정보가 영구적으로 삭제됩니다.
          </Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton, 
                (countdown > 0 || isLoading) && styles.disabledButton
              ]}
              onPress={handleConfirm}
              disabled={countdown > 0 || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>
                  탈퇴하기 {countdown > 0 ? `(${countdown})` : ''}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0f172a',
    marginBottom: 16,
  },
  warningText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
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
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    shadowColor: '#ef4444',
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
    color: 'white',
    fontWeight: 'bold',
  },
});
