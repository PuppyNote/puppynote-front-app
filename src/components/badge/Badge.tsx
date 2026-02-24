import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '..';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'neutral';
}

export default function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const badgeStyle = [styles.badge, styles[variant]];
  const textStyle = [styles.text, styles[`${variant}Text`]];

  return (
    <View style={badgeStyle}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  success: { backgroundColor: '#f0fdf4' },
  successText: { color: '#22c55e' },
  warning: { backgroundColor: '#fff7ed' },
  warningText: { color: '#f97316' },
  error: { backgroundColor: '#fef2f2' },
  errorText: { color: '#ef4444' },
  neutral: { backgroundColor: '#f1f5f9' },
  neutralText: { color: '#64748b' },
} as any);
