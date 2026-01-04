import z from "zod";

/**
 * 거래 내역 조회 스키마
 */
export const getTransactionsSchema = z.object({
  accountNumber: z
    .string()
    .regex(/^\d{4}-\d{4}$/, "계좌번호 형식이 올바르지 않습니다."),
});
