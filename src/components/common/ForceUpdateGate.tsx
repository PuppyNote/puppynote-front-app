import React, { useEffect, useState } from 'react';
import { Platform, BackHandler } from 'react-native';
import * as Application from 'expo-application';
import ForceUpdateModal from './modal/ForceUpdateModal';
import { appVersionService } from '../../services/appVersion/AppVersionService';

/**
 * 앱 실행 시 서버가 알려주는 최신 버전과 현재 설치된 버전을 비교해,
 * 다르면 업데이트 전까지 앱을 못 쓰게 막는 모달을 띄웁니다.
 * 조회 자체가 실패하면(네트워크 오류 등) 그냥 넘어갑니다 - 이 체크가 앱 전체를 막는 SPOF가 되면 안 됩니다.
 */
export default function ForceUpdateGate() {
  const [storeUrl, setStoreUrl] = useState<string | null>(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const info = await appVersionService.getAppVersion();
        const currentVersion = Application.nativeApplicationVersion ?? '';
        const latestVersion = Platform.OS === 'ios' ? info.iosVersion : info.aosVersion;
        const url = Platform.OS === 'ios' ? info.iosStoreUrl : info.aosStoreUrl;

        if (currentVersion && latestVersion && currentVersion !== latestVersion) {
          setStoreUrl(url);
        }
      } catch (error) {
        console.error('Failed to check app version:', error);
      }
    };

    checkVersion();
  }, []);

  useEffect(() => {
    if (!storeUrl) return;

    // 강제 업데이트 모달이 떠 있는 동안은 하드웨어 뒤로가기로 밑의 화면이 반응하지 못하게 막습니다.
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, [storeUrl]);

  if (!storeUrl) return null;

  return <ForceUpdateModal visible storeUrl={storeUrl} />;
}
