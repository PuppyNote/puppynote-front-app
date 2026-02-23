import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function BottomTab({ state, descriptors, navigation }: any) {
  const tabs = [
    { name: 'Home', icon: '🏠', label: '홈' },
    { name: 'Supplies', icon: '📦', label: '용품' },
    { name: 'Health', icon: '🏥', label: '건강' },
    { name: 'Settings', icon: '⚙️', label: '설정' },
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
            <Text style={[styles.icon, isFocused ? styles.iconActive : styles.iconInactive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, isFocused ? styles.labelActive : styles.labelInactive]}>
              {tab.label}
            </Text>
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
    gap: 4,
  },
  icon: {
    fontSize: 20,
  },
  iconActive: {
    color: '#eebd2b',
  },
  iconInactive: {
    color: '#94a3b8',
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
