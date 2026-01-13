import z from "zod";

/**
 * 예금주 조회 스키마
 */
export const getAccountHolderSchema = z.object({
  accountNumber: z
    .string("계좌번호는 문자열이어야 합니다.")
    .regex(/^\d{4}-\d{4}$/, "유효한 계좌번호 형식이 아닙니다."),
});
