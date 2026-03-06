import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { storageService } from './auth/StorageService';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export interface ApiResponse<T> {
  statusCode: number;
  httpStatus: string;
  message: string;
  data: T;
}

type LogoutListener = () => void;

class ApiService {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];
  private logoutListener: LogoutListener | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    });

    // Request Interceptor
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await storageService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      async (error: AxiosError) => {
        const { config, response } = error;
        const originalRequest = config as AxiosRequestConfig & { _retry?: boolean };

        // 401 Unauthorized error
        if (response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Already refreshing, queue this request
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.instance(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await storageService.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Call refresh API directly using instance to avoid circular dependency
            const refreshResponse = await this.instance.post<any, ApiResponse<{ accessToken: string; refreshToken: string }>>(
              '/api/v1/auth/refresh', 
              { refreshToken }
            );

            if (refreshResponse.statusCode === 200) {
              const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
              await storageService.saveAccessToken(accessToken);
              await storageService.saveRefreshToken(newRefreshToken);

              this.isRefreshing = false;
              this.onTokenRefreshed(accessToken);

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }
              return this.instance(originalRequest);
            } else {
              throw new Error('Refresh failed');
            }
          } catch (refreshError) {
            this.isRefreshing = false;
            this.refreshSubscribers = [];
            // Logout and redirect to login
            this.handleLogout();
            return Promise.reject(refreshError);
          }
        }

        if (error.response) {
          const errorData = error.response.data as any;
          return Promise.reject({ 
            message: errorData?.message || '서버 오류가 발생했습니다.',
            statusCode: errorData?.statusCode || error.response.status,
            ...errorData
          });
        }
        return Promise.reject({ message: '네트워크 연결을 확인해주세요.' });
      }
    );
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  public setLogoutListener(listener: LogoutListener) {
    this.logoutListener = listener;
  }

  private async handleLogout() {
    await storageService.clearTokens();
    await storageService.clearSelectedPet();
    if (this.logoutListener) {
      this.logoutListener();
    }
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.get<any, ApiResponse<T>>(url, config);
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.post<any, ApiResponse<T>>(url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.put<any, ApiResponse<T>>(url, data, config);
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.patch<any, ApiResponse<T>>(url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.delete<any, ApiResponse<T>>(url, config);
  }
}

export const apiService = new ApiService();
