import { atom } from "jotai";

/**
 * 네비게이션 바 선택 값 상태
 */
export const navigationValueAtom = atom(0);

/**
 * 스크롤 최상단 여부 상태
 */
export const isScrollOnTopAtom = atom(true);