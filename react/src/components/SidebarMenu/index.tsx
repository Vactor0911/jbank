import {
  Box,
  ButtonBase,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import { useNavigate } from "react-router";
import Footer from "../Footer";
import { useCallback } from "react";
import { Home } from "./Tabs";
import { useAtomValue } from "jotai";
import {
  navigationValueAtom,
  isAuthenticatedAtom,
  userDataAtom,
} from "../../states";
import JbankLogo from "../../assets/logo/jbank.svg?react";
import AuthService from "../../services/authService";
import ImageBox from "../ImageBox";

const SidebarMenu = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const navigationValue = useAtomValue(navigationValueAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const userData = useAtomValue(userDataAtom);

  // 프로필 정보 클릭 핸들러
  const handleProfileClick = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  // 로그인 클릭 핸들러
  const handleLoginClick = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  // 로그아웃 클릭 핸들러
  const handleLogoutClick = useCallback(() => {
    AuthService.logout();
    navigate("/");
  }, [navigate]);

  // 모바일 화면에서는 사이드바 메뉴를 표시하지 않음
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  if (isMobile) {
    return null;
  }

  return (
    <Stack
      width="250px"
      px={2}
      py={3}
      gap={3}
      position="relative"
      zIndex={1000}
    >
      {/* 로고 */}
      <Box
        onClick={() => {
          navigate("/");
        }}
        py={1}
        alignSelf="flex-start"
        sx={{
          cursor: "pointer",
        }}
      >
        <JbankLogo
          css={{
            height: "24px",
          }}
        />
      </Box>

      {/* 프로필 정보 */}
      <ButtonBase
        sx={{
          width: "100%",
          textAlign: "left",
          p: "2px 4px",
          borderRadius: 2,
        }}
        onClick={handleProfileClick}
      >
        <Stack direction="row" width="100%" gap={2} alignItems="center">
          {/* 프로필 이미지 */}
          {isAuthenticated && (
            <ImageBox
              src={userData?.avatar}
              borderRadius="4px"
              sx={{
                width: "40px",
                height: "40px",
              }}
            />
          )}

          {/* 사용자 정보 */}
          {isAuthenticated ? (
            <Stack flex={1} overflow="hidden">
              {/* Jbank 사용자 닉네임 */}
              <Typography variant="body1" fontWeight={500} noWrap>
                {userData?.steamName}
              </Typography>

              {/* Steam 닉네임 */}
              <Typography variant="caption" color="text.secondary" noWrap>
                {userData?.steamId}
              </Typography>
            </Stack>
          ) : (
            <Stack direction="row" height="40px" alignItems="center" flex={1}>
              <Typography variant="body1" fontWeight="bold">
                로그인하세요
              </Typography>
            </Stack>
          )}

          {/* 아이콘 */}
          <NavigateNextOutlinedIcon />
        </Stack>
      </ButtonBase>

      {/* 링크 버튼 컨테이너 */}
      <Stack
        direction="row"
        divider={<Divider flexItem />}
        gap={1}
        bgcolor={theme.palette.secondary.main}
        p={1}
        borderRadius={2}
      >
        {isAuthenticated ? (
          <ButtonBase
            sx={{
              flex: 1,
              borderRadius: 1.5,
            }}
            onClick={handleLogoutClick}
          >
            <Typography variant="body1" textAlign="center" color="text.primary">
              로그아웃
            </Typography>
          </ButtonBase>
        ) : (
          <ButtonBase
            sx={{
              flex: 1,
              borderRadius: 1.5,
            }}
            onClick={handleLoginClick}
          >
            <Typography variant="body1" textAlign="center" color="text.primary">
              로그인
            </Typography>
          </ButtonBase>
        )}

        <ButtonBase
          sx={{
            flex: 1,
            borderRadius: 1.5,
          }}
        >
          <Typography
            variant="body1"
            flex={1}
            textAlign="center"
            color="text.primary"
          >
            의견 보내기
          </Typography>
        </ButtonBase>
      </Stack>

      {/* 링크 버튼 탭 */}
      {navigationValue === 0 && <Home />}

      {/* 푸터 */}
      <Box mt="auto">
        <Footer />
      </Box>
    </Stack>
  );
};

export default SidebarMenu;
