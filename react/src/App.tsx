import { Box, CssBaseline, Stack, ThemeProvider } from "@mui/material";
import { theme } from "./utils/theme";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages";
import NavigationBar from "./components/Navigation";
import SidebarMenu from "./components/SidebarMenu";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Stack
        width="100vw"
        height="100dvh"
        direction={{
          xs: "column",
          md: "row-reverse",
        }}
      >
        <CssBaseline enableColorScheme />

        <BrowserRouter>
          <Box flex={1}>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </Box>

          {/* PC용 사이드 바 메뉴 */}
          <SidebarMenu />

          {/* 네비게이션 바 */}
          <NavigationBar />
        </BrowserRouter>
      </Stack>
    </ThemeProvider>
  );
};

export default App;
