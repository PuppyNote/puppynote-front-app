import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomText as Text } from '../CustomText';
import { alertHistoryService } from '../../services/alertHistory/AlertHistoryService';

export default function TopBar({ navigation, options, route }: any) {
  const [hasNotification, setHasNotification] = useState(false);
  const insets = useSafeAreaInsets();
  const title = options?.headerTitle || route?.name || 'PuppyNote';
  const iconSource = options?.headerIcon || require('../../../assets/puppynote-icon.png');
  
  // 알림 상태 조회
  const checkNotifications = useCallback(async () => {
    try {
      const exists = await alertHistoryService.getUncheckedAlertExists();
      setHasNotification(exists);
    } catch (error) {
      console.error('Failed to check notifications:', error);
    }
  }, []);

  useEffect(() => {
    checkNotifications();

    // 화면 포커스가 변경될 때마다 알림 상태를 다시 확인하기 위해 이벤트 리스너 등록
    const unsubscribe = navigation.addListener('focus', () => {
      checkNotifications();
    });

    return unsubscribe;
  }, [navigation, checkNotifications]);

  const handleNotificationPress = () => {
    navigation.navigate('AlertHistory');
  };

  // 메인 탭 화면인지 확인
  const mainTabs = ['Home', 'Walk', 'Supplies', 'Settings'];
  const isMainTab = mainTabs.includes(route.name);
  
  // 메인 탭이 아니고 뒤로가기가 가능할 때만 뒤로가기 버튼 표시
  const canGoBack = navigation?.canGoBack() && !isMainTab;
  const isAlertHistory = route.name === 'AlertHistory';

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          {canGoBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.iconContainer}>
              {typeof iconSource === 'string' ? (
                <Text style={styles.icon}>{iconSource}</Text>
              ) : (
                <Image source={iconSource} style={{ width: 32, height: 32 }} />
              )}
            </View>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
        {!isAlertHistory && (
          <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
            <Image 
              source={hasNotification ? require('../../../assets/alarm/alarm-on.png') : require('../../../assets/alarm/alarm.png')}
              style={styles.notificationIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fcfaf2',
    paddingHorizontal: 24,
    paddingBottom: 4, // 16에서 4로 대폭 감소
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4, // 8에서 4로 감소
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  backIcon: {
    fontSize: 24,
    color: '#0f172a',
    fontWeight: 'bold',
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
