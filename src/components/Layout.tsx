import React from 'react';
import { View, StyleSheet, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import PetTab from './tabs/PetTab';

interface LayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
  backgroundColor?: string;
  disableKeyboardAvoid?: boolean;
  showPetTab?: boolean;
}

export default function Layout({ 
  children, 
  style, 
  edges = ['left', 'right', 'bottom'],
  backgroundColor = '#fcfaf2',
  disableKeyboardAvoid = false,
  showPetTab = false
}: LayoutProps) {
  const content = (
    <SafeAreaView style={[styles.flex1, style]} edges={edges}>
      {showPetTab && <PetTab />}
      {children}
    </SafeAreaView>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {disableKeyboardAvoid ? (
        content
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex1}
        >
          {content}
        </KeyboardAvoidingView>
      )}
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
