import { Box, Container } from "@mui/material";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  isScrollOnTopAtom,
  navigationValueAtom,
  scrollContainerRefAtom,
} from "../states";
import { useIsMobile } from "../hooks";
import Footer from "./Footer";
import { useLocation } from "react-router";

// 푸터를 숨길 경로 목록
const HIDE_FOOTER_PATHS = ["/transfer", "/login", "/account", "/transaction"];

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper = (props: PageWrapperProps) => {
  const { children } = props;

  const location = useLocation();

  const rootRef = useRef<HTMLDivElement>(null);
  const setIsScrollOnTop = useSetAtom(isScrollOnTopAtom);
  const isMobile = useIsMobile();
  const setScrollContainerRef = useSetAtom(scrollContainerRefAtom);
  const navigationValue = useAtomValue(navigationValueAtom);

  // 스크롤 컨테이너 참조 설정
  useEffect(() => {
    setScrollContainerRef(rootRef.current);
  }, [setScrollContainerRef]);

  // 페이지 전환 시 스크롤 위치 초기화
  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setIsScrollOnTop(true);
    }
  }, [location.pathname, navigationValue, setIsScrollOnTop]);

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
          <Box
            display={
              HIDE_FOOTER_PATHS.some((path) =>
                location.pathname.startsWith(path)
              )
                ? "none"
                : "block"
            }
            mt={5}
          >
            <Footer />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PageWrapper;
