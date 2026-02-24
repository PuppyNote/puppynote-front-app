import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

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
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request Interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // You can add auth token here later
        // const token = await AsyncStorage.getItem('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Successful responses follow the custom ApiResponse format
        return response.data;
      },
      (error: AxiosError) => {
        if (error.response) {
          // Server responded with an error status (4xx, 5xx)
          console.error('API Error Response:', error.response.data);
          return Promise.reject(error.response.data);
        } else if (error.request) {
          // Request was made but no response received
          console.error('API No Response:', error.request);
          return Promise.reject({ message: '네트워크 연결을 확인해주세요.' });
        } else {
          // Something else happened
          console.error('API Request Error:', error.message);
          return Promise.reject({ message: '알 수 없는 오류가 발생했습니다.' });
        }
      }
    );
  }

  public async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.instance.get<any, ApiResponse<T>>(url, { params });
  }

  public async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.instance.post<any, ApiResponse<T>>(url, data);
  }

  public async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.instance.put<any, ApiResponse<T>>(url, data);
  }

  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.instance.delete<any, ApiResponse<T>>(url);
  }
}

export const apiService = new ApiService();
