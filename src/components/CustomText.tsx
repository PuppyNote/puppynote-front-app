import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

export function CustomText(props) {
  return <RNText {...props} style={[styles.font, props.style]} />;
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'sans-serif',
  },
});
