import {
  Avatar,
  ButtonBase,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import SampleProfileImage from "../../assets/sample-user-profile.png";
import { useLocation, useNavigate } from "react-router";
import LinkButtonContainer from "./LinkButtonContainer";
import AccountLinkButtonContainer from "./AccountLinkButtonContainer";
import { useCallback } from "react";
import AdsContainer from "./AdsContainer";
import Footer from "../Footer";

const MobileMenu = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // 프로필 정보 클릭 핸들러
  const handleProfileClick = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  // 모바일 화면에서만 표시
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  if (!isMobile || location.pathname !== "/") {
    return null;
  }

  return (
    <Stack width="100%" flex={1} px={2} pb={3} gap={3}>
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
            <Typography
              variant="body1"
              fontWeight={500}
              noWrap
              textOverflow="ellipsis"
            >
              백터
            </Typography>

            {/* Steam 닉네임 */}
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              textOverflow="ellipsis"
            >
              백터 (Vactor0911)
            </Typography>
          </Stack>

          {/* 아이콘 */}
          <NavigateNextOutlinedIcon />
        </Stack>
      </ButtonBase>

      {/* 링크 버튼 컨테이너 */}
      {/* 송금하기 */}
      <LinkButtonContainer label="송금하기" linkTo="/transfer" />

      {/* 계좌 */}
      <AccountLinkButtonContainer />

      {/* Ads (광고) */}
      <AdsContainer />

      {/* 푸터 */}
      <Footer />
    </Stack>
  );
};

export default MobileMenu;
