import { useSetAtom } from "jotai";
import { useCallback } from "react";
import {
  isTransferLoadingAtom,
  isTransferSuccessAtom,
  transferDataAtom,
} from "../states/transfer";

/**
 * 송금 관련 훅
 */
export const useTransfer = () => {
  const setTransferData = useSetAtom(transferDataAtom);
  const setIsTransferLoading = useSetAtom(isTransferLoadingAtom);
  const setIsTransferSuccess = useSetAtom(isTransferSuccessAtom);

  /**
   * 송금 상태 초기화
   */
  const resetTransferData = useCallback(() => {
    setTransferData({ fromAccountNumber: "1234-5678" });
    setIsTransferLoading(false);
    setIsTransferSuccess(null);
  }, [setIsTransferLoading, setIsTransferSuccess, setTransferData]);

  return { resetTransferData };
};
