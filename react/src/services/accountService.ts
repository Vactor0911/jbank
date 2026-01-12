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
    store.set(accountDataAtom, response.data.data.accounts);
  }
}

export default AccountSerice;
