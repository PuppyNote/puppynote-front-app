import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TopBar({ options, route }: any) {
  const insets = useSafeAreaInsets();
  const title = options?.headerTitle || route?.name || 'PuppyNote';
  const icon = options?.headerIcon || '🐾';

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: '#fcfaf2',
    borderWidth: 1,
    borderColor: '#eebd2b1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
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
});
