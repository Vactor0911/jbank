import z from "zod";

/**
 * 계좌별 트랜잭션 조회 스키마
 */
export const getAccountTransactionsParamsSchema = z.object({
  accountUuid: z.uuid("유효한 uuid 형식이 아닙니다."),
});
export const getAccountTransactionsQuerySchema = z.object({
  page: z.coerce.number().min(1, "페이지는 1 이상이어야 합니다.").optional(),
  limit: z.coerce
    .number()
    .min(1, "한 페이지당 항목 수는 1 이상이어야 합니다.")
    .max(100, "한 페이지당 항목 수는 100 이하이어야 합니다.")
    .optional(),
});

/**
 * 트랜잭션 조회 스키마
 */
export const getTransactionSchema = z.object({
  transactionUuid: z.uuid("유효한 uuid 형식이 아닙니다."),
});

/**
 * 송금 트랜잭션 생성 스키마
 */
export const createTransferTransactionSchema = z.object({
  senderAccountNumber: z
    .string("계좌번호는 문자열이어야 합니다.")
    .regex(/^(?!0000-0000$)\d{4}-\d{4}$/, "유효한 계좌번호 형식이 아닙니다."),
  receiverAccountNumber: z
    .string("계좌번호는 문자열이어야 합니다.")
    .regex(/^(?!0000-0000$)\d{4}-\d{4}$/, "유효한 계좌번호 형식이 아닙니다."),
  amount: z
    .number("송금액은 숫자이어야 합니다.")
    .positive("송금액이 올바르지 않습니다.")
    .max(100000000, "송금액은 1억을 초과할 수 없습니다."),
  password: z
    .string("비밀번호는 문자열이어야 합니다.")
    .regex(/^\d{4}$/, "비밀번호는 숫자 4자리이어야 합니다."),
});

export const createBankTransactionSchema = z.object({
  userSteamId: z
    .string("Steam 고유번호는 문자열이어야 합니다.")
    .min(1, "Steam 고유번호는 비어 있을 수 없습니다."),
  amount: z
    .number("송금액은 숫자이어야 합니다.")
    .positive("송금액이 올바르지 않습니다."),
});
