import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CustomText as Text } from '../common/item/CustomText';

export interface WebViewLoadError {
  /** 사용자에게 보여줄 제목 */
  title: string;
  /** 사용자에게 보여줄 안내 문구 */
  message: string;
  /** 디버깅용 원본 (개발 빌드에서만 노출) */
  detail?: string;
}

interface WebViewErrorViewProps {
  error: WebViewLoadError;
  onRetry: () => void;
}

export default function WebViewErrorView({ error, onRetry }: WebViewErrorViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{error.title}</Text>
        <Text style={styles.message}>{error.message}</Text>

        {__DEV__ && !!error.detail && <Text style={styles.detail}>{error.detail}</Text>}

        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.retryText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fcfaf2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    zIndex: 5,
  },
  card: {
    width: '100%',
    maxWidth: 384,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  detail: {
    marginTop: 12,
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: '#eebd2b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#eebd2b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  retryText: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
});
