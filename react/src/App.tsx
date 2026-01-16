import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./utils/theme";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { useCallback, useEffect } from "react";
import UserService from "./services/userService";
import AccountService from "./services/accountService";
import { enqueueSnackbar } from "notistack";
import StyledSnackbarProvider from "./components/StyledSnackbarProvider";

const App = () => {
  // 사용자 정보 불러오기
  const fetchData = useCallback(async () => {
    await UserService.fetchMe();
    await AccountService.fetchAccounts();
  }, []);

  useEffect(() => {
    fetchData();
    enqueueSnackbar("환영합니다!", { variant: "success" });
  }, [fetchData]);

  return (
    <ThemeProvider theme={theme} defaultMode="system">
      <CssBaseline enableColorScheme />

      <StyledSnackbarProvider>
        <RouterProvider router={router} />
      </StyledSnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
