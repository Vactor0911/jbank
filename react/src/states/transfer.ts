import { atom } from "jotai";

/**
 * 송금 데이터 타입
 */
export type TransferData = {
  senderAccountNumber?: string;
  receiverAccountNumber?: string;
  receiverAccountHolder?: string;
  amount?: number;
  inputVerified?: boolean;
  password?: string;
};

/**
 * 송금 단계 상태
 */
export const transferStepAtom = atom<number>(0);

/**
 * 송금 데이터 상태
 */
export const transferDataAtom = atom<TransferData>({});

/**
 * 송금 결과 상태
 */
export const isTransferSuccessAtom = atom<boolean | null>(null);
