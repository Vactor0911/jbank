import z from "zod";

export const findTransactionSchema = z.object({
  transactionUuid: z.uuid("UUID 형식이 올바르지 않습니다."),
});
