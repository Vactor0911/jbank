import { useAtom } from "jotai";
import { accountDataAtom } from "../states/account";
import { useCallback } from "react";

/**
 * 계좌 관련 훅
 */
export const useAccount = () => {
  const [accountData, setAccountData] = useAtom(accountDataAtom);

  /**
   * 계좌 상세 정보 조회
   */
  const fetchAccountData = useCallback(() => {
    // TODO: API 호출하여 계좌 상세 정보 조회
    setAccountData({
      uuid: "123e4567-e89b-12d3-a456-426614174000",
      accountNumber: "1234-5678",
      balance: 1000000,
    });
  }, [setAccountData]);

  return { accountData, fetchAccountData };
};
