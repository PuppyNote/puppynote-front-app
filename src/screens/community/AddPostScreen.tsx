import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { 
  Layout, 
  Text, 
  AddTopBar 
} from '../../components';
import { communityService } from '../../services/community/CommunityService';
import { storageService } from '../../services/auth/StorageService';
import { useAlert } from '../../hooks/useAlert';

const { width } = Dimensions.get('window');

export default function AddPostScreen({ navigation, route }: any) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showSimpleAlert } = useAlert();

  const handleImagePick = async () => {
    if (images.length >= 5) {
      showSimpleAlert('알림', '이미지는 최대 5개까지 등록 가능합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newUris = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...newUris]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!content.trim()) {
      showSimpleAlert('알림', '내용을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      
      const imageKeys: string[] = [];
      
      // Upload images to S3
      for (const uri of images) {
        if (uri.startsWith('http')) {
          // If editing and image is already on S3 (not implemented edit here yet but for future)
          imageKeys.push(uri.split('/').pop()?.split('?')[0] || '');
        } else {
          const filename = uri.split('/').pop() || `post_${Date.now()}.jpg`;
          const type = `image/${filename.split('.').pop()}`;
          const key = await storageService.uploadImage('COMMUNITY_POST', uri, filename, type);
          imageKeys.push(key);
        }
      }

      await communityService.createPost({
        content: content.trim(),
        imageKeys: imageKeys.length > 0 ? imageKeys : undefined
      });

      showSimpleAlert('성공', '게시물이 등록되었습니다!', () => {
        navigation.navigate('MainTabs', { screen: 'Community' });
      });
    } catch (error: any) {
      showSimpleAlert('오류', error.message || '게시물 등록에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout edges={['bottom', 'left', 'right']} backgroundColor="#fcfaf2">
      <AddTopBar title="게시물 작성" onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.flex1} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.imageSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageRow}>
            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
              <Text style={styles.plusIcon}>+</Text>
              <Text style={styles.imageCountText}>{images.length}/5</Text>
            </TouchableOpacity>
            
            {images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.selectedImage} />
                <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.contentInput}
            placeholder="오늘 우리 아이와의 추억을 공유해보세요! @해시태그 도 활용할 수 있어요."
            placeholderTextColor="#94a3b8"
            multiline
            textAlignVertical="top"
            value={content}
            onChangeText={setContent}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, isLoading && styles.disabledButton]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text style={styles.submitButtonText}>등록하기</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  imageSection: {
    marginBottom: 24,
  },
  imageRow: {
    gap: 12,
  },
  imagePicker: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 24,
    color: '#94a3b8',
    fontWeight: '300',
  },
  imageCountText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: 'bold',
    marginTop: 2,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
  },
  inputSection: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contentInput: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
    height: '100%',
  },
  submitButton: {
    backgroundColor: '#eebd2b',
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#eebd2b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#e2e8f0',
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
