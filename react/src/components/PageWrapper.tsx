import { Box, Container } from "@mui/material";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { useSetAtom } from "jotai";
import { isScrollOnTopAtom } from "../states";
import { useIsMobile } from "../hooks";
import Footer from "./Footer";
import { useLocation } from "react-router";

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper = (props: PageWrapperProps) => {
  const { children } = props;

  const location = useLocation();

  const rootRef = useRef<HTMLDivElement>(null);
  const setIsScrollOnTop = useSetAtom(isScrollOnTopAtom);
  const isMobile = useIsMobile();

  // 페이지 전환 시 스크롤 위치 초기화
  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setIsScrollOnTop(true);
    }
  }, [location.pathname, setIsScrollOnTop]);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    const isScrollOnTop = rootRef.current?.scrollTop === 0;
    setIsScrollOnTop(isScrollOnTop);
  }, [setIsScrollOnTop]);

  return (
    <Box
      ref={rootRef}
      width={{
        xs: "100vw",
        md: "calc(100vw - 314px)",
      }}
      height={{
        xs: "calc(100dvh - 128px)",
        md: "calc(100dvh - 64px)",
      }}
      overflow="auto"
      onScroll={handleScroll}
      mt="64px"
      mb={{
        xs: "64px",
        md: 0,
      }}
      pb="64px"
    >
      {/* 페이지 내용 */}
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: "100%",
        }}
      >
        {children}

        {/* 모바일용 푸터 */}
        {isMobile && (
          <Box mt={5}>
            <Footer />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PageWrapper;
