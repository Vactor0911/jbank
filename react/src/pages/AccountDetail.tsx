import {
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  keyframes,
  Paper,
  Stack,
  Typography,
  Zoom,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useAccount } from "../hooks/account";
import { useCallback, useEffect, useState } from "react";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

const RefreshAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const AccountDetail = () => {
  const navigate = useNavigate();

  const { accountData, fetchAccountData } = useAccount();
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchSuccess, setIsFetchSuccess] = useState(false);

  // 계좌 정보 새로고침 버튼 클릭 핸들러
  const handleRefreshAccountClick = useCallback(() => {
    // 이미 새로고침 중이라면 종료
    if (isFetching) {
      return;
    }

    // 계좌 정보 새로고침
    setIsFetching(true);
    fetchAccountData();

    // TODO: 애니메이션 테스트용 코드 | 제거 예정
    setTimeout(() => {
      setIsFetchSuccess(true);

      setTimeout(() => {
        setIsFetchSuccess(false);
        setIsFetching(false);
      }, 2000);
    }, 2000);
  }, [fetchAccountData, isFetching]);

  // 페이지 로드 시 계좌 정보 조회
  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

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
          <Typography variant="h6">내 Jbank 계좌</Typography>

          {/* 새로고침 버튼 */}
          <IconButton
            sx={{
              p: 0,
              ml: "auto",
              animation: isFetching
                ? `${RefreshAnimation} 0.6s ease forwards`
                : "none",
              position: "relative",
              width: 35,
              height: 35,
            }}
            onClick={handleRefreshAccountClick}
          >
            {/* 새로고침 아이콘 */}
            <Zoom
              in={!isFetchSuccess}
              timeout={250}
              unmountOnExit
              style={{
                transitionDelay: !isFetchSuccess ? "250ms" : "0ms",
              }}
            >
              <RefreshRoundedIcon
                fontSize="large"
                sx={{
                  color: "action.disabled",
                  position: "absolute",
                }}
              />
            </Zoom>

            {/* 새로고침 성공 아이콘 */}
            <Zoom
              in={isFetchSuccess}
              timeout={250}
              unmountOnExit
              style={{
                transitionDelay: isFetchSuccess ? "250ms" : "0ms",
              }}
            >
              <CheckRoundedIcon
                fontSize="large"
                color="primary"
                sx={{
                  fontSize: "30px",
                  position: "absolute",
                }}
              />
            </Zoom>
          </IconButton>
        </Stack>

        {/* 스크롤 컨테이너 */}
        <Box flex={1} overflow="auto">
          <Stack gap={3}>
            {/* 계좌 정보 */}
            <Stack mt={2} gap={1}>
              {/* 계좌번호 */}
              <Button
                sx={{
                  color: "text.primary",
                  p: 0,
                  px: 0.5,
                  textTransform: "none",
                  alignSelf: "flex-start",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: "underline",
                  }}
                >
                  Jbank {accountData?.accountNumber}
                </Typography>
              </Button>

              {/* 잔액 */}
              <Typography variant="h4" noWrap>
                {accountData?.balance.toLocaleString("en-US")} 크레딧
              </Typography>
            </Stack>

            {/* 구분선 */}
            <Divider />

            {/* 거래 내역 */}
            <Stack gap={1}>
              {/* 필터 선택 버튼 */}
              <Button
                sx={{
                  color: "text.primary",
                  p: 0.5,
                  px: 1,
                  minWidth: 0,
                  alignSelf: "flex-start",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  color="text.secondary"
                >
                  <Typography variant="body1">전체</Typography>
                  <ExpandMoreRoundedIcon />
                </Stack>
              </Button>

              {/* 거래 내역 */}
              {Array.from({ length: 10 }).map((_, index) => (
                // 거래 내역 버튼
                <ButtonBase
                  key={`transaction-${index}`}
                  sx={{
                    width: "100%",
                    p: 0.5,
                    px: 1,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                  onClick={() => navigate("/transaction/transaction-uuid")}
                >
                  <Stack direction="row" width="100%" gap={3}>
                    {/* 날짜 */}
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color="text.secondary"
                      mt="0.4em"
                    >
                      01.23
                    </Typography>

                    {/* 거래 정보 */}
                    <Stack flexShrink={1} minWidth={0}>
                      {/* 상대 계좌 예금주 */}
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        noWrap
                        textAlign="left"
                      >
                        백터 (Vactor0911)
                      </Typography>

                      {/* 거래 시각 */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="left"
                      >
                        12:34
                      </Typography>
                    </Stack>

                    {/* 거래 금액 */}
                    <Stack>
                      {/* 거래 금액 */}
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        color="primary"
                        noWrap
                        textAlign="right"
                      >
                        1,100 크레딧
                      </Typography>

                      {/* 거래 후 잔액 */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        textAlign="right"
                      >
                        123,456 크레딧
                      </Typography>
                    </Stack>
                  </Stack>
                </ButtonBase>
              ))}
            </Stack>
          </Stack>
        </Box>

        {/* 송금하기 버튼 */}
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
            onClick={() => navigate("/transfer")}
          >
            <Typography variant="h5">송금하기</Typography>
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default AccountDetail;
