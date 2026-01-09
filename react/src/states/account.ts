import { atom } from "jotai";

type AccountData = {
  uuid: string;
  accountNumber: string;
  balance: number;
};

/**
 * 계좌번호 상태
 */
export const accountDataAtom = atom<AccountData | null>(null);
