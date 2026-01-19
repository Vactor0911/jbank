import { ButtonBase, Stack, Typography } from "@mui/material";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import { useNavigate } from "react-router";
import { useCallback } from "react";
import LinkedSectionContainer from "../../components/LinkedSectionContainer";
import AccountSection from "./AccountSection";
import AdsSection from "./AdsSection";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom, userDataAtom } from "../../states";
import ImageBox from "../../components/ImageBox";

const HomeMobile = () => {
  const navigate = useNavigate();

  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const userData = useAtomValue(userDataAtom);

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

      {/* 송금하기 */}
      <LinkedSectionContainer label="송금하기" linkTo="/transfer" />

      {/* 계좌 */}
      <AccountSection />

      {/* 광고 */}
      <AdsSection dense />

      {/* 공지사항 */}
      <LinkedSectionContainer label="공지사항" linkTo="/notice" />
    </Stack>
  );
};

export default HomeMobile;
