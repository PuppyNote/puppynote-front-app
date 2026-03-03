import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function BottomTab({ state, descriptors, navigation }: any) {
  const getTabIcon = (routeName: string, isFocused: boolean) => {
    switch (routeName) {
      case 'Home':
        return isFocused 
          ? require('../../../assets/bottomTab/home-click.png') 
          : require('../../../assets/bottomTab/home.png');
      case 'Walk':
        return isFocused 
          ? require('../../../assets/bottomTab/walk-click.png') 
          : require('../../../assets/bottomTab/walk.png');
      case 'Supplies':
        return isFocused 
          ? require('../../../assets/bottomTab/supply-click.png') 
          : require('../../../assets/bottomTab/supply.png');
      case 'Health':
        return isFocused 
          ? require('../../../assets/bottomTab/health-click.png') 
          : require('../../../assets/bottomTab/health.png');
      case 'Settings':
        return isFocused 
          ? require('../../../assets/bottomTab/setting-click.png') 
          : require('../../../assets/bottomTab/setting.png');
      default:
        return require('../../../assets/bottomTab/home.png');
    }
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
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
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <Image 
              source={getTabIcon(route.name, isFocused)}
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
});
