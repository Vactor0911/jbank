import z from "zod";

/**
 * 예금주 조회 스키마
 */
export const getAccountHolderSchema = z.object({
  accountNumber: z
    .string()
    .regex(/^\d{4}-\d{4}$/, "유효한 계좌번호 형식이 아닙니다."),
});
