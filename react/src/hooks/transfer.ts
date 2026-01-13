import { useSetAtom } from "jotai";
import { useCallback } from "react";
import {
  isTransferSuccessAtom,
  transferDataAtom,
  transferStepAtom,
} from "../states/transfer";

/**
 * 송금 관련 훅
 */
export const useTransfer = () => {
  const setTransferData = useSetAtom(transferDataAtom);
  const setTransferStep = useSetAtom(transferStepAtom);
  const setIsTransferSuccess = useSetAtom(isTransferSuccessAtom);

  /**
   * 송금 상태 초기화
   */
  const resetTransferData = useCallback(() => {
    setTransferData({});
    setTransferStep(0);
    setIsTransferSuccess(null);
  }, [setTransferStep, setIsTransferSuccess, setTransferData]);

  return { resetTransferData };
};
