import {
  CssBaseline,
  Stack,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { theme } from "./utils/theme";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages";
import NavigationBar from "./components/Navigation";
import SidebarMenu from "./components/SidebarMenu";
import MobileMenu from "./components/MobileMenu";
import Header from "./components/Header";

const App = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
          {/* 모바일 헤더 */}
          {isMobile && <Header />}

          <Routes>
            <Route path="*" element={<Home />} />
          </Routes>

          {/* 모바일용 메뉴 */}
          <MobileMenu />

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
