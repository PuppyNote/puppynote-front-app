import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { CustomText as Text } from '../CustomText';

interface EntryOptionModalProps {
  visible: boolean;
  onRegisterPet: () => void;
  onEnterInviteCode: () => void;
}

export default function EntryOptionModal({
  visible,
  onRegisterPet,
  onEnterInviteCode,
}: EntryOptionModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>반갑습니다!</Text>
          <Text style={styles.modalSubtitle}>PuppyNote를 시작하기 위해{"\n"}아래 방법 중 하나를 선택해주세요.</Text>

          <View style={styles.optionContainer}>
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={onRegisterPet}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBox, { backgroundColor: '#fef3c7' }]}>
                <Text style={styles.icon}>🐶</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.optionTitle}>우리아이 등록</Text>
                <Text style={styles.optionDescription}>새로운 반려동물 정보를 등록합니다.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={onEnterInviteCode}
              activeOpacity={0.8}
            >
              <View style={[styles.iconBox, { backgroundColor: '#e0f2fe' }]}>
                <Text style={styles.icon}>✉️</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.optionTitle}>초대코드 등록</Text>
                <Text style={styles.optionDescription}>공유받은 초대코드로 입장합니다.</Text>
              </View>
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
    fontSize: 24,
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
  optionContainer: {
    width: '100%',
    gap: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#94a3b8',
  },
});
