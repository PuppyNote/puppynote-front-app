import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomText as Text } from '../CustomText';

export default function TopBar({ options, route }: any) {
  const [hasNotification, setHasNotification] = useState(true);
  const insets = useSafeAreaInsets();
  const title = options?.headerTitle || route?.name || 'PuppyNote';
  const iconSource = options?.headerIcon || require('../../../assets/puppynote-icon.png');

  const handleNotificationPress = () => {
    console.log('Notification button pressed!');
    // TODO: Implement navigation to notification screen
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <View style={styles.iconContainer}>
            {typeof iconSource === 'string' ? (
              <Text style={styles.icon}>{iconSource}</Text>
            ) : (
              <Image source={iconSource} style={{ width: 32, height: 32 }} />
            )}
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>
        <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
          <Image 
            source={hasNotification ? require('../../../assets/alarm/alarm-on.png') : require('../../../assets/alarm/alarm.png')}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fcfaf2',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: '#fcfaf2',
    borderWidth: 1,
    borderColor: '#eebd2b1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    color: '#eebd2b',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    color: '#0f172a',
  },
  notificationButton: {
    padding: 8,
    borderRadius: 999,
  },
  notificationIcon: {
    width: 32,
    height: 32,
  },
});
