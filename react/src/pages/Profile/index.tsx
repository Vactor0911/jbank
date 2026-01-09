import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router";
import SectionContainer from "./SectionContainer";
import SampleProfileImage from "../../assets/sample-user-profile.png";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: {
          xs: "100%",
          md: "600px",
        },
        bgcolor: {
          xs: "transparent",
          md: "background.paper",
        },
        borderRadius: 5,
      }}
    >
      <Stack
        p={{
          xs: 0,
          md: 3,
        }}
        gap={5}
      >
        {/* 헤더 */}
        <Stack direction="row" alignItems="center">
          {/* 뒤로가기 버튼 */}
          <IconButton
            sx={{
              p: 0,
              transform: "translateX(-10px)",
            }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackRoundedIcon fontSize="large" />
          </IconButton>

          {/* 라벨 */}
          <Typography variant="h6">내 정보</Typography>
        </Stack>

        <SectionContainer label="기본 정보">
          {/* 기본 정보 */}
          <Stack gap={3}>
            <Stack direction="row" gap={5} flexWrap="wrap">
              {/* 프로필 이미지 */}
              <Box
                component="img"
                src={SampleProfileImage}
                width="128px"
                height="128px"
                borderRadius={2}
              />

              <Stack flex={1}>
                {/* 스팀 닉네임 */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                  noWrap
                >
                  Steam 닉네임
                </Typography>
                <Typography variant="h5" noWrap>
                  백터 (Vactor0911)
                </Typography>

                {/* 스팀 닉네임 */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                  mt={2}
                  noWrap
                >
                  Steam 고유번호
                </Typography>
                <Typography variant="h5" noWrap>
                  123456789
                </Typography>
              </Stack>
            </Stack>

            {/* 정보 새로고침 */}
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
              justifyContent="space-between"
              gap={1}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                {/* 안내 문구 */}
                <Typography variant="body2" color="text.secondary" noWrap>
                  스팀 계정 정보와 다르신가요?
                </Typography>

                {/* 도움말 */}
                <Tooltip
                  title="스팀 계정 정보는 스팀 서버에서 주기적으로 동기화됩니다. 즉시 반영을 원하시면 새로고침 버튼을 눌러주세요."
                  slotProps={{
                    tooltip: {
                      sx: {
                        mx: 2,
                      },
                    },
                  }}
                >
                  <HelpOutlineRoundedIcon
                    sx={{
                      color: "text.secondary",
                    }}
                  />
                </Tooltip>
              </Stack>

              {/* 정보 새로고침 버튼 */}
              <Button variant="contained" color="secondary" disableElevation>
                <Typography variant="body1" fontWeight={500}>
                  정보 새로고침
                </Typography>
              </Button>
            </Stack>
          </Stack>
        </SectionContainer>

        {/* 구분선 */}
        <Divider flexItem />

        {/* 회원 탈퇴 */}
        <Box alignSelf="flex-end">
          <Button variant="outlined" color="error" disableElevation>
            <Typography variant="body1" fontWeight={500}>
              회원 탈퇴하기
            </Typography>
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default Profile;
