import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { storageService } from '../../../services/auth/StorageService';
import CustomAlert from '../modal/CustomAlert';
import { useAlert } from '../../../hooks/useAlert';

export default function BottomTab({ state, descriptors, navigation }: any) {
  const [hasPet, setHasPet] = useState(false);
  const { alertConfig, showSimpleAlert, hideAlert } = useAlert();

  const checkPet = useCallback(async () => {
    const pet = await storageService.getSelectedPet();
    setHasPet(!!pet);
  }, []);

  useEffect(() => {
    checkPet();

    // 탭 바는 네비게이션 상태 변경 시마다 렌더링되므로, 
    // 포커스가 변할 때마다 펫 존재 여부를 다시 확인합니다.
    const unsubscribe = navigation.addListener('state', () => {
      checkPet();
    });

    return unsubscribe;
  }, [navigation, checkPet]);

  const getTabIcon = (routeName: string, isFocused: boolean, isDisabled: boolean) => {
    // 비활성화된 경우 흐릿하게 표시하거나 별도 아이콘 처리 가능 (현재는 동일 아이콘 사용)
    switch (routeName) {
      case 'Home':
        return isFocused 
          ? require('../../../../assets/bottomTab/home-click.png') 
          : require('../../../../assets/bottomTab/home.png');
      case 'Walk':
        return isFocused 
          ? require('../../../../assets/bottomTab/walk-click.png') 
          : require('../../../../assets/bottomTab/walk.png');
      case 'Supplies':
        return isFocused 
          ? require('../../../../assets/bottomTab/supply-click.png') 
          : require('../../../../assets/bottomTab/supply.png');
      case 'Health':
        return isFocused 
          ? require('../../../../assets/bottomTab/health-click.png') 
          : require('../../../../assets/bottomTab/health.png');
      case 'Settings':
        return isFocused 
          ? require('../../../../assets/bottomTab/setting-click.png') 
          : require('../../../../assets/bottomTab/setting.png');
      default:
        return require('../../../../assets/bottomTab/home.png');
    }
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        
        // 산책, 용품 탭은 펫이 없을 때 비활성화
        const isDisabled = !hasPet && (route.name === 'Walk' || route.name === 'Supplies');

        const onPress = () => {
          if (isDisabled) {
            showSimpleAlert('알림', '먼저 우리 아이를 등록해주세요! 🐶');
            return;
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          if (isDisabled) return;
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabItem, isDisabled && styles.disabledTab]}
            activeOpacity={isDisabled ? 1 : 0.7}
          >
            <Image 
              source={getTabIcon(route.name, isFocused, isDisabled)}
              style={[
                styles.icon, 
                isFocused && { transform: [{ scale: 1.4 }] },
                isDisabled && { opacity: 0.3 }
              ]}
            />
          </TouchableOpacity>
        );
      })}
      
      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={hideAlert}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingBottom: 32,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledTab: {
    // 필요한 경우 추가 스타일
  },
  icon: {
    width: 30,
    height: 30,
  },
});
