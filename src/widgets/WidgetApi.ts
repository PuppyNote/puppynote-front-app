/**
 * 위젯에서 사용할 경량화된 API 호출 유틸리티
 */

// 실제 환경에서는 app.config.js나 .env에서 가져와야 합니다.
const BASE_URL = 'http://localhost:8080'; // 개발 서버 주소

export interface WidgetCalendarData {
  date: string;
  hasWalk: boolean;
}

export const fetchWidgetCalendar = async (petId: number, yearMonth: string, token: string): Promise<WidgetCalendarData[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/walks/calendar?petId=${petId}&yearMonth=${yearMonth}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    if (result.statusCode === 200) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error('Widget API Error:', error);
    return [];
  }
};
