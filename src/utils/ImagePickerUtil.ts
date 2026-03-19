import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking, Platform } from 'react-native';

export const ImagePickerUtil = {
  /**
   * 단일 이미지 선택 (프로필 등)
   */
  pickImageSingle: async (options: ImagePicker.ImagePickerOptions = {}) => {
    const defaultOptions: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    };

    return await ImagePicker.launchImageLibraryAsync({
      ...defaultOptions,
      ...options,
    });
  },

  /**
   * 다중 이미지 선택 (게시물, 산책 등)
   */
  pickImageMultiple: async (currentCount: number, maxCount: number, options: ImagePicker.ImagePickerOptions = {}) => {
    if (currentCount >= maxCount) {
      return null;
    }

    const defaultOptions: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: maxCount - currentCount,
      quality: 0.8,
      orderedSelection: true,
    };

    return await ImagePicker.launchImageLibraryAsync({
      ...defaultOptions,
      ...options,
    });
  }
};
