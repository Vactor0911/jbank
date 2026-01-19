import crypto from "crypto";

/**
 * 문자열 시간을 정수형 시간(초단위)으로 변환하는 함수
 * @param time 문자열 시간
 * @return 정수형 시간 (초단위)
 */
export const parseTimeToSeconds = (time: string): number => {
  // 시간 문자열 파싱
  const timeRegex = /^(\d+)([smhd])$/;
  const match = time.match(timeRegex);
  if (!match) {
    throw new Error("Invalid time format");
  }

  // 값과 단위 추출
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 3600;
    case "d":
      return value * 86400;
    default:
      throw new Error("Invalid time unit");
  }
};

/**
 * 안전한 난수를 생성하는 함수
 * @param max 최대값
 * @returns 0 이상 max 미만의 정수
 */
const getSecureRandomInt = (max: number): number => {
  const randomBytes = crypto.randomBytes(4);
  const randomInt = randomBytes.readUInt32BE(0);
  return randomInt % max;
};

/**
 * 계좌 번호를 생성하는 함수
 * @returns XXXX-XXXX 형식의 계좌번호 (예: "1234-5678")
 */
export const generateAccountNumber = (): string => {
  const part1 = getSecureRandomInt(10000).toString().padStart(4, "0");

  const part2 = getSecureRandomInt(10000).toString().padStart(4, "0");

  return `${part1}-${part2}`;
};
