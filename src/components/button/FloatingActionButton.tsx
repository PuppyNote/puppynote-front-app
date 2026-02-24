import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '..';

interface FABProps {
  onPress: () => void;
  icon?: string;
}

export default function FloatingActionButton({ onPress, icon = "+" }: FABProps) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.icon}>{icon}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 112,
    right: 24,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eebd2b',
    borderRadius: 28,
    shadowColor: '#eebd2b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 50,
  },
  icon: {
    color: 'white',
    fontSize: 30,
    fontWeight: '300',
  },
});
