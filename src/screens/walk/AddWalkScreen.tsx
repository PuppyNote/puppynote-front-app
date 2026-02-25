import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Layout, Text, CustomAlert, TimePickerModal, AddTopBar } from '../../components';
import { walkService } from '../../services/walk/WalkService';
import { storageService } from '../../services/auth/StorageService';
import { useAlert } from '../../hooks/useAlert';
import { formatToLocalDate } from '../../utils/DateUtil';

export default function AddWalkScreen({ navigation }: any) {
  const today = formatToLocalDate(new Date());
  
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('09:30');
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState({ latitude: 37.5665, longitude: 126.978 });
  const [memo, setMemo] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStartTimeVisible, setIsStartTimeVisible] = useState(false);
  const [isEndTimeVisible, setIsEndTimeVisible] = useState(false);
  const { alertConfig, showAlert } = useAlert();

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showAlert('알림', '위치 정보 권한이 거부되었습니다. 장소를 직접 입력해주세요.');
        return;
      }

      setIsLoading(true);
      try {
        let loc = await Location.getCurrentPositionAsync({});
        setCoords({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        // Get address from coordinates
        let address = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (address && address.length > 0) {
          const addr = address[0];
          const formattedAddress = `${addr.city || ''} ${addr.street || ''} ${addr.name || ''}`.trim();
          setLocation(formattedAddress);
        }
      } catch (error) {
        console.log('Error getting location:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const pickImage = async () => {
    if (images.length >= 5) {
      showAlert('알림', '사진은 최대 5장까지 등록 가능합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!location) {
      showAlert('알림', '산책 장소를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const selectedPet = await storageService.getSelectedPet();
      if (!selectedPet) {
        showAlert('오류', '선택된 펫이 없습니다.');
        return;
      }

      // 1. 이미지 업로드
      const photoKeys: string[] = [];
      for (const uri of images) {
        const filename = uri.split('/').pop() || 'walk_photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        
        const key = await storageService.uploadImage('WALK_PHOTO', uri, filename, type);
        photoKeys.push(key);
      }

      // 2. 산책 기록 저장
      await walkService.saveWalk({
        petId: selectedPet.id,
        startTime: `${today}T${startTime}:00`,
        endTime: `${today}T${endTime}:00`,
        latitude: coords.latitude,
        longitude: coords.longitude,
        location,
        memo,
        photoKeys,
      });

      showAlert('성공', '산책 기록이 저장되었습니다.', () => {
        navigation.goBack();
      });
    } catch (error: any) {
      showAlert('오류', error.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout edges={['bottom', 'left', 'right']} backgroundColor="#fcfaf2">
      <AddTopBar 
        title="산책 기록하기" 
        onBack={() => navigation.goBack()} 
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>사진</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            <TouchableOpacity style={styles.imageAddButton} onPress={pickImage}>
              <Text style={styles.imageAddIcon}>+</Text>
              <Text style={styles.imageAddText}>{images.length}/5</Text>
            </TouchableOpacity>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.imageItem} />
                <TouchableOpacity style={styles.imageRemove} onPress={() => removeImage(index)}>
                  <Text style={styles.imageRemoveText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>장소</Text>
          <TextInput
            style={styles.input}
            placeholder="어디에서 산책하셨나요?"
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>날짜</Text>
          <View style={[styles.input, styles.disabledInput]}>
            <Text style={styles.disabledInputText}>{today}</Text>
          </View>
        </View>

        <View style={styles.rowSection}>
          <View style={styles.halfSection}>
            <Text style={styles.sectionLabel}>시작 시간</Text>
            <TouchableOpacity 
              style={styles.timeButton} 
              onPress={() => setIsStartTimeVisible(true)}
            >
              <Text style={styles.timeButtonText}>{startTime}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.halfSection}>
            <Text style={styles.sectionLabel}>종료 시간</Text>
            <TouchableOpacity 
              style={styles.timeButton} 
              onPress={() => setIsEndTimeVisible(true)}
            >
              <Text style={styles.timeButtonText}>{endTime}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>메모</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="산책 중 있었던 일을 기록해보세요 (날씨, 친구들 등)"
            value={memo}
            onChangeText={setMemo}
            multiline
            numberOfLines={4}
            placeholderTextColor="#94a3b8"
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.disabledButton]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text style={styles.saveButtonText}>기록 저장하기</Text>
          )}
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>

      <TimePickerModal
        visible={isStartTimeVisible}
        onClose={() => setIsStartTimeVisible(false)}
        onConfirm={setStartTime}
        initialTime={startTime}
        title="시작 시간"
      />

      <TimePickerModal
        visible={isEndTimeVisible}
        onClose={() => setIsEndTimeVisible(false)}
        onConfirm={setEndTime}
        initialTime={endTime}
        title="종료 시간"
      />

      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  rowSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  halfSection: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 14,
    color: '#0f172a',
  },
  timeButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  disabledInput: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  disabledInputText: {
    color: '#64748b',
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  imageScroll: {
    flexDirection: 'row',
  },
  imageAddButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  imageAddIcon: {
    fontSize: 24,
    color: '#94a3b8',
  },
  imageAddText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  imageItem: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  imageRemove: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageRemoveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#eebd2b',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#eebd2b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
