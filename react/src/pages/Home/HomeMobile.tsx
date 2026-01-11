import { Avatar, ButtonBase, Stack, Typography } from "@mui/material";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import SampleProfileImage from "../../assets/sample-user-profile.png";
import { useNavigate } from "react-router";
import { useCallback } from "react";
import LinkedSectionContainer from "../../components/LinkedSectionContainer";
import AccountSection from "./AccountSection";
import AdsSection from "./AdsSection";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "../../states";

const HomeMobile = () => {
  const navigate = useNavigate();

  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

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
          {isAuthenticated && (
            <Avatar
              src={SampleProfileImage}
              variant="rounded"
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
                백터
              </Typography>

              {/* Steam 닉네임 */}
              <Typography variant="caption" color="text.secondary" noWrap>
                76561198012345678
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

      {/* 송금하기 */}
      <LinkedSectionContainer label="송금하기" linkTo="/transfer" />

      {/* 계좌 */}
      <AccountSection />

      {/* 광고 */}
      <AdsSection />

      {/* 공지사항 */}
      <LinkedSectionContainer label="공지사항" linkTo="/notice" />
    </Stack>
  );
};

export default HomeMobile;
