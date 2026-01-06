import { Box, Container, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useLocation } from "react-router";
import Footer from "../Footer";
import { useAtomValue, useSetAtom } from "jotai";
import { isScrollOnTopAtom, navigationValueAtom } from "../../states";
import { Home, WIP } from "./Tabs";
import { useRef } from "react";

const MobileMenu = () => {
  const theme = useTheme();
  const location = useLocation();

  const navigationValue = useAtomValue(navigationValueAtom);
  const rootRef = useRef<HTMLDivElement>(null);
  const setIsScrollOnTop = useSetAtom(isScrollOnTopAtom);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const isScrollOnTop = rootRef.current?.scrollTop === 0;
    setIsScrollOnTop(isScrollOnTop);
  };

  // 모바일 화면에서만 표시
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  if (!isMobile || location.pathname !== "/") {
    return null;
  }

  return (
    <Box
      ref={rootRef}
      height="calc(100dvh - 128px)"
      overflow="auto"
      onScroll={handleScroll}
    >
      <Container
        maxWidth="md"
        sx={{
          mb: 5,
        }}
      >
        <Stack width="100%" height="100%" gap={3}>
          {navigationValue === 0 && <Home />}
          {navigationValue !== 0 && <WIP />}

          {/* 푸터 */}
          <Footer />
        </Stack>
      </Container>
    </Box>
  );
};

export default MobileMenu;
