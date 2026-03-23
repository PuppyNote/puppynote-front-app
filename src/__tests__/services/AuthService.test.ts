import { authService } from '../../services/auth/AuthService';
import { apiService } from '../../services/ApiService';
import { storageService } from '../../services/auth/StorageService';

jest.mock('../../services/ApiService', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

jest.mock('../../services/auth/StorageService', () => ({
  storageService: {
    saveAccessToken: jest.fn(),
    saveRefreshToken: jest.fn(),
  },
}));

describe('AuthService (인증 서비스)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('login은 이메일과 비밀번호로 성공적으로 로그인해야 한다', async () => {
    const mockLoginData = {
      accessToken: 'access',
      refreshToken: 'refresh',
      email: 'test@test.com'
    };

    (apiService.post as jest.Mock).mockResolvedValue({
      data: mockLoginData,
      statusCode: 200
    });

    const result = await authService.login('test@test.com', 'device-id', 'push-key', 'password');

    expect(apiService.post).toHaveBeenCalledWith('/api/v1/auth/login', {
      email: 'test@test.com',
      password: 'password',
      deviceId: 'device-id',
      pushKey: 'push-key'
    });
    expect(storageService.saveAccessToken).toHaveBeenCalledWith('access');
    expect(storageService.saveRefreshToken).toHaveBeenCalledWith('refresh');
    expect(result).toEqual(mockLoginData);
  });

  it('getProfile은 사용자 프로필 정보를 성공적으로 가져와야 한다', async () => {
    const mockProfile = {
      userId: 1,
      email: 'test@test.com',
      nickName: '퍼피',
      profileUrl: 'url'
    };

    (apiService.get as jest.Mock).mockResolvedValue({
      data: mockProfile,
      statusCode: 200
    });

    const result = await authService.getProfile();

    expect(apiService.get).toHaveBeenCalledWith('/api/v1/user/profile');
    expect(result).toEqual(mockProfile);
  });

  it('updateProfile은 프로필 정보를 성공적으로 수정해야 한다', async () => {
    const updateData = { nickName: '새이름' };
    (apiService.patch as jest.Mock).mockResolvedValue({
      statusCode: 200
    });

    await authService.updateProfile(updateData);

    expect(apiService.patch).toHaveBeenCalledWith('/api/v1/user/profile', updateData);
  });

  it('register는 회원가입을 성공적으로 완료해야 한다', async () => {
    const registerRequest = { email: 'new@test.com', nickName: '신규', password: 'password' };
    const mockUserData = { email: 'new@test.com', nickName: '신규' };

    (apiService.post as jest.Mock).mockResolvedValue({
      data: mockUserData,
      statusCode: 201
    });

    const result = await authService.register(registerRequest);

    expect(apiService.post).toHaveBeenCalledWith('/api/v1/user/signup', registerRequest);
    expect(result).toEqual(mockUserData);
  });
});
