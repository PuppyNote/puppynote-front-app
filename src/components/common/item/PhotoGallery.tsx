import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';
import { CustomText as Text } from './CustomText';

interface PhotoGalleryProps {
  photoUrls: string[];
  width?: number;
  height?: number;
  borderRadius?: number;
  onImagePress?: (url: string, index: number) => void;
}

const { width: windowWidth } = Dimensions.get('window');

const ZoomableImage = ({ url, width, height, onPress }: { url: string, width: number, height: number, onPress?: () => void }) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
      } else {
        savedScale.value = scale.value;
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
      } else {
        scale.value = withTiming(2);
        savedScale.value = 2;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={Gesture.Exclusive(pinchGesture, doubleTapGesture)}>
      <Animated.View style={[{ width, height }, animatedStyle]}>
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={onPress}
          disabled={!onPress}
          style={{ width, height }}
        >
          <Image 
            source={{ uri: url }} 
            style={{ width, height }} 
            resizeMode="cover"
          />
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

export const PhotoGallery = ({ 
  photoUrls, 
  width = windowWidth - 48, 
  height = 240,
  borderRadius = 24,
  onImagePress
}: PhotoGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultipleImages = photoUrls && photoUrls.length > 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    if (width > 0) {
      const index = Math.round(contentOffset / width);
      setCurrentIndex(index);
    }
  };

  if (!photoUrls || photoUrls.length === 0) return null;

  return (
    <View style={[styles.container, { width, height, borderRadius }]}>
      {hasMultipleImages ? (
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={width}
        >
          {photoUrls.map((url, index) => (
            <ZoomableImage 
              key={index} 
              url={url} 
              width={width} 
              height={height} 
              onPress={() => onImagePress?.(url, index)} 
            />
          ))}
        </ScrollView>
      ) : (
        <ZoomableImage 
          url={photoUrls[0]} 
          width={width} 
          height={height} 
          onPress={() => onImagePress?.(photoUrls[0], 0)} 
        />
      )}

      {hasMultipleImages && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{currentIndex + 1}/{photoUrls.length}</Text>
        </View>
      )}
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
});
