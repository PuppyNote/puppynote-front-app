import React from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { CustomText as Text } from './CustomText';
import { ImagePickerUtil } from '../../../utils/ImagePickerUtil';
import { useAlert } from '../../../hooks/useAlert';

interface MultiImageSelectorProps {
  images: string[];
  maxCount: number;
  onAddImages: (newUris: string[]) => void;
  onRemoveImage: (index: number) => void;
}

export default function MultiImageSelector({ 
  images, 
  maxCount, 
  onAddImages, 
  onRemoveImage 
}: MultiImageSelectorProps) {
  const { showSimpleAlert } = useAlert();

  const handlePick = async () => {
    if (images.length >= maxCount) {
      showSimpleAlert('알림', `이미지는 최대 ${maxCount}개까지 등록 가능합니다.`);
      return;
    }

    const result = await ImagePickerUtil.pickImageMultiple(images.length, maxCount);

    if (result && !result.canceled) {
      const newUris = result.assets.map(asset => asset.uri);
      onAddImages(newUris);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageRow}>
        <TouchableOpacity style={styles.imagePicker} onPress={handlePick}>
          <Text style={styles.plusIcon}>+</Text>
          <Text style={styles.imageCountText}>{images.length}/{maxCount}</Text>
        </TouchableOpacity>
        
        {images.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.selectedImage} />
            <TouchableOpacity 
              style={styles.removeButton} 
              onPress={() => onRemoveImage(index)}
              activeOpacity={0.7}
            >
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  imageRow: {
    gap: 12,
    paddingRight: 24, // End of scroll spacing
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
    backgroundColor: '#f1f5f9',
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
    fontWeight: 'bold',
  },
});
