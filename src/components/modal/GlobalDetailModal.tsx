import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';
import { CustomText as Text } from '../CustomText';

interface GlobalDetailModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  height?: string | number;
  backgroundColor?: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function GlobalDetailModal({
  visible,
  onClose,
  title,
  children,
  height = '85%',
  backgroundColor = '#fcfaf2',
}: GlobalDetailModalProps) {
  const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      // Slide up
      Animated.spring(panY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    // Slide down
    Animated.timing(panY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to downward swipes
        return gestureState.dy > 5;
      },
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          handleClose();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          activeOpacity={1} 
          onPress={handleClose} 
        />
        <Animated.View 
          style={[
            styles.container, 
            { 
              height, 
              backgroundColor,
              transform: [{ translateY: panY }] 
            }
          ]}
        >
          <View style={styles.dragZone} {...panResponders.panHandlers}>
            <View style={styles.handleBar} />
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    width: '100%',
    paddingTop: 0, // Removed top padding here to handle it in dragZone
    paddingHorizontal: 24,
  },
  dragZone: {
    width: '100%',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
});
