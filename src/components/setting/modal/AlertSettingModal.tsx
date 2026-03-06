import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { CustomText as Text } from '../../common/item/CustomText';
import GlobalDetailModal from '../../common/modal/GlobalDetailModal';
import { alertSettingService, AlertSettingData, AlertStatus } from '../../../services/alertSetting/AlertSettingService';
import { useAlert } from '../../../hooks/useAlert';

interface AlertSettingModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AlertSettingModal({
  visible,
  onClose,
}: AlertSettingModalProps) {
  const [settings, setSettings] = useState<AlertSettingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showSimpleAlert } = useAlert();

  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await alertSettingService.getAlertSetting();
      setSettings(data);
    } catch (error: any) {
      showSimpleAlert('오류', error.message || '알림 설정을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (key: keyof AlertSettingData) => {
    if (!settings) return;

    const newValue: AlertStatus = settings[key] === 'ON' ? 'OFF' : 'ON';
    
    // 전체 알림(all)을 끄면 나머지도 꺼지는 등의 서버 로직이 있을 수 있으나, 
    // 여기서는 단순히 현재 상태에서 해당 키만 반전시켜 요청을 보냅니다.
    const updatedRequest = {
      ...settings,
      [key]: newValue,
    };

    // UI 즉시 반영 (Optimistic Update)
    const previousSettings = { ...settings };
    setSettings(updatedRequest);

    try {
      const result = await alertSettingService.updateAlertSetting(updatedRequest);
      setSettings(result);
    } catch (error: any) {
      // 에러 시 복구
      setSettings(previousSettings);
      showSimpleAlert('오류', error.message || '알림 설정 변경에 실패했습니다.');
    }
  };

  const renderToggleItem = (key: keyof AlertSettingData, title: string, description: string) => {
    const isEnabled = settings?.[key] === 'ON';
    
    return (
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
        <Switch
          trackColor={{ false: "#E9ECEF", true: "#eebd2b" }}
          thumbColor="#fff"
          onValueChange={() => handleToggle(key)}
          value={isEnabled}
          disabled={isLoading}
        />
      </View>
    );
  };

  return (
    <GlobalDetailModal
      visible={visible}
      onClose={onClose}
      title="알림 설정"
      height="60%"
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {isLoading && !settings ? (
          <ActivityIndicator color="#eebd2b" size="large" style={styles.loader} />
        ) : (
          <View style={styles.section}>
            {renderToggleItem('all', '전체 알림', '모든 푸시 알림을 켜거나 끕니다.')}
            <View style={styles.divider} />
            {renderToggleItem('walk', '산책 알림', '산책 시간 및 활동 관련 알림을 받습니다.')}
            <View style={styles.divider} />
            {renderToggleItem('friend', '친구 알림', '친구 요청 및 커뮤니티 관련 알림을 받습니다.')}
          </View>
        )}
      </ScrollView>
    </GlobalDetailModal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  loader: {
    marginTop: 40,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 24,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 20,
  },
});
