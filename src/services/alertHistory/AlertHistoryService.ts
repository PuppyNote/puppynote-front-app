import { apiService } from '../ApiService';

export type AlertHistoryStatus = 'CHECKED' | 'UNCHECKED';
export type AlertDestinationType = 'DAILY_REPORT' | 'FRIEND' | 'FRIEND_CODE';

export interface AlertHistory {
  id: number;
  alertDescription: string;
  alertHistoryStatus: AlertHistoryStatus;
  alertDestinationType: AlertDestinationType;
  alertDestinationInfo: string;
  createdDate: string;
}

export interface PageInfo {
  currentPage: number;
  totalPage: number;
  totalElement: number;
}

export interface AlertHistoryResponse {
  content: AlertHistory[];
  pageInfo: PageInfo;
}

class AlertHistoryService {
  /**
   * 알림 내역 목록 조회 API
   */
  public async getAlertHistories(page: number = 1, size: number = 12): Promise<AlertHistoryResponse> {
    const response = await apiService.get<AlertHistoryResponse>('/api/v1/alertHistories', {
      params: { page, size }
    });
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '알림 내역 조회에 실패했습니다.');
    }
    
    return response.data;
  }

  /**
   * 알림 확인 처리 API
   */
  public async checkAlert(id: number): Promise<{ alertHistoryStatus: AlertHistoryStatus }> {
    const response = await apiService.patch<{ alertHistoryStatus: AlertHistoryStatus }>(`/api/v1/alertHistories/${id}`);
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '알림 확인 처리에 실패했습니다.');
    }
    
    return response.data;
  }
}

export const alertHistoryService = new AlertHistoryService();
