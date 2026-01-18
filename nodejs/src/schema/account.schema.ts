import z from "zod";

/**
 * 계좌 생성 스키마
 */
export const createAccountSchema = z.object({
  password: z
    .string("비밀번호는 문자열이어야 합니다.")
    .regex(/^\d{4}$/, "비밀번호는 숫자 4자리이어야 합니다."),
});

/**
 * 계좌 조회 스키마
 */
export const getAccountSchema = z.object({
  accountUuid: z.uuid("유효한 uuid 형식이 아닙니다."),
});

/**
 * 최근 거래 계좌 조회 스키마
 */
export const getRecentAccountsSchema = z.object({
  accountNumber: z
    .string("계좌번호는 문자열이어야 합니다.")
    .regex(/^\d{4}-\d{4}$/, "유효한 계좌번호 형식이 아닙니다."),
});
