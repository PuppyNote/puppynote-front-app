import { apiService } from '../ApiService';
import { deviceService } from './DeviceService';
import { storageService } from './StorageService';

export interface UserData {
  email: string;
  nickName: string;
}

export interface RegisterRequest {
  email: string;
  nickName: string;
  password: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  email: string;
  nickName?: string;
  settingStatus?: 'INCOMPLETE' | 'COMPLETE';
}

export interface LoginRequest {
  email: string;
  password?: string;
  deviceId?: string;
  pushKey?: string;
}

class AuthService {
  // 이메일 인증번호 발송 API
  public async sendVerification(email: string): Promise<string> {
    const response = await apiService.post<string>('/api/v1/user/email/send', { email });
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '인증번호 발송에 실패했습니다.');
    }
    
    return response.data;
  }

  // 회원가입 API
  public async register(data: RegisterRequest): Promise<UserData> {
    const response = await apiService.post<UserData>('/api/v1/user/signup', data);
    
    if (response.statusCode !== 201) {
      throw new Error(response.message || '회원가입에 실패했습니다.');
    }
    
    return response.data;
  }

  // 일반 로그인 API
  public async login(email: string, password?: string): Promise<LoginData> {
    const deviceId = await deviceService.getDeviceId();
    const pushKey = await deviceService.getPushKey();

    const response = await apiService.post<LoginData>('/api/v1/auth/login', {
      email,
      password,
      deviceId,
      pushKey,
    });
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '로그인에 실패했습니다.');
    }

    await storageService.saveAccessToken(response.data.accessToken);
    await storageService.saveRefreshToken(response.data.refreshToken);
    
    return response.data;
  }

  // OAuth 로그인 API (KAKAO, GOOGLE 등)
  public async oauthLogin(token: string, snsType: 'KAKAO' | 'GOOGLE'): Promise<LoginData> {
    const deviceId = await deviceService.getDeviceId();
    const pushKey = await deviceService.getPushKey();

    const response = await apiService.post<LoginData>('/api/v1/auth/oauth/login', {
      token,
      snsType,
      deviceId,
      pushKey,
    });
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || 'OAuth 로그인에 실패했습니다.');
    }

    await storageService.saveAccessToken(response.data.accessToken);
    await storageService.saveRefreshToken(response.data.refreshToken);
    
    return response.data;
  }
}

export const authService = new AuthService();
