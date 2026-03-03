import { apiService } from '../ApiService';

export type AlertStatus = 'ON' | 'OFF';

export interface AlertSettingData {
  all: AlertStatus;
  walk: AlertStatus;
  friend: AlertStatus;
}

export interface UpdateAlertSettingRequest {
  all: AlertStatus;
  walk: AlertStatus;
  friend: AlertStatus;
}

class AlertSettingService {
  /**
   * 알림 설정 조회 API
   */
  public async getAlertSetting(): Promise<AlertSettingData> {
    const response = await apiService.get<AlertSettingData>('/api/v1/alert-setting');
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '알림 설정 조회에 실패했습니다.');
    }
    
    return response.data;
  }

  /**
   * 알림 설정 수정 API
   */
  public async updateAlertSetting(data: UpdateAlertSettingRequest): Promise<AlertSettingData> {
    const response = await apiService.patch<AlertSettingData>('/api/v1/alert-setting', data);
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '알림 설정 수정에 실패했습니다.');
    }
    
    return response.data;
  }
}

export const alertSettingService = new AlertSettingService();
