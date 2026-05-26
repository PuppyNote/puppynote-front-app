import { requestWidgetUpdate } from 'react-native-android-widget';

/**
 * 앱에서 위젯 데이터를 갱신하기 위한 유틸리티
 */
export const updateWidgets = async () => {
  try {
    // 안드로이드 위젯 갱신 요청
    await requestWidgetUpdate({
      widgetName: 'WeeklyCalendar',
    });
    await requestWidgetUpdate({
      widgetName: 'MonthlyCalendar',
    });
    
    // iOS 위젯의 경우 expo-widgets에서 제공하는 방식으로 갱신 (추후 구현)
    console.log('Widgets update requested');
  } catch (error) {
    console.error('Failed to update widgets:', error);
  }
};
