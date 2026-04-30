import { apiService } from '../ApiService';

export interface WeatherInfo {
  temperature: number;
  weatherCode: number;
  weatherDescription: string;
  windSpeed: number;
  precipitation: number;
  walkCondition: 'GREAT' | 'GOOD' | 'MODERATE' | 'BAD' | 'DANGER';
  walkMessage: string;
}

class WeatherService {
  /**
   * 현재 위치 기반 날씨 정보를 조회합니다.
   * @param latitude 위도
   * @param longitude 경도
   */
  async getWeather(latitude: number, longitude: number): Promise<WeatherInfo> {
    const response = await apiService.get<WeatherInfo>(`/api/v1/weather`, {
      params: { latitude, longitude },
    });
    return response.data;
  }

  /**
   * WMO 날씨 코드를 적절한 이모지로 변환합니다.
   * @param code WMO 날씨 코드
   */
  getWeatherEmoji(code: number): string {
    if (code === 0) return '☀️'; // 맑음
    if (code >= 1 && code <= 3) return '☁️'; // 대체로 맑음, 부분적으로 흐림, 흐림
    if (code === 45 || code === 48) return '🌫️'; // 안개
    if (code >= 51 && code <= 57) return '🌦️'; // 이슬비
    if (code >= 61 && code <= 67) return '🌧️'; // 비
    if (code >= 71 && code <= 77) return '❄️'; // 눈
    if (code >= 80 && code <= 82) return '🚿'; // 소나기
    if (code >= 85 && code <= 86) return '🌨️'; // 눈 소나기
    if (code >= 95 && code <= 99) return '⚡'; // 뇌우
    return '🌡️';
  }
}

export const weatherService = new WeatherService();
