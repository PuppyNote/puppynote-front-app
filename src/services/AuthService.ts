import { apiService } from './ApiService';

export interface UserData {
  email: string;
  nickName: string;
}

export interface RegisterRequest {
  email: string;
  nickName: string;
  password?: string;
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

  // 로그인 API
  public async login(email: string, password?: string): Promise<UserData> {
    const response = await apiService.post<UserData>('/api/v1/user/login', { email, password });
    
    if (response.statusCode !== 200) {
      throw new Error(response.message || '로그인에 실패했습니다.');
    }
    
    return response.data;
  }
}

export const authService = new AuthService();
