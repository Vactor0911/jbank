import { getDefaultStore } from "jotai";
import { axiosInstance } from "./axios";
import { userDataAtom } from "../states";

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
    console.log("Fetching user data...");

    const response = await axiosInstance.get("/api/user/me");
    const userData = response.data.data.user as UserData;
    store.set(userDataAtom, userData);
  }

  /**
   * 현재 사용자 스팀 프로필 정보 새로고침 및 저장
   */
  static async refreshMe() {
    console.log("Refreshing user data...");

    const response = await axiosInstance.patch("/api/user/me/refresh");
    const { steamName, avatar } = response.data.data.user;
    const currentUserData = store.get(userDataAtom);
    if (currentUserData) {
      store.set(userDataAtom, { ...currentUserData, steamName, avatar });
    }
  }
}

export default UserService;
