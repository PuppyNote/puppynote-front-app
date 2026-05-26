import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface CalendarDay {
  date: string;
  hasWalk: boolean;
}

interface Props {
  days: CalendarDay[];
  lastUpdated?: string;
}

export const MonthlyWidget = ({ days, lastUpdated }: Props) => {
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
      }}
    >
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
          marginBottom: 8,
        }}
      >
        <FlexWidget style={{ flexDirection: 'column' }}>
          <TextWidget
            text="월간 산책 기록"
            style={{ fontSize: 14, fontWeight: 'bold', color: '#1A1A1B' }}
          />
          <TextWidget
            text={`업데이트: ${lastUpdated || '-'}`}
            style={{ fontSize: 8, color: '#8E8E93' }}
          />
        </FlexWidget>
        <FlexWidget 
          clickAction="REFRESH"
          style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}
        >
          <TextWidget text="🔄" style={{ fontSize: 12 }} />
        </FlexWidget>
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'column', width: 'match_parent' }}>
        {weeks.map((week, i) => (
          <FlexWidget key={i} style={{ flexDirection: 'row', width: 'match_parent', justifyContent: 'space-between', marginBottom: 4 }}>
            {week.map((day, j) => (
              <FlexWidget
                key={j}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: day.hasWalk ? '#FFBD3D' : '#F2F2F7',
                  borderRadius: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {day.hasWalk && <TextWidget text="🐾" style={{ fontSize: 8 }} />}
              </FlexWidget>
            ))}
          </FlexWidget>
        ))}
      </FlexWidget>
    </FlexWidget>
  );
};
