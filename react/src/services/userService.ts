import { getDefaultStore } from "jotai";
import { axiosInstance } from "./axios";
import { userDataAtom } from "../states";
import { enqueueSnackbar } from "notistack";

const store = getDefaultStore();

export interface UserData {
  uuid: string;
  steamId: string;
  steamName: string;
  avatar: string;
  createdAt: string;
  lastLogin: string;
}

class UserService {
  /**
   * 현재 사용자 정보 조회 및 저장
   */
  static async fetchMe() {
    const response = await axiosInstance.get("/api/user/me");
    const userData = response.data.data.user as UserData;
    store.set(userDataAtom, userData);
    return response.data;
  }

  /**
   * 현재 사용자 스팀 프로필 정보 새로고침 및 저장
   */
  static async refreshMe() {
    try {
      const response = await axiosInstance.patch("/api/user/me/refresh");
      const { steamName, avatar } = response.data.data.user;
      const currentUserData = store.get(userDataAtom);
      if (currentUserData) {
        store.set(userDataAtom, { ...currentUserData, steamName, avatar });
      }

      if (!response.data.success) {
        throw new Error("사용자 정보 새로고침에 실패했습니다.");
      }

      enqueueSnackbar("사용자 정보가 새로고침되었어요.", {
        variant: "success",
      });
      return response.data;
    } catch (error) {
      enqueueSnackbar("정보를 불러오지 못했어요.", { variant: "error" });
      throw error;
    }
  }

  /**
   * 회원탈퇴
   */
  static async deleteAccount() {
    const response = await axiosInstance.delete("/api/user/me");
    return response.data;
  }

  /**
   * 계좌번호로 사용자 정보 조회
   * @param accountNumber 계좌번호
   * @returns 사용자 정보
   */
  static async getUserByAccountNumber(accountNumber: string) {
    const response = await axiosInstance.get(
      `/api/user/account/${accountNumber}`
    );
    return response.data.data.user as UserData;
  }
}

export default UserService;
