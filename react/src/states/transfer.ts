import { atom } from "jotai";

// 송금 데이터
export type TransferData = {
  fromAccountNumber?: string;
  toAccountNumber?: string;
  amount?: number;
  inputVerified?: boolean;
  password?: string;
};

// 송금 데이터 상태
export const transferDataAtom = atom<TransferData>({});

// 송금중 상태
export const isTransferLoadingAtom = atom<boolean>(false);
