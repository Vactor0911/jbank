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
   * @param page 페이지 번호 (기본값: 1)
   * @param limit 페이지당 항목 수 (기본값: 10)
   * @returns 거래내역 목록
   */
  static async fetchAccountTransactions(
    accountUuid: string,
    page: number = 1,
    limit: number = 10
  ) {
    const response = await axiosInstance.get(
      `/api/transaction/account/${accountUuid}?page=${page}&limit=${limit}`
    );
    return response;
  }
}

export default TransactionService;
