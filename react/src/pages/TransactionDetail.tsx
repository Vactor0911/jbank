import { Divider, IconButton, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const TransactionDetail = () => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: {
          xs: "100%",
          md: "800px",
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
          <Typography variant="h6">상세내역</Typography>
        </Stack>

        {/* 거래 개요 */}
        <Stack mt={5}>
          {/* 상대 계좌 예금주 */}
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            홍길동
          </Typography>

          {/* 거래 금액 */}
          <Typography variant="h3">123,456 크레딧</Typography>
        </Stack>

        {/* 구분선 */}
        <Divider
          sx={{
            mt: "auto",
          }}
        />

        {/* 거래 상세 내역 */}
        <Stack gap={2}>
          {/* 입금처 */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignContent="center"
            flexWrap="wrap"
          >
            {/* 라벨 */}
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              입금처
            </Typography>

            {/* 계좌번호 */}
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              Jbank 1234-5678
            </Typography>
          </Stack>

          {/* 출금처 */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignContent="center"
            flexWrap="wrap"
          >
            {/* 라벨 */}
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              입금처
            </Typography>

            {/* 계좌번호 */}
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              Jbank 1234-5678
            </Typography>
          </Stack>

          {/* 이체일시 */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignContent="center"
            flexWrap="wrap"
          >
            {/* 라벨 */}
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              이체일시
            </Typography>

            {/* 계좌번호 */}
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              2026년 12월 31일 12:34
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default TransactionDetail;
