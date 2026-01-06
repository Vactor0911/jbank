import { Container, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useLocation } from "react-router";
import Footer from "../Footer";
import { useAtomValue } from "jotai";
import { navigationValueAtom } from "../../states";
import { Home } from "./Tabs";

const MobileMenu = () => {
  const theme = useTheme();
  const location = useLocation();

  const navigationValue = useAtomValue(navigationValueAtom);

  // 모바일 화면에서만 표시
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  if (!isMobile || location.pathname !== "/") {
    return null;
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        height: "100%",
        mb: 5,
      }}
    >
      <Stack width="100%" gap={3}>
        {navigationValue === 0 && <Home />}

        {/* 푸터 */}
        <Footer />
      </Stack>
    </Container>
  );
};

export default MobileMenu;
