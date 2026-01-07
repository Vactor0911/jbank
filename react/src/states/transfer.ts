import { atom } from "jotai";

// 송금 데이터
export type TransferData = {
  fromAccountNumber?: string;
  toAccountNumber?: string;
  amount?: number;
  inputVerified?: boolean;
  password?: string;
};

// 송금 단계
export const TransferStep = {
  AccountNumber: 0,
  Amount: 1,
  VerifyInput: 2,
  Password: 3,
  Loading: 4,
};
export type TransferStep = (typeof TransferStep)[keyof typeof TransferStep];

// 송금 데이터 상태
export const transferDataAtom = atom<TransferData>({});
