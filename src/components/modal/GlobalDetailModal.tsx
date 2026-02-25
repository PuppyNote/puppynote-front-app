import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { CustomText as Text } from '../CustomText';

interface GlobalDetailModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  height?: string | number;
  backgroundColor?: string;
}

export default function GlobalDetailModal({
  visible,
  onClose,
  title,
  children,
  height = '85%',
  backgroundColor = '#fcfaf2',
}: GlobalDetailModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.container, { height, backgroundColor }]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    width: '100%',
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
});
