import { apiService } from '../ApiService';
import { AlarmStatus } from '../../types/enums';

export interface WalkAlarm {
  alarmId: number;
  alarmStatus: AlarmStatus;
  alarmDays: string[];
  alarmTime: string;
}

export interface CreateWalkAlarmRequest {
  petId: number;
  alarmStatus: AlarmStatus;
  alarmDays: string[];
  alarmTime: string; // HH:mm
}

export interface UpdateWalkAlarmRequest {
  alarmId: number;
  alarmStatus: AlarmStatus;
  alarmDays: string[];
  alarmTime: string; // HH:mm
}

class PetWalkAlarmService {
  // 산책 알람 목록 조회 API
  public async getWalkAlarms(petId: number): Promise<WalkAlarm[]> {
    const response = await apiService.get<WalkAlarm[]>(`/api/v1/pet-walk-alarms`, {
      params: { petId }
    });
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '알람 목록 조회에 실패했습니다.');
    }
    
    return response.data;
  }

  // 산책 알람 등록 API
  public async createWalkAlarm(data: CreateWalkAlarmRequest): Promise<WalkAlarm> {
    const response = await apiService.post<WalkAlarm>('/api/v1/pet-walk-alarms', data);
    
    if (response.statusCode !== 201) {
      throw new Error(response.message || '알람 등록에 실패했습니다.');
    }
    
    return response.data;
  }

  // 산책 알람 수정 API
  public async updateWalkAlarm(data: UpdateWalkAlarmRequest): Promise<WalkAlarm> {
    const response = await apiService.put<WalkAlarm>('/api/v1/pet-walk-alarms', data);
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '알람 수정에 실패했습니다.');
    }
    
    return response.data;
  }

  // 산책 알람 활성화 여부 수정 API
  public async updateWalkAlarmStatus(alarmId: number, status: AlarmStatus): Promise<WalkAlarm> {
    const response = await apiService.patch<WalkAlarm>('/api/v1/pet-walk-alarms/status', {
      alarmId,
      alarmStatus: status,
    });
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '알람 상태 변경에 실패했습니다.');
    }
    
    return response.data;
  }

  // 산책 알람 삭제 API
  public async deleteWalkAlarm(alarmId: number): Promise<void> {
    const response = await apiService.delete<void>(`/api/v1/pet-walk-alarms/${alarmId}`);
    
    if (response.statusCode !== 200 && response.statusCode !== 204) {
      throw new Error(response.message || '알람 삭제에 실패했습니다.');
    }
  }
}

export const petWalkAlarmService = new PetWalkAlarmService();
