import {
  Box,
  Button,
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
import AccountService, {
  type AccountData,
} from "../../services/accountService";
import { AxiosError } from "axios";
import { formatNumberString } from "../../utils";
import TransactionService, {
  type TransactionData,
} from "../../services/transactionService";
import TransactionButton from "./TransactionButton";

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
  const [isTransactionFetching, setIsTransactionFetching] = useState(false);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [page, setPage] = useState(2);
  const [isFetchSuccess, setIsFetchSuccess] = useState<boolean | null>(null);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [transactionsData, setTransactionsData] = useState<TransactionData[]>(
    []
  );

  // 계좌 정보 조회 핸들러
  const handleFetchAccountData = useCallback(async () => {
    if (!accountUuid) {
      return;
    }

    try {
      // 적어도 0.5초 대기
      const response = await Promise.all([
        // 계좌 정보 조회 API 호출
        AccountService.fetchAccount(accountUuid),
        TransactionService.fetchAccountTransactions(accountUuid),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]);

      // 조회 응답 처리
      const accountResponse = response[0];
      const transactionsResponse = response[1];
      setIsFetchSuccess(accountResponse.data.success);
      if (accountResponse.data.success) {
        setAccountData(accountResponse.data.data.account as AccountData);
        setTransactionsData(
          transactionsResponse.data.data.transactions as TransactionData[]
        );
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

  // 거래내역 더 불러오기 핸들러
  const handleFetchMoreTransactions = useCallback(async () => {
    if (!accountUuid) {
      return;
    }
    if (isTransactionFetching || !hasMoreTransactions) {
      return;
    }

    setIsTransactionFetching(true);
    try {
      const response = await TransactionService.fetchAccountTransactions(
        accountUuid,
        page,
        10
      );
      if (response.data.success) {
        setTransactionsData((prev) => [
          ...prev,
          ...(response.data.data.transactions as TransactionData[]),
        ]);

        // 더 불러올 거래내역이 있는지 확인
        const hasMoreTransactions =
          response.data.data.transactions.length >= 10;
        setHasMoreTransactions(hasMoreTransactions);
        if (hasMoreTransactions) {
          setPage((prev) => prev + 1);
        }
      }
    } catch {
      // 오류 처리 생략
      setHasMoreTransactions(false);
    } finally {
      setIsTransactionFetching(false);
    }
  }, [accountUuid, hasMoreTransactions, isTransactionFetching, page]);

  // 계좌 정보 새로고침 버튼 클릭 핸들러
  const handleRefreshAccountClick = useCallback(async () => {
    // 이미 새로고침 중이라면 종료
    if (isFetching) {
      return;
    }

    // 계좌 정보 새로고침
    setIsFetching(true);
    setHasMoreTransactions(true);
    setPage(2);
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
        <Box
          flex={1}
          overflow="auto"
          onScroll={(e) => {
            const target = e.target as HTMLElement;
            const isBottom =
              target.scrollHeight - target.scrollTop <=
              target.clientHeight + 10;
            if (isBottom) {
              handleFetchMoreTransactions();
            }
          }}
        >
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
              <Typography variant="h4" display="flex" gap={0.5} noWrap>
                {accountData?.credit && !isFetching ? (
                  <span>
                    {formatNumberString(accountData?.credit as string)}
                  </span>
                ) : (
                  <Skeleton
                    variant="rounded"
                    width="120px"
                    sx={{
                      height: {
                        xs: "30px",
                        md: "40px",
                      },
                    }}
                  />
                )}
                크레딧
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
              {transactionsData.length > 0 &&
                !isFetching &&
                transactionsData.map((transaction, index) => (
                  // 거래 내역 버튼
                  <TransactionButton
                    key={`transaction-${index}`}
                    transaction={transaction}
                    accountData={accountData}
                  />
                ))}

              {/* 초기 로딩 스켈레톤 */}
              {isFetching && (
                <>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={`transaction-skeleton-${index}`}
                      variant="rounded"
                      sx={{
                        height: {
                          xs: "50px",
                          md: "60px",
                        },
                        m: 0.5,
                        mx: 1,
                      }}
                    />
                  ))}
                </>
              )}

              {/* 추가 로딩 인디케이터 */}
              {isTransactionFetching && (
                <Box textAlign="center" py={2}>
                  <Typography variant="body2" color="text.secondary">
                    불러오는 중...
                  </Typography>
                </Box>
              )}
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
