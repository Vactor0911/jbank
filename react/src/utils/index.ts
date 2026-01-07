export const formatNumberKor = (num: number): string => {
  // 한글식 숫자 표기법으로 변환
  const eok = num / 100000000;
  const man = (num % 100000000) / 10000;
  const cheon = num % 10000;

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
