import { createBrowserRouter, redirect } from "react-router-dom";

import apiClient from "../services/axios";
import {
  AccountDetail,
  AccountNew,
  Home,
  Login,
  NotFoundError,
  Notice,
  Profile,
  TransactionDetail,
  Transfer,
} from "../pages";
import RootLayout from "./RootLayout";
import AccountService from "../services/accountService";

/**
 * 인증이 필요한 경로 접근 시 인증 상태 확인
 * @returns 리다이렉트 응답 또는 null
 */
const requireAuth = async () => {
  const isAuthenticated = await apiClient.initialize();
  if (!isAuthenticated) {
    return redirect("/login");
  }

  return null;
};

/**
 * 이미 인증된 사용자 접근 차단
 * @returns 리다이렉트 응답 또는 null
 */
const checkAuth = async () => {
  await apiClient.initialize();
  if (apiClient.isAuthenticated()) {
    return redirect("/");
  }

  return null;
};

const checkAccounts = async () => {
  const authRedirect = await requireAuth();
  if (authRedirect) {
    // 인증 실패 시 리다이렉트
    return authRedirect;
  }

  const response = await AccountService.fetchAccounts();
  const accounts = response.data?.data?.accounts;
  if (!response.data?.success || !accounts || accounts.length <= 0) {
    return redirect("/account/new");
  }

  return null;
};

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "account/new",
          element: <AccountNew />,
          loader: requireAuth,
        },
        {
          path: "account/:accountUuid",
          element: <AccountDetail />,
          loader: requireAuth,
        },
        {
          path: "transaction/:transactionUuid",
          element: <TransactionDetail />,
          loader: requireAuth,
        },
        {
          path: "account",
          element: <NotFoundError />,
          // 인증 불필요 (에러 페이지)
        },
        {
          path: "notice",
          element: <Notice />,
        },
        {
          path: "transfer",
          element: <Transfer />,
          loader: checkAccounts,
        },
        {
          path: "login",
          element: <Login />,
          loader: checkAuth, // 이미 로그인된 경우 홈으로
        },
        {
          path: "profile",
          element: <Profile />,
          loader: requireAuth,
        },
        {
          path: "*",
          element: <NotFoundError />,
          // 인증 불필요 (에러 페이지)
        },
      ],
    },
  ],
  {
    basename: "/jbank",
  },
);
