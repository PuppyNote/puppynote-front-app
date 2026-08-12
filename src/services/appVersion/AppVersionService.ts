import { apiService } from '../ApiService';

export interface AppVersionInfo {
  iosVersion: string;
  aosVersion: string;
  iosStoreUrl: string;
  aosStoreUrl: string;
}

class AppVersionService {
  // 강제 업데이트 체크용 - 인증 불필요
  public async getAppVersion(): Promise<AppVersionInfo> {
    const response = await apiService.get<AppVersionInfo>('/api/v1/app-version');
    if (response.statusCode !== 200) {
      throw new Error(response.message || '앱 버전 조회에 실패했습니다.');
    }
    return response.data;
  }
}

export const appVersionService = new AppVersionService();
