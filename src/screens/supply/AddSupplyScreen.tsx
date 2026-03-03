import React, { useState, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
  Image,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { 
  Layout, 
  Text, 
  AddTopBar, 
  CyclePickerModal, 
  UserCategoryPickerModal,
  CustomAlert
} from '../../components';
import { petItemService } from '../../services/petItem/PetItemService';
import { userCategoryService } from '../../services/userCategory/UserCategoryService';
import { storageService } from '../../services/auth/StorageService';
import { UserCategoryResponse } from '../../types/PetItem';
import { useAlert } from '../../hooks/useAlert';

export default function AddSupplyScreen({ navigation }: any) {
  const { alertConfig, showSimpleAlert, hideAlert } = useAlert();
  const [name, setName] = useState('');
  const [purchaseUrl, setPurchaseUrl] = useState('');
  const [purchaseCycleDays, setPurchaseCycleDays] = useState(30);
  const [selectedCategory, setSelectedCategory] = useState<UserCategoryResponse | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userCategories, setUserCategories] = useState<UserCategoryResponse[]>([]);
  
  // Modals visibility
  const [isCycleModalVisible, setIsCycleModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  useEffect(() => {
    fetchUserCategories();
  }, []);

  const fetchUserCategories = async () => {
    try {
      const data = await userCategoryService.getUserCategories('ITEM');
      setUserCategories(data);
      if (data.length > 0) {
        setSelectedCategory(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch user categories:', error);
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showSimpleAlert('알림', '용품 이름을 입력해주세요.');
      return;
    }
    if (!selectedCategory) {
      showSimpleAlert('알림', '카테고리를 선택해주세요.');
      return;
    }

    try {
      setLoading(true);
      const selectedPet = await storageService.getSelectedPet();
      if (!selectedPet) {
        showSimpleAlert('오류', '선택된 반려동물이 없습니다.');
        return;
      }

      let imageKey = undefined;
      if (imageUri) {
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const type = `image/${filename.split('.').pop()}`;
        imageKey = await storageService.uploadImage('PET_ITEM_PHOTO', imageUri, filename, type);
      }

      await petItemService.createPetItem({
        petId: selectedPet.id,
        name,
        category: selectedCategory.category,
        purchaseCycleDays,
        purchaseUrl: purchaseUrl.trim() || undefined,
        imageKey,
      });

      showSimpleAlert('성공', '용품이 등록되었습니다.', () => navigation.goBack());
    } catch (error: any) {
      showSimpleAlert('오류', error.message || '용품 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout edges={['bottom', 'left', 'right']} backgroundColor="#fcfaf2">
      <AddTopBar 
        title="용품 등록하기" 
        onBack={() => navigation.goBack()} 
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.photoUploadSection}>
          <TouchableOpacity 
            style={styles.photoPlaceholder} 
            activeOpacity={0.7}
            onPress={handleImagePick}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.selectedImage} />
            ) : (
              <>
                <Text style={styles.plusIcon}>+</Text>
                <Text style={styles.photoLabelText}>사진 추가</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputFieldGroup}>
            <Text style={styles.inputLabelText}>용품 이름</Text>
            <View style={styles.textInputWrapper}>
              <TextInput 
                style={styles.textInput} 
                placeholder="예: 프리미엄 사료" 
                placeholderTextColor="#cbd5e1"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.inputFieldGroup}>
            <Text style={styles.inputLabelText}>구매 링크 (선택)</Text>
            <View style={styles.linkInputWrapper}>
              <Text style={styles.linkIcon}>🔗</Text>
              <TextInput 
                style={styles.textInputFlex} 
                placeholder="https://..." 
                placeholderTextColor="#cbd5e1"
                value={purchaseUrl}
                onChangeText={setPurchaseUrl}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.rowInputs}>
            <TouchableOpacity 
              style={styles.inputFieldGroupFlex}
              onPress={() => setIsCycleModalVisible(true)}
            >
              <Text style={styles.inputLabelText}>구매 주기</Text>
              <View style={styles.pickerTrigger}>
                <Text style={styles.pickerValue}>{purchaseCycleDays}일</Text>
                <Text style={styles.pickerArrow}>▼</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.inputFieldGroupFlex}
              onPress={() => setIsCategoryModalVisible(true)}
            >
              <Text style={styles.inputLabelText}>카테고리</Text>
              <View style={styles.pickerTrigger}>
                <Text style={styles.pickerValue} numberOfLines={1}>
                  {selectedCategory ? `${selectedCategory.categoryEmoji} ${selectedCategory.categoryName}` : '선택'}
                </Text>
                <Text style={styles.pickerArrow}>▼</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          activeOpacity={0.9}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text style={styles.saveButtonText}>등록하기</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <CyclePickerModal 
        visible={isCycleModalVisible}
        onClose={() => setIsCycleModalVisible(false)}
        onConfirm={setPurchaseCycleDays}
        initialDays={purchaseCycleDays}
      />

      <UserCategoryPickerModal 
        visible={isCategoryModalVisible}
        onClose={() => setIsCategoryModalVisible(false)}
        onConfirm={setSelectedCategory}
        userCategories={userCategories}
        initialCategoryId={selectedCategory?.category}
      />

      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
        onCancel={hideAlert}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  photoUploadSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  photoPlaceholder: {
    width: 112,
    height: 112,
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  plusIcon: {
    fontSize: 32,
    color: '#94a3b8',
    fontWeight: '300',
    marginBottom: 4,
  },
  photoLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  formContainer: {
    gap: 24,
  },
  inputFieldGroup: {
    gap: 8,
  },
  inputFieldGroupFlex: {
    flex: 1,
    gap: 8,
  },
  inputLabelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textInputWrapper: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  linkInputWrapper: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pickerTrigger: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    fontSize: 16,
    color: '#0f172a',
  },
  textInputFlex: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
  },
  linkIcon: {
    fontSize: 16,
  },
  pickerValue: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '500',
  },
  pickerArrow: {
    fontSize: 12,
    color: '#94a3b8',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  saveButton: {
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
    marginTop: 32,
    marginBottom: 64,
  },
  saveButtonDisabled: {
    backgroundColor: '#e2e8f0',
    shadowOpacity: 0,
  },
  saveButtonText: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
