import { atom } from "jotai";

// 송금 데이터
export type TransferData = {
  accountNumber?: string;
  amount?: number;
  password?: string;
};

export const transferDataAtom = atom<TransferData>({});
