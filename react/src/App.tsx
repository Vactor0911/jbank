import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./utils/theme";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { useCallback, useEffect } from "react";
import UserService from "./services/userService";

const App = () => {
  // 사용자 정보 불러오기
  const fetchUserData = useCallback(async () => {
    UserService.fetchMe();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
