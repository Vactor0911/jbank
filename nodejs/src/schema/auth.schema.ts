import z from "zod";

/**
 * Steam 토큰 교환 스키마
 */
export const steamTokensSchema = z.object({
  code: z.string("코드는 문자열이어야 합니다.").min(1, "코드가 필요합니다."),
});
