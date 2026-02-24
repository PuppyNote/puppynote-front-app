import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Text } from '..';

export default function BottomTab({ state, descriptors, navigation }: any) {
  const tabs = [
    { 
      name: 'Home', 
      label: '홈',
      icon: require('../../../assets/bottomTab/home.png'),
      iconFocused: require('../../../assets/bottomTab/home-click.png'),
    },
    { 
      name: 'Walk', 
      label: '산책',
      icon: require('../../../assets/bottomTab/walk.png'),
      iconFocused: require('../../../assets/bottomTab/walk-click.png'),
    },
    { 
      name: 'Supplies', 
      label: '용품',
      icon: require('../../../assets/bottomTab/supply.png'),
      iconFocused: require('../../../assets/bottomTab/supply-click.png'),
    },
    { 
      name: 'Health', 
      label: '건강',
      icon: require('../../../assets/bottomTab/health.png'),
      iconFocused: require('../../../assets/bottomTab/health-click.png'),
    },
    { 
      name: 'Settings', 
      label: '설정',
      icon: require('../../../assets/bottomTab/setting.png'),
      iconFocused: require('../../../assets/bottomTab/setting-click.png'),
    },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[index].key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(tab.name);
          }
        };

        return (
          <TouchableOpacity 
            key={tab.name}
            style={styles.tabItem} 
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Image 
              source={isFocused ? tab.iconFocused : tab.icon}
              style={[styles.icon, isFocused && { transform: [{ scale: 1.4 }] }]}
            />
          </TouchableOpacity>
        );
      })}
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
  icon: {
    width: 30,
    height: 30,
  },
  label: {
    fontSize: 10,
  },
  labelActive: {
    fontWeight: 'bold',
    color: '#eebd2b',
  },
  labelInactive: {
    fontWeight: '500',
    color: '#94a3b8',
  },
});
