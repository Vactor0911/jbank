import { Box, useMediaQuery, useTheme } from "@mui/material";
import type { ReactNode } from "react";
import { useLocation } from "react-router";
import Header from "./Header";

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper = (props: PageWrapperProps) => {
  const { children } = props;

  const theme = useTheme();
  const location = useLocation();

  // 모바일 환경의 홈 화면에서는 표시하지 않음
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathName = location.pathname;
  if (isMobile && pathName === "/") {
    return null;
  }

  return (
    <Box flex={1} height="100dvh" overflow="auto">
      {/* PC 헤더 */}
      {!isMobile && <Header />}

      {/* 페이지 내용 */}
      {children}
    </Box>
  );
};

export default PageWrapper;
