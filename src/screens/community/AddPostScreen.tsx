import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Platform,
  Keyboard
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

export default function AddPostScreen({ navigation }: any) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showSimpleAlert } = useAlert();

  // Hashtag states
  const [hashtags, setHashtags] = useState<string[]>([]);
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
    // If user types space, complete the tag
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
      for (const uri of images) {
        const filename = uri.split('/').pop() || `post_${Date.now()}.jpg`;
        const type = `image/${filename.split('.').pop()}`;
        const key = await storageService.uploadImage('COMMUNITY_POST', uri, filename, type);
        imageKeys.push(key);
      }

      await communityService.createPost({
        content: content.trim(),
        hashtags: hashtags.length > 0 ? hashtags : undefined,
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
            placeholder="오늘 우리 아이와의 추억을 공유해보세요!"
            placeholderTextColor="#94a3b8"
            multiline
            textAlignVertical="top"
            value={content}
            onChangeText={setContent}
          />
        </View>

        {/* Hashtag Section */}
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
              placeholder="해시태그를 입력하세요 (예: 강아지산책)"
              placeholderTextColor="#cbd5e1"
              value={tagInput}
              onChangeText={handleTagInputChange}
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={() => addHashtag(tagInput)}
            />
          </View>
          <Text style={styles.helperText}>공백(띄어쓰기)이나 엔터를 치면 태그가 완성됩니다.</Text>
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
        
        <View style={styles.footerSpacer} />
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
  helperText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 8,
    marginLeft: 4,
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
