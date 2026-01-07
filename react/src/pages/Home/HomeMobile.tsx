import { Avatar, ButtonBase, Stack, Typography } from "@mui/material";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import SampleProfileImage from "../../assets/sample-user-profile.png";
import { useNavigate } from "react-router";
import { useCallback } from "react";
import AdsSection from "../../components/sections/AdsSection";
import AccountSection from "../../components/sections/AccountSection";
import LinkedSectionContainer from "../../components/LinkedSectionContainer";

const HomeMobile = () => {
  const navigate = useNavigate();

  // 프로필 정보 클릭 핸들러
  const handleProfileClick = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  return (
    <Stack width="100%" gap={3}>
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

      {/* 송금하기 */}
      <LinkedSectionContainer label="송금하기" linkTo="/transfer" />

      {/* 계좌 */}
      <AccountSection />

      {/* 광고 */}
      <AdsSection />
    </Stack>
  );
};

export default HomeMobile;
