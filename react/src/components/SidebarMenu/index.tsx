import {
  Avatar,
  Box,
  ButtonBase,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import SampleProfileImage from "../../assets/sample-user-profile.png";
import { useNavigate } from "react-router";
import Footer from "../Footer";
import { useCallback } from "react";
import { Home } from "./Tabs";
import { useAtomValue } from "jotai";
import { navigationValueAtom } from "../../states";
import JbankLogo from "../../assets/logo/jbank.svg?react";
import AuthService from "../../services/authService";

const SidebarMenu = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const navigationValue = useAtomValue(navigationValueAtom);

  // 프로필 정보 클릭 핸들러
  const handleProfileClick = useCallback(() => {
    navigate("/profile");
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
          <Avatar
            src={SampleProfileImage}
            variant="rounded"
            sx={{
              width: "40px",
              height: "40px",
            }}
          />

          {/* 사용자 정보 */}
          <Stack flex={1} overflow="hidden">
            {/* Jbank 사용자 닉네임 */}
            <Typography variant="body1" fontWeight={500} noWrap>
              백터
            </Typography>

            {/* Steam 닉네임 */}
            <Typography variant="caption" color="text.secondary" noWrap>
              76561198012345678
            </Typography>
          </Stack>

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
