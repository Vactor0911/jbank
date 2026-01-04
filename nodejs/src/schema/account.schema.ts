import { z } from "zod";

/**
 * 계좌 조회 스키마
 */
export const searchAccountSchema = z.object({
  accountNumber: z
    .string()
    .regex(/^\d{4}-\d{4}$/, "계좌번호 형식이 올바르지 않습니다."),
});

/**
 * 예금 조회 스키마
 */
export const getAccountBalanceSchema = z.object({
  accountNumber: z
    .string()
    .regex(/^\d{4}-\d{4}$/, "계좌번호 형식이 올바르지 않습니다."),
});
