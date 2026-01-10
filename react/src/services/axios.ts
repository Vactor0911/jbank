import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;

interface AuthTokens {
  accessToken: string;
  csrfToken: string;
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private accessToken: string | null = null;
  private csrfToken: string | null = null;
  private isRefreshing = false; // 토큰 갱신 중 여부
  private refreshSubscribers: Array<(token: string) => void> = []; // 토큰 갱신 대기 중인 요청 콜백
  private isInitialized = false; // 초기화 완료 여부

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: SERVER_HOST,
      timeout: 10000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  /**
   * 페이지 로드 시 자동 토큰 갱신
   * @returns 토큰 유효 여부
   */
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return this.isAuthenticated();
    }

    try {
      // refreshToken 쿠키가 있다면 자동으로 토큰 갱신
      const { accessToken, csrfToken } = await this.refreshTokens();
      this.setTokens(accessToken, csrfToken);
      this.isInitialized = true;

      // TODO: console log 제거 필요
      console.log("토큰 초기화 완료!");

      return true;
    } catch {
      // Refresh Token이 없거나 만료된 경우
      // TODO: console log 제거 필요
      console.log("유효한 리프레시 토큰 없음!");
      this.isInitialized = true;
      return false;
    }
  }

  /**
   * Axios 인터셉터 설정
   */
  private setupInterceptors() {
    // 요청 인터셉터
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Access Token 추가
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }

        // CSRF 토큰 추가 (GET, HEAD, OPTIONS 제외)
        if (
          this.csrfToken &&
          config.method &&
          !["get", "head", "options"].includes(config.method.toLowerCase()) &&
          config.headers
        ) {
          config.headers["X-CSRF-Token"] = this.csrfToken;
        }

        // TODO: console log 제거 필요
        console.log(`${config.method?.toUpperCase()} ${config.url}`);

        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // TODO: console log 제거 필요
        console.log(
          `${response.config.method?.toUpperCase()} ${response.config.url}`,
          response.status
        );
        return response;
      },
      async (error: AxiosError) => {
        console.error(
          // TODO: console log 제거 필요
          `${error.config?.method?.toUpperCase()} ${error.config?.url}`,
          error.response?.status
        );

        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // 401 에러 핸들링 (토큰 갱신)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.axiosInstance(originalRequest));
              });
            });
          }

          this.isRefreshing = true;

          try {
            const { accessToken, csrfToken } = await this.refreshTokens();
            this.setTokens(accessToken, csrfToken);
            this.onRefreshed(accessToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              if (
                originalRequest.method &&
                !["get", "head", "options"].includes(
                  originalRequest.method.toLowerCase()
                )
              ) {
                originalRequest.headers["X-CSRF-Token"] = csrfToken;
              }
            }

            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
            this.refreshSubscribers = [];
          }
        }

        // CSRF 토큰 오류 핸들링
        if (
          error.response?.status === 403 &&
          error.response?.data &&
          typeof error.response.data === "object" &&
          "error" in error.response.data &&
          typeof error.response.data.error === "string" &&
          error.response.data.error.toLowerCase().includes("csrf")
        ) {
          // TODO: console log 제거 필요
          console.error("CSRF 토큰 오류! 토큰 갱신 중...");

          try {
            const { accessToken, csrfToken } = await this.refreshTokens();
            this.setTokens(accessToken, csrfToken);

            if (originalRequest.headers) {
              originalRequest.headers["X-CSRF-Token"] = csrfToken;
            }

            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * 토큰 갱신 후 대기 중인 요청들 실행
   * @param token 새로운 Access Token
   */
  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
  }

  /**
   * 토큰 갱신 요청
   * @returns 새로운 인증 토큰
   */
  private async refreshTokens(): Promise<AuthTokens> {
    try {
      const response = await axios.post(
        `${SERVER_HOST}/api/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: this.csrfToken ? { "X-CSRF-Token": this.csrfToken } : {},
        }
      );

      return {
        accessToken: response.data.accessToken,
        csrfToken: response.data.csrfToken,
      };
    } catch (error) {
      // TODO: console log 제거 필요
      console.error("토큰 갱신 실패:", error);
      throw error;
    }
  }

  /**
   * 인증 오류 처리
   */
  private handleAuthError() {
    this.clearTokens();
    window.location.href = "/login";
  }

  // 메모리에 토큰 저장
  public setTokens(accessToken: string, csrfToken: string) {
    this.accessToken = accessToken;
    this.csrfToken = csrfToken;

    // TODO: console log 제거 필요
    console.log("토큰 저장됨!");
  }

  // 메모리에서 토큰 삭제
  public clearTokens() {
    this.accessToken = null;
    this.csrfToken = null;

    // TODO: console log 제거 필요
    console.log("토큰 제거됨!");
  }

  /**
   * 인증 상태 확인
   * @returns 인증 여부
   */
  public isAuthenticated(): boolean {
    return !!this.accessToken && !!this.csrfToken;
  }

  /**
   * 저장된 토큰 반환
   * @returns 인증 토큰 또는 null
   */
  public getTokens(): AuthTokens | null {
    if (this.accessToken && this.csrfToken) {
      return {
        accessToken: this.accessToken,
        csrfToken: this.csrfToken,
      };
    }
    return null;
  }

  /**
   * Axios 인스턴스 반환
   * @returns Axios 인스턴스
   */
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// 싱글톤 ApiClient 인스턴스
const apiClient = new ApiClient();

export const axiosInstance = apiClient.getAxiosInstance();
export default apiClient;
