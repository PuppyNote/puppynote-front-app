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
 * 월간 산책 캘린더 위젯
 */
const MonthlyCalendar = (props: WidgetProps & CalendarState) => {
  'widget';

  const days = props.days || [];
  
  // 날짜 데이터를 7일 단위로 묶어 주차별 배열 생성
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <VStack alignment="leading" spacing={10} modifiers={[padding(12), background('#ffffff')]}>
      <HStack>
        <VStack alignment="leading" spacing={2}>
          <Text modifiers={[font({ size: 14, weight: 'bold' }), foregroundStyle('#1A1A1B')]}>
            이번 달 산책 기록
          </Text>
          <Text modifiers={[font({ size: 9 }), foregroundStyle('#8E8E93')]}>
            최근 업데이트: {props.lastUpdated ? new Date(props.lastUpdated).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '-'}
          </Text>
        </VStack>
        <Spacer />
        <Button 
          onPress={async () => {
            // API 호출 로직 예정
            return { lastUpdated: new Date().toISOString() };
          }}
        >
          <Text modifiers={[font({ size: 12 })]}>🔄</Text>
        </Button>
      </HStack>
      
      <VStack spacing={4}>
        {weeks.length > 0 ? (
          weeks.map((week, i) => (
            <HStack key={i} spacing={4}>
              {week.map((day, j) => (
                <VStack key={j} alignment="center" spacing={2}>
                  <Box 
                    modifiers={[
                      frame({ width: 22, height: 22 }),
                      background(day.hasWalk ? '#FFBD3D' : '#F2F2F7'),
                      cornerRadius(4)
                    ]}
                  >
                    {day.hasWalk && (
                      <Text modifiers={[font({ size: 10 })]}>🐾</Text>
                    )}
                  </Box>
                  <Text modifiers={[font({ size: 7 }), foregroundStyle('#C7C7CC')]}>
                    {new Date(day.date).getDate()}
                  </Text>
                </VStack>
              ))}
            </HStack>
          ))
        ) : (
          <Text modifiers={[font({ size: 12 }), foregroundStyle('#C7C7CC'), padding(20)]}>
            데이터를 불러오는 중이거나 없습니다.
          </Text>
        )}
      </VStack>
    </VStack>
  );
};

export default createWidget('MonthlyCalendar', MonthlyCalendar);
