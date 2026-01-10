import axios from "axios";
import crypto from "crypto";
import { XMLParser } from "fast-xml-parser";

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

/**
 * Steam 프로필에서 사용자 이름 추출
 * @param steamId 스팀 고유번호 (SteamID64)
 * @returns 스팀 사용자 이름
 */
export const fetchSteamUserName = async (steamId: string): Promise<string> => {
  try {
    const url = `https://steamcommunity.com/profiles/${steamId}?xml=1`;
    const response = await axios.get(url);

    const xmlText = response.data;

    // XMLParser를 사용하여 XML 파싱
    const parser = new XMLParser({
      ignoreAttributes: false,
      trimValues: true,
    });
    const parsed = parser.parse(xmlText);

    // 사용자 이름 추출
    const steamUserName = parsed?.profile?.steamID;
    if (!steamUserName) {
      // 사용자 이름이 없으면 스팀 고유번호 그대로 반환
      return steamId;
    }

    // 공백 제거 후 반환
    return steamUserName.trim();
  } catch (error) {
    // 오류 발생 시 스팀 고유번호 그대로 반환
    return steamId;
  }
};
