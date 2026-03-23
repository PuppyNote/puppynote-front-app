import { formatToLocalDate, formatToLocalYearMonth, calculateDaysDifference } from '../../utils/DateUtil';

describe('DateUtil (날짜 유틸리티)', () => {
  it('formatToLocalDate는 Date 객체를 YYYY-MM-DD 형식의 로컬 날짜 문자열로 변환해야 한다', () => {
    const date = new Date(2026, 2, 23); // 2026-03-23
    const formatted = formatToLocalDate(date);
    expect(formatted).toBe('2026-03-23');
  });

  it('formatToLocalYearMonth는 연도와 월을 YYYY-MM 형식의 문자열로 변환해야 한다', () => {
    expect(formatToLocalYearMonth(2026, 3)).toBe('2026-03');
    expect(formatToLocalYearMonth(2026, 12)).toBe('2026-12');
  });

  it('calculateDaysDifference는 두 날짜 사이의 일수 차이를 정확히 계산해야 한다', () => {
    const baseDate = new Date(2026, 2, 23); // 2026-03-23
    
    // 미래 날짜
    expect(calculateDaysDifference('2026-03-25', baseDate)).toBe(2);
    // 과거 날짜
    expect(calculateDaysDifference('2026-03-20', baseDate)).toBe(-3);
    // 같은 날짜
    expect(calculateDaysDifference('2026-03-23', baseDate)).toBe(0);
  });
});
