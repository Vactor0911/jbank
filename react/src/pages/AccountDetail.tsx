import {
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  keyframes,
  Paper,
  Skeleton,
  Stack,
  Typography,
  Zoom,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate, useParams } from "react-router";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useCallback, useEffect, useState } from "react";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import AccountService, { type AccountData } from "../services/accountService";
import { AxiosError } from "axios";
import { formatNumberString } from "../utils";

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
  const { accountUuid } = useParams();

  const [isFetching, setIsFetching] = useState(false);
  const [isFetchSuccess, setIsFetchSuccess] = useState<boolean | null>(null);
  const [accountData, setAccountData] = useState<AccountData | null>(null);

  // 계좌 정보 조회 핸들러
  const handleFetchAccountData = useCallback(async () => {
    if (!accountUuid) {
      return;
    }

    try {
      // 적어도 1초 대기
      const response = await Promise.all([
        // 계좌 정보 조회 API 호출
        AccountService.fetchAccount(accountUuid),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);

      // 조회 응답 처리
      const accountResponse = response[0];
      setIsFetchSuccess(accountResponse.data.success);
      if (accountResponse.data.success) {
        setAccountData(accountResponse.data.data.account as AccountData);
      }

      // 3초 후 초기화
      const timer = setTimeout(() => {
        setIsFetchSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          "계좌 정보 조회 중 오류 발생:",
          error.response?.data.error
        );
      }
    }
  }, [accountUuid]);

  // 계좌 정보 새로고침 버튼 클릭 핸들러
  const handleRefreshAccountClick = useCallback(async () => {
    // 이미 새로고침 중이라면 종료
    if (isFetching) {
      return;
    }

    // 계좌 정보 새로고침
    setIsFetching(true);
    await handleFetchAccountData();
    setIsFetching(false);
  }, [handleFetchAccountData, isFetching]);

  // 페이지 로드 시 계좌 정보 조회
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      if (ignore) return;
      setIsFetching(true);
      await handleFetchAccountData();
      setIsFetching(false);
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [handleFetchAccountData]);

  // 계좌번호 복사 핸들러
  const handleAccountNumberCopy = useCallback(() => {
    if (accountData?.accountNumber) {
      navigator.clipboard.writeText(accountData.accountNumber);
    }
  }, [accountData]);

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
            disabled={isFetching || isFetchSuccess !== null}
            onClick={handleRefreshAccountClick}
          >
            {/* 새로고침 아이콘 */}
            <Zoom
              in={isFetchSuccess === null}
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
              in={isFetchSuccess === true}
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

            {/* 새로고침 실패 아이콘 */}
            <Zoom
              in={isFetchSuccess === false}
              timeout={250}
              unmountOnExit
              style={{
                transitionDelay: isFetchSuccess ? "250ms" : "0ms",
              }}
            >
              <WarningAmberRoundedIcon
                fontSize="large"
                color="warning"
                sx={{
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
              {accountData?.accountNumber ? (
                <Button
                  sx={{
                    color: "text.primary",
                    p: 0,
                    px: 0.5,
                    textTransform: "none",
                    alignSelf: "flex-start",
                  }}
                  onClick={handleAccountNumberCopy}
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
              ) : (
                <Skeleton variant="rounded" width="120px" height="20px" />
              )}

              {/* 잔액 */}
              {accountData?.credit ? (
                <Typography variant="h4" noWrap>
                  {formatNumberString(accountData?.credit as string)} 크레딧
                </Typography>
              ) : (
                <Skeleton
                  variant="rounded"
                  width="200px"
                  sx={{
                    height: {
                      xs: "30px",
                      md: "40px",
                    },
                  }}
                />
              )}
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
