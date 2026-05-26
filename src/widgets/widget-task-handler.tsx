import React from 'react';
import { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { WeeklyWidget } from './android/WeeklyWidget';
import { MonthlyWidget } from './android/MonthlyWidget';
import { fetchWidgetCalendar } from './WidgetApi';

// 이 값들은 실제 운영 환경에서는 SharedPreferences 등을 통해 앱에서 전달받아야 합니다.
// 임시로 기본값을 설정하거나, 앱에서 위젯 업데이트 시 전달하도록 구성합니다.
const TEMP_PET_ID = 1;
const TEMP_TOKEN = ''; 

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetName, renderWidget, widgetAction } = props;

  // 데이터 가져오기 로직
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  // TODO: 실제 토큰과 펫 ID를 가져오는 로직 추가 필요
  const days = await fetchWidgetCalendar(TEMP_PET_ID, yearMonth, TEMP_TOKEN);
  const lastUpdated = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  switch (widgetName) {
    case 'WeeklyCalendar':
      // 주간 데이터 필터링 (현재 주의 데이터만)
      // 실제로는 API가 월간 데이터를 주므로 여기서 이번 주만 슬라이싱 하거나 API를 따로 호출
      const weeklyDays = days.slice(0, 7); // 단순화된 예시
      renderWidget(<WeeklyWidget days={weeklyDays} lastUpdated={lastUpdated} />);
      break;
    case 'MonthlyCalendar':
      renderWidget(<MonthlyWidget days={days} lastUpdated={lastUpdated} />);
      break;
  }
}
