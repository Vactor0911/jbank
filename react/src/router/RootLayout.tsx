import { Stack } from "@mui/material";
import Header from "../components/Header";
import PageWrapper from "../components/PageWrapper";
import { Outlet } from "react-router-dom";
import SidebarMenu from "../components/SidebarMenu";
import NavigationBar from "../components/Navigation";

const RootLayout = () => {
  return (
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
        <Outlet />
      </PageWrapper>

      {/* PC용 사이드 바 메뉴 */}
      <SidebarMenu />

      {/* 네비게이션 바 */}
      <NavigationBar />
    </Stack>
  );
};

export default RootLayout;
