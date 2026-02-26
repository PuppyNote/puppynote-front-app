import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { CustomText as Text } from '../CustomText';
import { MajorCategory, Category } from '../../types/PetItem';

interface CategoryPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (category: Category) => void;
  majorCategories: MajorCategory[];
}

export default function CategoryPickerModal({
  visible,
  onClose,
  onConfirm,
  majorCategories,
}: CategoryPickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>카테고리 선택</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>취소</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {majorCategories.map((major) => (
              <View key={major.majorCategory} style={styles.majorGroup}>
                <Text style={styles.majorTitle}>{major.majorCategoryEmoji} {major.majorCategoryName}</Text>
                <View style={styles.categoryGrid}>
                  {major.categories.map((cat) => (
                    <TouchableOpacity 
                      key={cat.category} 
                      style={styles.categoryChip}
                      onPress={() => {
                        onConfirm(cat);
                        onClose();
                      }}
                    >
                      <Text style={styles.chipText}>{cat.emoji} {cat.categoryName}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  closeText: {
    color: '#64748b',
    fontSize: 16,
  },
  scrollContent: {
    marginBottom: 12,
  },
  majorGroup: {
    marginBottom: 24,
  },
  majorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  chipText: {
    fontSize: 15,
    color: '#334155',
  },
});
