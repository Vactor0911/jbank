import { Box, CssBaseline, Stack, ThemeProvider } from "@mui/material";
import { theme } from "./utils/theme";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages";
import Navigation from "./components/Navigation";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Stack
        width="100vw"
        height="100vh"
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

          {/* 네비게이션 바 */}
          <Navigation />
        </BrowserRouter>
      </Stack>
    </ThemeProvider>
  );
};

export default App;
