import z from "zod";

/**
 * 사용자 생성 스키마
 */
export const createUserSchema = z.object({
  steamId: z
    .string()
    .min(1, "Steam ID가 필요합니다.")
    .max(17, "Steam ID는 17자 이하이어야 합니다."),
  password: z.string().regex(/^\d{4}$/, "비밀번호는 4자리 숫자이어야 합니다."),
});

/**
 * 사용자 검색 스키마
 */
export const searchUserSchema = z.object({
  keyword: z.string().min(1, "검색어가 필요합니다."),
});

/**
 * 사용자 사용자명 재설정 스키마
 */
export const refreshUserNameSchema = z.object({
  steamId: z
    .string()
    .min(1, "Steam ID가 필요합니다.")
    .max(17, "Steam ID는 17자 이하이어야 합니다."),
});
