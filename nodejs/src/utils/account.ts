import crypto from "crypto";

/**
 * 계좌 번호를 생성하는 함수
 * @param uuid 사용자 uuid
 * @returns XXXX-XXXX 형식의 계좌번호 (예: "1234-5678")
 */
export const generateAccountNumber = (uuid: string): string => {
  // UUID 형식 검증 (8-4-4-4-12 형식)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(uuid)) {
    throw new Error("유효한 UUID 형식이 아닙니다.");
  }

  // SHA-256 해시를 사용하여 UUID를 해시화
  const hash = crypto.createHash("sha256").update(uuid).digest("hex");

  // 해시값의 처음 8자리를 16진수로 가져와서 10진수로 변환
  const hashNumber = parseInt(hash.substring(0, 8), 16);

  // 8자리 숫자로 변환 (00000000 ~ 99999999)
  const accountDigits = (hashNumber % 100000000).toString().padStart(8, "0");

  // 4자리-4자리 형식으로 포맷팅
  const part1 = accountDigits.substring(0, 4);
  const part2 = accountDigits.substring(4, 8);

  // 생성된 계좌번호 반환
  return `${part1}-${part2}`;
};
