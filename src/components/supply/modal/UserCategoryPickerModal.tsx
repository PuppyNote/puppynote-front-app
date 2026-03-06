import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { CustomText as Text } from '../../common/item/CustomText';
import { WheelPicker } from '../../common/item/WheelPicker';
import { UserCategoryResponse } from '../../types/PetItem';

interface UserCategoryPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (category: UserCategoryResponse) => void;
  userCategories: UserCategoryResponse[];
  initialCategoryId?: string;
}

export default function UserCategoryPickerModal({
  visible,
  onClose,
  onConfirm,
  userCategories,
  initialCategoryId,
}: UserCategoryPickerModalProps) {
  // Format items for WheelPicker: "Emoji Name"
  const items = userCategories.map(cat => `${cat.categoryEmoji} ${cat.categoryName}`);
  
  const initialValue = userCategories.find(c => c.category === initialCategoryId);
  const initialString = initialValue ? `${initialValue.categoryEmoji} ${initialValue.categoryName}` : items[0];
  
  const [selectedValue, setSelectedValue] = useState(initialString);

  useEffect(() => {
    if (visible && initialCategoryId) {
      const found = userCategories.find(c => c.category === initialCategoryId);
      if (found) setSelectedValue(`${found.categoryEmoji} ${found.categoryName}`);
    } else if (visible && items.length > 0) {
      setSelectedValue(items[0]);
    }
  }, [visible, initialCategoryId, userCategories]);

  const handleConfirm = () => {
    const selectedIndex = items.indexOf(selectedValue);
    if (selectedIndex !== -1) {
      onConfirm(userCategories[selectedIndex]);
    }
    onClose();
  };

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

          <View style={styles.pickerContainer}>
            <WheelPicker 
              items={items} 
              selectedValue={selectedValue} 
              onSelect={setSelectedValue} 
              width={250}
            />
            
            <View style={styles.highlightBar} pointerEvents="none" />
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>확인</Text>
          </TouchableOpacity>
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
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    marginBottom: 24,
  },
  highlightBar: {
    position: 'absolute',
    height: 50,
    left: 0,
    right: 0,
    backgroundColor: '#eebd2b1a',
    borderRadius: 12,
    zIndex: -1,
  },
  confirmButton: {
    backgroundColor: '#eebd2b',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#eebd2b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
