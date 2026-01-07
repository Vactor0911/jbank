/**
 * 숫자를 한글식 숫자 표기법으로 변환하는 함수
 * @param number 변환할 숫자
 * @returns 한글식 숫자 표기법으로 변환된 문자열
 */
export const formatNumberKor = (number: number): string => {
  // 한글식 숫자 표기법으로 변환
  const eok = number / 100000000;
  const man = (number % 100000000) / 10000;
  const cheon = number % 10000;

  let result = "";
  // 억
  if (eok >= 1) {
    result += `${Math.floor(eok)}억 `;
  }

  // 만
  if (man >= 1) {
    result += `${Math.floor(man)}만 `;
  }

  // 천
  if (cheon >= 1) {
    result += `${Math.floor(cheon)} `;
  }

  // 공백 제거 후 반환
  return result.trim();
};

/**
 * 계좌번호 유효성 검사 함수
 * @param accountNumber 검사할 계좌번호
 * @returns 계좌번호 유효성 여부
 */
export const isAccountNumberValid = (accountNumber: string): boolean => {
  return /^\d{4}-\d{4}$/.test(accountNumber);
};
