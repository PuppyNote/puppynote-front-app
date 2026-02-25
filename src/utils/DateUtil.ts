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
