import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Dimensions, Platform, Linking, BackHandler } from 'react-native';
import { CustomText as Text } from '../item/CustomText';

interface ForceUpdateModalProps {
  visible: boolean;
  storeUrl: string;
}

const { width } = Dimensions.get('window');

/**
 * 강제 업데이트 안내 모달.
 * 뒤로가기/바깥 터치로 닫히지 않습니다 - 업데이트하거나(Android는) 앱을 종료하는 것 외엔 빠져나갈 수 없습니다.
 * iOS는 앱이 스스로를 완전히 종료하는 공식 API가 없어서(Apple이 의도적으로 막음) "종료" 버튼을 두지 않고,
 * 모달을 계속 띄워두는 것으로 사용을 막습니다.
 */
export default function ForceUpdateModal({ visible, storeUrl }: ForceUpdateModalProps) {
  const handleUpdate = () => {
    Linking.openURL(storeUrl).catch(() => {});
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>업데이트가 필요합니다</Text>
            <Text style={styles.message}>
              새로운 버전이 출시되었습니다.{'\n'}계속 이용하시려면 최신 버전으로 업데이트해주세요.
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            {Platform.OS === 'android' && (
              <TouchableOpacity
                style={[styles.button, styles.exitButton]}
                onPress={() => BackHandler.exitApp()}
              >
                <Text style={styles.exitButtonText}>종료</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.updateButton]}
              onPress={handleUpdate}
            >
              <Text style={styles.updateButtonText}>업데이트</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButton: {
    backgroundColor: '#eebd2b',
  },
  updateButtonText: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 15,
  },
  exitButton: {
    backgroundColor: 'white',
  },
  exitButtonText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 15,
  },
});
