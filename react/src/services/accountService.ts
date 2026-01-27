import { getDefaultStore } from "jotai";
import { axiosInstance } from "./axios";
import { accountDataAtom } from "../states/account";

export interface AccountData {
  uuid: string;
  accountNumber: string;
  status: string;
  credit: string;
  createdAt: Date;
}

const store = getDefaultStore();

class AccountService {
  /**
   * 계좌 목록 조회
   * @returns 계좌 목록
   */
  static async fetchAccounts() {
    const response = await axiosInstance.get("/api/v1/account/");
    store.set(accountDataAtom, response.data.data.accounts as AccountData[]);
    return response;
  }

  /**
   * 계좌 상세 조회
   * @param accountUuid 계좌 uuid
   * @returns 계좌 정보
   */
  static async fetchAccount(accountUuid: string) {
    const response = await axiosInstance.get(`/api/v1/account/${accountUuid}`);

    // 계좌 정보 업데이트
    const accounts = store.get(accountDataAtom);
    const newAccounts = accounts.map((account) => {
      if (account.uuid === accountUuid) {
        return response.data.data.account as AccountData;
      }
      return account;
    });
    store.set(accountDataAtom, newAccounts);

    // 응답 반환
    return response;
  }

  /**
   * 계좌 생성
   * @param password 계좌 비밀번호
   */
  static async createAccount(password: string) {
    const response = await axiosInstance.post("/api/v1/account/", {
      password: password,
    });
    return response;
  }

  /**
   * 최근 거래 계좌 조회
   * @param accountNumber 계좌 번호
   * @returns 최근 거래 계좌 목록
   */
  static async fetchRecentAccountNumbers(accountNumber: string) {
    const response = await axiosInstance.get(
      `/api/v1/account/${accountNumber}/recent`
    );

    if (!response.data.success) {
      throw new Error("최근 거래 계좌 조회에 실패했습니다.");
    }

    const accountNumbers = response.data.data.recentAccounts as {
      accountNumber: string;
      userName: string | null;
    }[];
    return accountNumbers;
  }
}

export default AccountService;
