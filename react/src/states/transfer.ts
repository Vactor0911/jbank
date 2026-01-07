import { atom } from "jotai";

// 송금 데이터
export type TransferData = {
  accountNumber?: string;
  amount?: number;
  inputVerified?: boolean;
  password?: string;
};

export const transferDataAtom = atom<TransferData>({});
