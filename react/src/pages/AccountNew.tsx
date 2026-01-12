import {
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router";
import JbankIcon from "../assets/logo/icon.svg?react";
import InfoOutlineRoundedIcon from "@mui/icons-material/InfoOutlineRounded";
import { useState } from "react";

const AccountNew = () => {
  const navigate = useNavigate();

  const [confirmed, setConfirmed] = useState(false);

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: {
          xs: "100%",
          md: "500px",
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
        gap={3}
        height={{
          xs: "calc(100dvh - 196px)",
          md: "calc(100dvh - 128px)",
        }}
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
          <Typography variant="h6">새 Jbank 계좌 개설</Typography>
        </Stack>

        {/* 스크롤 컨테이너 */}
        <Box flex={1} overflow="auto" mt={2}>
          <Stack gap={3}>
            {/* 은행 정보 */}
            <Stack direction="row" gap={3}>
              <Stack flex={1} gap={0.5}>
                {/* 은행 이름 */}
                <Typography variant="h5">Jbank</Typography>

                {/* 계좌 유형 */}
                <Typography variant="body1">일반 예금</Typography>
              </Stack>

              {/* 은행 로고 */}
              <JbankIcon
                css={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "8px",
                }}
              />
            </Stack>

            {/* 이자율 */}
            <Stack>
              <Typography variant="body2" color="text.secondary">
                이자율
              </Typography>
              <Typography variant="body1" color="primary" fontWeight={500}>
                이자 없음
              </Typography>
            </Stack>

            {/* 구분선 */}
            <Divider
              sx={{
                my: 2,
              }}
            />

            {/* 상품 안내 */}
            <Stack gap={3}>
              <Typography variant="body1" fontWeight="bold">
                상품 안내
              </Typography>

              {/* 상품 정보 */}
              <Grid container spacing={3}>
                {/* 상품명 */}
                <Grid size={4}>
                  <Typography variant="body1" fontWeight={500}>
                    상품명
                  </Typography>
                </Grid>
                <Grid size={8}>
                  <Typography variant="body1">Jbank 예금 계좌</Typography>
                </Grid>

                {/* 가입대상 */}
                <Grid size={4}>
                  <Typography variant="body1" fontWeight={500}>
                    가입대상
                  </Typography>
                </Grid>
                <Grid size={8}>
                  <Typography variant="body1">
                    Jellen 서버 유저 (1인 1계좌)
                  </Typography>
                </Grid>

                {/* 계약기간 */}
                <Grid size={4}>
                  <Typography variant="body1" fontWeight={500}>
                    계약기간
                  </Typography>
                </Grid>
                <Grid size={8}>
                  <Typography variant="body1">무기한</Typography>
                </Grid>
              </Grid>
            </Stack>

            {/* 구분선 */}
            <Divider
              sx={{
                my: 2,
              }}
            />

            {/* 유의사항 */}
            <Typography variant="body1" color="text.secondary">
              <InfoOutlineRoundedIcon
                sx={{
                  fontSize: "1em",
                  mr: 0.5,
                  transform: "translateY(0.15em)",
                }}
              />
              Jellen 서버와 연동된 가상의 계좌로, 실제 금전과는 무관해요.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <InfoOutlineRoundedIcon
                sx={{
                  fontSize: "1em",
                  mr: 0.5,
                  transform: "translateY(0.15em)",
                }}
              />
              Jellen 서버에서 차단될 경우, 계좌도 함께 해지될 수 있어요.
            </Typography>

            {/* 약관 동의 버튼 */}
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                mb: 5,
                p: 0.5,
                bgcolor: "action.disabledBackground",
                borderRadius: 2,
                cursor: "pointer",
              }}
              onClick={() => setConfirmed((prev) => !prev)}
            >
              <Stack direction="row" alignItems="center">
                <Checkbox checked={confirmed} />
                <Typography variant="body1">
                  위 내용을 충분히 확인하고 동의했어요
                </Typography>
              </Stack>
            </Paper>
          </Stack>
        </Box>

        {/* 계좌 만들기 버튼 */}
        <Stack
          width="100%"
          height="64px"
          justifyContent="center"
          position={{
            xs: "fixed",
            md: "static",
          }}
          bottom="64px"
          left={0}
          mt="auto"
          px={{
            xs: 3,
            md: 0,
          }}
        >
          <Button
            variant="contained"
            disableElevation
            fullWidth
            sx={{
              p: 1.5,
              borderRadius: 2,
            }}
            disabled={!confirmed}
            onClick={() => {}}
          >
            <Typography variant="h5">
              {confirmed ? "계좌 만들기" : "약관에 동의해주세요"}
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default AccountNew;
