import React, { useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { CustomText as Text } from './CustomText';

interface WheelPickerProps {
  items: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  height?: number;
  itemHeight?: number;
  width?: number;
}

export const WheelPicker = ({
  items,
  selectedValue,
  onSelect,
  height = 150,
  itemHeight = 50,
  width = 80,
}: WheelPickerProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const isInitialScroll = useRef(true);

  useEffect(() => {
    const index = items.indexOf(selectedValue);
    if (index !== -1 && scrollViewRef.current) {
      // Small delay to ensure layout is complete
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: index * itemHeight, animated: !isInitialScroll.current });
        isInitialScroll.current = false;
      }, 100);
    }
  }, [selectedValue, items]);

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
    if (index >= 0 && index < items.length) {
      onSelect(items[index]);
    }
  };

  return (
    <View style={[styles.container, { height, width }]}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={{ paddingVertical: (height - itemHeight) / 2 }}
      >
        {items.map((item) => {
          const isSelected = selectedValue === item;
          return (
            <View key={item} style={[styles.item, { height: itemHeight }]}>
              <Text style={[
                styles.itemText,
                isSelected ? styles.selectedText : styles.unselectedText
              ]}>
                {item}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 20,
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#0f172a',
    fontSize: 22,
  },
  unselectedText: {
    color: '#cbd5e1',
  },
});
