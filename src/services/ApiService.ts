import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { storageService } from './auth/StorageService';

const BASE_URL = 'https://sangkihan.co.kr/puppynote';

export interface ApiResponse<T> {
  statusCode: number;
  httpStatus: string;
  message: string;
  data: T;
}

class ApiService {
  private instance: AxiosInstance;

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
        // Successful responses follow the custom ApiResponse format
        const data = response.data as ApiResponse<any>;
        // If server returns a valid ApiResponse but statusCode is not success (e.g., 400 with 200 HTTP)
        // However, standard use is to return the data and let service handle statusCode
        return response.data;
      },
      (error: AxiosError) => {
        if (error.response) {
          // Server responded with an error status (4xx, 5xx)
          const errorData = error.response.data as any;
          console.log('API Error Response:', errorData);
          // Always return an object with a message property for the UI to display
          return Promise.reject({ 
            message: errorData?.message || '서버 오류가 발생했습니다.',
            statusCode: errorData?.statusCode || error.response.status,
            ...errorData
          });
        } else if (error.request) {
          // Request was made but no response received
          console.log('API No Response:', error.request);
          return Promise.reject({ message: '네트워크 연결을 확인해주세요.' });
        } else {
          // Something else happened
          console.log('API Request Error:', error.message);
          return Promise.reject({ message: '알 수 없는 오류가 발생했습니다.' });
        }
      }
    );
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

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.delete<any, ApiResponse<T>>(url, config);
  }
}

export const apiService = new ApiService();
