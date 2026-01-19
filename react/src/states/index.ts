import { atom } from "jotai";
import type { UserData } from "../services/userService";

/**
 * 네비게이션 바 선택 값 상태
 */
export const navigationValueAtom = atom(0);

/**
 * 스크롤 최상단 여부 상태
 */
export const isScrollOnTopAtom = atom(true);

/**
 * 스크롤 컨테이너 참조 상태
 */
export const scrollContainerRefAtom = atom<HTMLElement | null>(null);

/**
 * 인증 상태
 */
export const isAuthenticatedAtom = atom(false);

/**
 * 사용자 정보 상태
 */
export const userDataAtom = atom<UserData | null>(null);