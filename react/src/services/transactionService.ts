import { axiosInstance } from "./axios";

export interface TransactionData {
  uuid: string;
  sender: {
    uuid: string;
    steamName: string;
    accountNumber: string;
    currentBalance: string;
  };
  receiver: {
    uuid: string;
    steamName: string;
    accountNumber: string;
    currentBalance: string;
  };
  currencyCode: string;
  amount: number;
  createdAt: string;
}

class TransactionService {
  /**
   * 계좌 거래내역 조회
   * @param accountUuid 계좌 uuid
   * @returns 거래내역 목록
   */
  static async fetchAccountTransactions(accountUuid: string) {
    const response = await axiosInstance.get(
      `/api/transaction/account/${accountUuid}`
    );
    return response;
  }
}

export default TransactionService;
