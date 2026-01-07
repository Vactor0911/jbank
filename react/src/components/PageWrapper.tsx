import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import { useCallback, useRef, type ReactNode } from "react";
import { useLocation } from "react-router";
import Header from "./Header";
import { useSetAtom } from "jotai";
import { isScrollOnTopAtom } from "../states";

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper = (props: PageWrapperProps) => {
  const { children } = props;

  const theme = useTheme();
  const location = useLocation();

  const rootRef = useRef<HTMLDivElement>(null);
  const setIsScrollOnTop = useSetAtom(isScrollOnTopAtom);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    const isScrollOnTop = rootRef.current?.scrollTop === 0;
    setIsScrollOnTop(isScrollOnTop);
  }, [setIsScrollOnTop]);

  // 모바일 환경의 홈 화면에서는 표시하지 않음
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathName = location.pathname;
  if (isMobile && pathName === "/") {
    return null;
  }

  return (
    <Box
      ref={rootRef}
      flex={1}
      width="100%"
      height="calc(100dvh)"
      onScroll={handleScroll}
    >
      {/* PC 헤더 */}
      {!isMobile && <Header />}

      {/* 페이지 내용 */}
      <Container
        maxWidth="xl"
        sx={{
          height: "calc(100% - 64px)",
          overflow: "auto",
          pb: "64px",
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default PageWrapper;
