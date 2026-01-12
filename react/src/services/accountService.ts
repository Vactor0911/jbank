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

class AccountSerice {
  /**
   * 계좌 목록 조회
   * @returns 계좌 목록
   */
  static async fetchAccounts() {
    const response = await axiosInstance.get("/api/account/");
    console.log("Fetch account:", response.data.data.accounts[0]);
    store.set(accountDataAtom, response.data.data.accounts as AccountData[]);
  }

  /**
   * 계좌 생성
   * @param password 계좌 비밀번호
   */
  static async createAccount(password: string) {
    const response = await axiosInstance.post("/api/account/", {
      password: password,
    });
    return response;
  }
}

export default AccountSerice;
