import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { 
  Gesture, 
  GestureDetector, 
  GestureHandlerRootView 
} from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { CustomText as Text } from './CustomText';

interface PhotoGalleryProps {
  photoUrls: string[];
  width?: number;
  height?: number;
  borderRadius?: number;
  onImagePress?: (url: string, index: number) => void;
  initialIndex?: number;
}

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

/**
 * 모달 안에서만 사용되는 확대/이동 전용 컴포넌트
 */
const ModalZoomImage = ({ url, onZoomChange }: { url: string, onZoomChange: (zoomed: boolean) => void }) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const resetPosition = () => {
    'worklet';
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedScale.value = 1;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    runOnJS(onZoomChange)(false);
  };

  // 핀치 제스처
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(1, savedScale.value * e.scale);
    })
    .onEnd(() => {
      if (scale.value <= 1.1) {
        resetPosition();
      } else {
        savedScale.value = scale.value;
        runOnJS(onZoomChange)(true);
      }
    });

  // 이동 제스처: 확대된 상태에서만 활성화하여 ScrollView의 스와이프를 방해하지 않음
  const panGesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((_, state) => {
      if (scale.value > 1) {
        state.activate();
      } else {
        state.fail();
      }
    })
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // 더블 탭 줌
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        resetPosition();
      } else {
        scale.value = withTiming(2);
        savedScale.value = 2;
        runOnJS(onZoomChange)(true);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value }
    ],
  }));

  return (
    <View style={styles.modalImageWrapper}>
      <GestureDetector gesture={Gesture.Race(doubleTapGesture, Gesture.Simultaneous(pinchGesture, panGesture))}>
        <Animated.Image 
          source={{ uri: url }} 
          style={[styles.fullImage, animatedStyle]} 
          resizeMode="contain"
        />
      </GestureDetector>
    </View>
  );
};

export const PhotoGallery = ({ 
  photoUrls, 
  width = windowWidth - 48, 
  height = 240,
  borderRadius = 24,
  onImagePress,
  initialIndex = 0
}: PhotoGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalIndex, setModalIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const hasMultipleImages = photoUrls && photoUrls.length > 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    if (width > 0) {
      const index = Math.round(contentOffset / width);
      setCurrentIndex(index);
    }
  };

  const openModal = (index: number) => {
    setModalIndex(index);
    setIsModalVisible(true);
    setIsZoomed(false);
  };

  const handlePress = (url: string, index: number) => {
    if (onImagePress) {
      onImagePress(url, index);
    } else {
      openModal(index);
    }
  };

  if (!photoUrls || photoUrls.length === 0) return null;

  return (
    <View style={[styles.container, { width, height, borderRadius }]}>
      {/* 1. 기본 카드 화면 */}
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width}
      >
        {photoUrls.map((url, index) => (
          <TouchableOpacity 
            key={index} 
            activeOpacity={0.9} 
            onPress={() => handlePress(url, index)}
            style={{ width, height }}
          >
            <Image 
              source={{ uri: url }} 
              style={{ width, height }} 
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>


      {hasMultipleImages && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{currentIndex + 1}/{photoUrls.length}</Text>
        </View>
      )}

      {/* 2. 전체 화면 모달 */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'black' }}>
          <StatusBar barStyle="light-content" />
          
          {/* 상단 헤더 (Absolute로 띄워서 중앙 배치 간섭 방지) */}
          <SafeAreaView style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            {hasMultipleImages && (
              <View style={styles.modalBadge}>
                <Text style={styles.modalBadgeText}>{modalIndex + 1} / {photoUrls.length}</Text>
              </View>
            )}
            <View style={{ width: 44 }} /> 
          </SafeAreaView>

          <ScrollView
            horizontal
            pagingEnabled={!isZoomed}
            scrollEnabled={!isZoomed}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / windowWidth);
              setModalIndex(index);
            }}
            contentOffset={{ x: modalIndex * windowWidth, y: 0 }}
          >
            {photoUrls.map((url, index) => (
              <ModalZoomImage key={index} url={url} onZoomChange={setIsZoomed} />
            ))}
          </ScrollView>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
  },
  badge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 20 : 50, // TopBar만큼 아래로 조정
    zIndex: 100,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  modalBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalImageWrapper: {
    width: windowWidth,
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: windowWidth,
    height: windowHeight,
  }
});
