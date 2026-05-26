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

export const WeeklyWidget = ({ days, lastUpdated }: Props) => {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
      }}
    >
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
        }}
      >
        <FlexWidget style={{ flexDirection: 'column' }}>
          <TextWidget
            text="이번 주 산책"
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#1A1A1B',
            }}
          />
          <TextWidget
            text={`업데이트: ${lastUpdated || '-'}`}
            style={{
              fontSize: 10,
              color: '#8E8E93',
            }}
          />
        </FlexWidget>
        
        {/* 안드로이드에서는 특정 위젯에 clickAction을 설정하여 새로고침을 구현합니다. */}
        <FlexWidget
          clickAction="REFRESH"
          style={{
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TextWidget text="🔄" style={{ fontSize: 14 }} />
        </FlexWidget>
      </FlexWidget>

      <FlexWidget
        style={{
          flexDirection: 'row',
          marginTop: 16,
          width: 'match_parent',
          justifyContent: 'space-between',
        }}
      >
        {days.map((day, i) => {
          const dateObj = new Date(day.date);
          const dayName = dateObj.toLocaleDateString('ko-KR', { weekday: 'short' });
          return (
            <FlexWidget
              key={i}
              style={{
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <TextWidget
                text={dayName}
                style={{
                  fontSize: 10,
                  color: '#8E8E93',
                  marginBottom: 6,
                }}
              />
              <FlexWidget
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: day.hasWalk ? '#FFBD3D' : '#F2F2F7',
                  borderRadius: 14,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {day.hasWalk && (
                  <TextWidget text="🐾" style={{ fontSize: 12 }} />
                )}
              </FlexWidget>
            </FlexWidget>
          );
        })}
      </FlexWidget>
    </FlexWidget>
  );
};
