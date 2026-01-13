import z from "zod";

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
    .regex(/^\d{4}-\d{4}$/, "유효한 계좌번호 형식이 아닙니다."),
  receiverAccountNumber: z
    .string("계좌번호는 문자열이어야 합니다.")
    .regex(/^\d{4}-\d{4}$/, "유효한 계좌번호 형식이 아닙니다."),
  amount: z
    .number("송금액은 숫자이어야 합니다.")
    .positive("송금액이 올바르지 않습니다.")
    .max(100000000, "송금액은 1억을 초과할 수 없습니다."),
  password: z
    .string("비밀번호는 문자열이어야 합니다.")
    .regex(/^\d{4}$/, "비밀번호는 숫자 4자리이어야 합니다."),
});
