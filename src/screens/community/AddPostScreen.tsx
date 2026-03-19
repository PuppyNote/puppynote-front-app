import React, { useState, useEffect } from 'react';
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
  AddTopBar,
  CustomAlert
} from '../../components';
import { communityService } from '../../services/community/CommunityService';
import { storageService } from '../../services/auth/StorageService';
import { useAlert } from '../../hooks/useAlert';
import { Post } from '../../types/Community';

const { width } = Dimensions.get('window');

interface ImageItem {
  uri: string;
  key?: string; // S3 key for existing images
  isNew: boolean;
}

export default function AddPostScreen({ navigation, route }: any) {
  const editPost = route.params?.editPost as Post | undefined;
  const isEditMode = !!editPost;

  const [content, setContent] = useState(editPost?.content || '');
  const [images, setImages] = useState<ImageItem[]>(
    editPost?.imageUrls.map((url, i) => ({ 
      uri: url, 
      key: editPost.imageKeys[i], 
      isNew: false 
    })) || []
  );
  const [deletedImageKeys, setDeletedImageKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { alertConfig, showSimpleAlert, hideAlert } = useAlert();

  // Hashtag states
  const [hashtags, setHashtags] = useState<string[]>(editPost?.hashtags || []);
  const [tagInput, setTagInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Hashtag autocomplete logic
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (tagInput.length > 0) {
        try {
          const response = await communityService.getHashtags(tagInput);
          setSuggestions(response.data);
          setShowSuggestions(response.data.length > 0);
        } catch (error) {
          console.error('Failed to fetch hashtags:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [tagInput]);

  const addHashtag = (tag: string) => {
    const cleanedTag = tag.trim().replace(/^#/, '');
    if (cleanedTag && !hashtags.includes(cleanedTag)) {
      setHashtags(prev => [...prev, cleanedTag]);
    }
    setTagInput('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const removeHashtag = (index: number) => {
    setHashtags(prev => prev.filter((_, i) => i !== index));
  };

  const handleTagInputChange = (text: string) => {
    if (text.endsWith(' ')) {
      addHashtag(text.trim());
    } else {
      setTagInput(text);
    }
  };

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
      const newImages = result.assets.map(asset => ({
        uri: asset.uri,
        isNew: true
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    const target = images[index];
    if (!target.isNew && target.key) {
      setDeletedImageKeys(prev => [...prev, target.key!]);
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!content.trim()) {
      showSimpleAlert('알림', '내용을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      
      if (isEditMode) {
        // 1. Upload only NEW images
        const addImageKeys: string[] = [];
        for (const img of images) {
          if (img.isNew) {
            const filename = img.uri.split('/').pop() || `post_${Date.now()}.jpg`;
            const type = `image/${filename.split('.').pop()}`;
            const key = await storageService.uploadImage('COMMUNITY_POST', img.uri, filename, type);
            addImageKeys.push(key);
          }
        }

        await communityService.updatePost(editPost!.postId, {
          content: content.trim(),
          hashtags: hashtags,
          addImageKeys: addImageKeys.length > 0 ? addImageKeys : undefined,
          deleteImageKeys: deletedImageKeys.length > 0 ? deletedImageKeys : undefined
        });

        showSimpleAlert('성공', '게시물이 수정되었습니다!', () => {
          navigation.goBack();
        });
      } else {
        // Create Mode
        const imageKeys: string[] = [];
        for (const img of images) {
          const filename = img.uri.split('/').pop() || `post_${Date.now()}.jpg`;
          const type = `image/${filename.split('.').pop()}`;
          const key = await storageService.uploadImage('COMMUNITY_POST', img.uri, filename, type);
          imageKeys.push(key);
        }

        await communityService.createPost({
          content: content.trim(),
          hashtags: hashtags.length > 0 ? hashtags : undefined,
          imageKeys: imageKeys.length > 0 ? imageKeys : undefined
        });

        showSimpleAlert('성공', '게시물이 등록되었습니다!', () => {
          navigation.navigate('MainTabs', { 
            screen: 'Community', 
            params: { refresh: true } 
          });
        });
      }
    } catch (error: any) {
      showSimpleAlert('오류', error.message || '요청 처리에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout edges={['bottom', 'left', 'right']} backgroundColor="#fcfaf2">
      <AddTopBar title={isEditMode ? "게시물 수정" : "게시물 작성"} onBack={() => navigation.goBack()} />
      
      <ScrollView 
        style={styles.flex1} 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.imageSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageRow}>
            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
              <Text style={styles.plusIcon}>+</Text>
              <Text style={styles.imageCountText}>{images.length}/5</Text>
            </TouchableOpacity>
            
            {images.map((img, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: img.uri }} style={styles.selectedImage} />
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
            placeholder="오늘 우리 아이와의 추억을 공유해보세요!"
            placeholderTextColor="#94a3b8"
            multiline
            textAlignVertical="top"
            value={content}
            onChangeText={setContent}
          />
        </View>

        <View style={styles.hashtagSection}>
          <Text style={styles.label}>해시태그</Text>
          
          <View style={styles.tagCloud}>
            {hashtags.map((tag, index) => (
              <View key={index} style={styles.tagPill}>
                <Text style={styles.tagText}>#{tag}</Text>
                <TouchableOpacity onPress={() => removeHashtag(index)} style={styles.tagRemoveBtn}>
                  <Text style={styles.tagRemoveText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.tagInputContainer}>
            {showSuggestions && (
              <View style={styles.suggestionPopup}>
                {suggestions.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.suggestionItem}
                    onPress={() => addHashtag(item)}
                  >
                    <Text style={styles.suggestionText}>#{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TextInput
              style={styles.tagInput}
              placeholder="해시태그를 입력하세요"
              placeholderTextColor="#cbd5e1"
              value={tagInput}
              onChangeText={handleTagInputChange}
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={() => addHashtag(tagInput)}
            />
            <Text style={styles.tagHelperText}>* 띄어쓰기를 하면 해시태그가 추가됩니다.</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, isLoading && styles.disabledButton]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text style={styles.submitButtonText}>{isEditMode ? "수정하기" : "등록하기"}</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.footerSpacer} />
      </ScrollView>

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
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  contentInput: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  hashtagSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 12,
    marginLeft: 4,
  },
  tagCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#eebd2b',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 13,
    color: '#eebd2b',
    fontWeight: 'bold',
  },
  tagRemoveBtn: {
    marginLeft: 6,
    backgroundColor: '#eebd2b',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagRemoveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tagInputContainer: {
    position: 'relative',
    zIndex: 100,
  },
  tagInput: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    fontSize: 14,
    color: '#334155',
  },
  tagHelperText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
    marginLeft: 4,
    fontWeight: '500',
  },
  suggestionPopup: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  suggestionText: {
    fontSize: 14,
    color: '#eebd2b',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#eebd2b',
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 16,
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
  footerSpacer: {
    height: 100,
  },
});
