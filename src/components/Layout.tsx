import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

interface LayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
  backgroundColor?: string;
}

export default function Layout({ 
  children, 
  style, 
  edges = ['left', 'right', 'bottom'], // 기본적으로 좌우만 처리 (상단바/하단바가 있을 경우 대비)
  backgroundColor = '#fcfaf2'
}: LayoutProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SafeAreaView style={[styles.flex1, style]} edges={edges}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
});
