import apiClient, { axiosInstance } from "./axios";

const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;

export interface User {
  id: number;
  uuid: string;
  steamId: string;
  userName: string;
  avatar: string;
}

export interface LoginResponse {
  accessToken: string;
  csrfToken: string;
}

class AuthService {
  /**
   * Steam 로그인 페이지 리다이렉트
   */
  static loginWithSteam() {
    window.location.href = `${SERVER_HOST}/api/auth/steam`;
  }

  /**
   * Steam 로그인 콜백 핸들링
   * @returns 인증 성공 여부
   */
  static async handleLoginSuccess(code: string) {
    // 서버에서 토큰 교환
    const response = await axiosInstance.get<LoginResponse>(
      `/api/auth/steam/tokens/${code}`
    );

    const accessToken = response.data.accessToken;
    const csrfToken = response.data.csrfToken;

    if (accessToken && csrfToken) {
      apiClient.setAccessToken(accessToken);
      apiClient.setCsrfToken(csrfToken);
      return true;
    }

    return false;
  }

  /**
   * 현재 사용자 정보 조회
   * @returns 사용자 정보
   */
  static async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get("/api/auth/me");
    return response.data.user as User;
  }

  /**
   * 로그아웃 핸들링
   */
  static async logout() {
    try {
      await axiosInstance.post("/api/auth/logout");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    } finally {
      apiClient.clearTokens();
    }
  }

  /**
   * 인증 상태 확인
   * @returns 인증 여부
   */
  isAuthenticated() {
    return apiClient.isAuthenticated();
  }
}

export default AuthService;
