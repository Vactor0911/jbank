import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./utils/theme";
import { RouterProvider } from "react-router";
import { router } from "./router";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
