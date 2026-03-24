import { authService } from '../../services/auth/AuthService';
import { apiService } from '../../services/ApiService';
import { storageService } from '../../services/auth/StorageService';

jest.mock('../../services/ApiService');
jest.mock('../../services/auth/StorageService');

describe('AuthService (인증 서비스)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('모든 성공 시나리오 테스트', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({ data: {}, statusCode: 200 });
    (apiService.post as jest.Mock).mockResolvedValue({ data: { accessToken: 'a', refreshToken: 'r' }, statusCode: 200 });
    (apiService.patch as jest.Mock).mockResolvedValue({ statusCode: 200 });

    await authService.getProfile();
    await authService.updateProfile({});
    (apiService.post as jest.Mock).mockResolvedValueOnce({ data: {}, statusCode: 201 }); // register
    await authService.register({} as any);
    await authService.login('e', 'd', 'p', 'pw');
    await authService.oauthLogin('t', 'K', 'd', 'p');
    await authService.sendVerification('e');
    await authService.sendPasswordResetVerification('e');
    await authService.resetPassword('e', 'p');
    await authService.refreshToken('r');
  });

  it('모든 실패 시나리오(catch 블록) 커버리지 테스트', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 400, message: '에러' });
    (apiService.post as jest.Mock).mockResolvedValue({ statusCode: 400, message: '에러' });
    (apiService.patch as jest.Mock).mockResolvedValue({ statusCode: 400, message: '에러' });

    await expect(authService.getProfile()).rejects.toThrow();
    await expect(authService.updateProfile({})).rejects.toThrow();
    await expect(authService.register({} as any)).rejects.toThrow();
    await expect(authService.login('e', 'd', 'p')).rejects.toThrow();
    await expect(authService.oauthLogin('t', 'K', 'd', 'p')).rejects.toThrow();
    await expect(authService.sendVerification('e')).rejects.toThrow();
    await expect(authService.sendPasswordResetVerification('e')).rejects.toThrow();
    await expect(authService.resetPassword('e', 'p')).rejects.toThrow();
    await expect(authService.refreshToken('r')).rejects.toThrow();
  });

  it('fallback 메시지 브랜치 커버리지 (message 없는 실패)', async () => {
    (apiService.get as jest.Mock).mockResolvedValue({ statusCode: 400 });
    (apiService.post as jest.Mock).mockResolvedValue({ statusCode: 400 });
    (apiService.patch as jest.Mock).mockResolvedValue({ statusCode: 400 });

    await expect(authService.getProfile()).rejects.toThrow('프로필 조회에 실패했습니다.');
    await expect(authService.updateProfile({})).rejects.toThrow('프로필 수정에 실패했습니다.');
    await expect(authService.register({} as any)).rejects.toThrow('회원가입에 실패했습니다.');
    await expect(authService.login('e', 'd', 'p')).rejects.toThrow('로그인에 실패했습니다.');
    await expect(authService.oauthLogin('t', 'K', 'd', 'p')).rejects.toThrow('OAuth 로그인에 실패했습니다.');
    await expect(authService.sendVerification('e')).rejects.toThrow('인증번호 발송에 실패했습니다.');
    await expect(authService.sendPasswordResetVerification('e')).rejects.toThrow('인증번호 발송에 실패했습니다.');
    await expect(authService.resetPassword('e', 'p')).rejects.toThrow('비밀번호 재설정에 실패했습니다.');
    await expect(authService.refreshToken('r')).rejects.toThrow('토큰 재발급에 실패했습니다.');
  });
});
