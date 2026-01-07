import { CssBaseline, Stack, ThemeProvider } from "@mui/material";
import { theme } from "./utils/theme";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home, NotFoundError, Notice, Transfer } from "./pages";
import NavigationBar from "./components/Navigation";
import SidebarMenu from "./components/SidebarMenu";
import Header from "./components/Header";
import PageWrapper from "./components/PageWrapper";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />

      <BrowserRouter>
        <Stack
          width="100vw"
          height="100dvh"
          direction={{
            xs: "column",
            md: "row-reverse",
          }}
        >
          {/* 헤더 */}
          <Header />

          <PageWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/notice" element={<Notice />} />
              <Route path="/transfer" element={<Transfer />} />
              <Route path="*" element={<NotFoundError />} />
            </Routes>
          </PageWrapper>

          {/* PC용 사이드 바 메뉴 */}
          <SidebarMenu />

          {/* 네비게이션 바 */}
          <NavigationBar />
        </Stack>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
