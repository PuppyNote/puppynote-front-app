/**
 * Date 관련 유틸리티 함수 모음
 */

/**
 * Date 객체를 YYYY-MM-DD 형식의 로컬 날짜 문자열로 변환합니다.
 * toISOString()의 UTC 변환 문제를 방지합니다.
 */
export const formatToLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Date 객체를 YYYY-MM 형식의 로컬 연월 문자열로 변환합니다.
 */
export const formatToLocalYearMonth = (year: number, month: number): string => {
  return `${year}-${String(month).padStart(2, '0')}`;
};

/**
 * 두 날짜 사이의 일수 차이를 계산합니다. (targetDate - baseDate)
 * targetDate가 baseDate보다 미래면 양수, 과거면 음수를 반환합니다.
 */
export const calculateDaysDifference = (targetDateStr: string, baseDate: Date = new Date()): number => {
  const target = new Date(targetDateStr);
  // 시간을 00:00:00으로 설정하여 날짜 차이만 계산
  target.setHours(0, 0, 0, 0);
  
  const base = new Date(baseDate);
  base.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - base.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
