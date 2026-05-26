'widget';

import { VStack, HStack, Text, Spacer, Button, Box } from '@expo/ui/swift-ui';
import { font, foregroundStyle, padding, frame, background, cornerRadius } from '@expo/ui/swift-ui/modifiers';
import { createWidget, WidgetProps } from 'expo-widgets';

interface CalendarDay {
  date: string;
  hasWalk: boolean;
}

interface CalendarState {
  days: CalendarDay[];
  lastUpdated: string;
}

/**
 * 주간 산책 캘린더 위젯
 */
const WeeklyCalendar = (props: WidgetProps & CalendarState) => {
  'widget';

  const allDays = props.days || [];
  
  // 현재 날짜를 기준으로 이번 주의 데이터만 필터링하거나, 
  // API에서 가져온 데이터 중 오늘이 포함된 주를 찾습니다.
  const todayStr = new Date().toISOString().split('T')[0];
  const todayIndex = allDays.findIndex(d => d.date === todayStr);
  
  let weeklyDays = [];
  if (todayIndex !== -1) {
    // 오늘을 기준으로 앞뒤로 일주일을 맞춥니다 (예: 일~토)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (일) ~ 6 (토)
    const startOfWeekIndex = todayIndex - dayOfWeek;
    weeklyDays = allDays.slice(Math.max(0, startOfWeekIndex), Math.max(7, startOfWeekIndex + 7));
  } else {
    weeklyDays = allDays.slice(0, 7);
  }
  
  return (
    <VStack alignment="leading" spacing={12} modifiers={[padding(16), background('#ffffff')]}>
      <HStack>
        <VStack alignment="leading" spacing={2}>
          <Text modifiers={[font({ size: 16, weight: 'bold' }), foregroundStyle('#1A1A1B')]}>
            이번 주 산책
          </Text>
          <Text modifiers={[font({ size: 10 }), foregroundStyle('#8E8E93')]}>
            마지막 업데이트: {props.lastUpdated ? new Date(props.lastUpdated).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '-'}
          </Text>
        </VStack>
        <Spacer />
        <Button 
          onPress={async () => {
            // 여기에 실제 API 호출 로직이 들어갈 예정입니다.
            // 위젯의 상태를 반환하여 업데이트합니다.
            return { 
              lastUpdated: new Date().toISOString() 
            };
          }}
        >
          <Text modifiers={[font({ size: 12 })]}>🔄</Text>
        </Button>
      </HStack>
      
      <HStack spacing={8}>
        {weeklyDays.length > 0 ? (
          weeklyDays.map((day, i) => {
            const dateObj = new Date(day.date);
            const dayName = dateObj.toLocaleDateString('ko-KR', { weekday: 'short' });
            return (
              <VStack key={i} spacing={6} alignment="center" modifiers={[frame({ minWidth: 32 })]}>
                <Text modifiers={[font({ size: 10, weight: 'medium' }), foregroundStyle('#8E8E93')]}>
                  {dayName}
                </Text>
                <Box 
                  modifiers={[
                    frame({ width: 28, height: 28 }),
                    background(day.hasWalk ? '#FFBD3D' : '#F2F2F7'),
                    cornerRadius(14)
                  ]}
                >
                  {day.hasWalk && (
                    <Text modifiers={[font({ size: 14 })]}>🐾</Text>
                  )}
                </Box>
              </VStack>
            );
          })
        ) : (
          <Text modifiers={[font({ size: 12 }), foregroundStyle('#C7C7CC')]}>
            데이터가 없습니다.
          </Text>
        )}
      </HStack>
    </VStack>
  );
};

export default createWidget('WeeklyCalendar', WeeklyCalendar);
