import z from "zod";

/**
 * Steam 토큰 교환 스키마
 */
export const steamTokensSchema = z.object({
  code: z.string().min(1, "코드가 필요합니다."),
});
