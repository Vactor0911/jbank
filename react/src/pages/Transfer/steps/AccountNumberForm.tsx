import {
  Box,
  Button,
  ButtonBase,
  Collapse,
  IconButton,
  InputAdornment,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import ResponsiveTextField from "../../../components/ResponsiveTextField";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { transferDataAtom, transferStepAtom } from "../../../states/transfer";
import { isAccountNumberValid } from "../../../utils";
import JbankIcon from "../../../assets/logo/icon.svg?react";
import UserService from "../../../services/userService";
import AccountService from "../../../services/accountService";
import { accountDataAtom } from "../../../states/account";

const AccountNumberForm = () => {
  const navigate = useNavigate();

  const [accountNumber, setAccountNumber] = useState("");
  const setTransferStep = useSetAtom(transferStepAtom);
  const setTransferData = useSetAtom(transferDataAtom);
  const accountData = useAtomValue(accountDataAtom);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [recentAccountData, setRecentAccountData] = useState<
    { accountNumber: string; userName: string | null }[]
  >([]);

  // 계좌번호 입력 핸들러
  const handleAccountNumberChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // 9자리 제한
      if (event.target.value.length > 9) {
        // 포커스 해제
        event.target.blur();
        return;
      }

      // 숫자만 허용
      const rawValue = event.target.value.replace(/-/g, "");
      if (!/^\d*$/.test(rawValue)) {
        return;
      }

      // 4번째 자리마다 하이픈 추가
      let formattedValue = event.target.value.replace(/-/g, "");
      if (formattedValue.length > 4) {
        formattedValue =
          formattedValue.slice(0, 4) + "-" + formattedValue.slice(4, 9);
      }

      setAccountNumber(formattedValue);

      // 9자리 입력 시 포커스 해제
      if (formattedValue.length >= 9) {
        event.target.blur();
      }
    },
    []
  );

  // 계좌번호로 예금주 조회
  const handleFetchAccountHolder = useCallback(async () => {
    if (!accountNumber) {
      return;
    }

    try {
      const user = await UserService.getUserByAccountNumber(accountNumber);
      const accountHolder = user.steamName;
      return accountHolder;
    } catch {
      throw new Error("해당 계좌를 사용하는 사용자를 찾을 수 없습니다.");
    }
  }, [accountNumber]);

  // 다음 단계로 이동 핸들러
  const handleNext = useCallback(async () => {
    // 계좌번호 유효성 검증
    if (!isAccountNumberValid(accountNumber)) {
      return;
    }

    try {
      // 예금주 조회
      const accountHolder = await handleFetchAccountHolder();
      if (!accountHolder) {
        throw new Error("예금주 조회 실패");
      }

      // 계좌 정보 최신화
      await AccountService.fetchAccounts();
      if (accountNumber === accountData[0].accountNumber) {
        throw new Error("본인 계좌로는 송금할 수 없습니다.");
      }

      // 송금 데이터에 계좌번호 저장
      setTransferData({
        receiverAccountNumber: accountNumber,
        receiverAccountHolder: accountHolder,
      });

      // 다음 단계로 이동
      setTransferStep(1);
    } catch {
      // TODO: 에러 처리 필요
      return;
    }
  }, [
    accountData,
    accountNumber,
    handleFetchAccountHolder,
    setTransferData,
    setTransferStep,
  ]);

  // Slide가 나타날 때 스크롤
  useEffect(() => {
    if (accountNumber.length === 9 && buttonRef.current) {
      setTimeout(() => {
        buttonRef.current?.parentElement?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 0);
    }
  }, [accountNumber]);

  // 최근 거래 계좌 조회
  useEffect(() => {
    const fetchRecentAccounts = async () => {
      try {
        const accountNumber = accountData[0]?.accountNumber;
        if (!accountNumber) {
          return;
        }
        const recentAccounts = await AccountService.fetchRecentAccountNumbers(
          accountNumber
        );

        setRecentAccountData(
          recentAccounts.map((account) => ({
            accountNumber: account.accountNumber,
            userName: account.userName || null,
          }))
        );
      } catch {
        //
      }
    };

    fetchRecentAccounts();
  }, [accountData]);

  // 최근 거래 계좌 클릭 핸들러
  const handleRecentAccountClick = useCallback(
    (recentAccount: { accountNumber: string; userName: string | null }) => {
      if (!recentAccount.userName) {
        return;
      }

      // 송금 데이터에 계좌번호 저장
      setTransferData({
        receiverAccountNumber: recentAccount.accountNumber,
        receiverAccountHolder: recentAccount.userName,
      });

      // 다음 단계로 이동
      setTransferStep(1);
    },
    [setTransferData, setTransferStep]
  );

  return (
    <Stack gap={5} flex={1}>
      {/* 헤더 */}
      <Stack direction="row" alignItems="center">
        {/* 뒤로가기 버튼 */}
        <IconButton
          sx={{
            display: {
              xs: "inline-flex",
              md: "none",
            },
            p: 0,
            transform: "translateX(-10px)",
          }}
          onClick={() => navigate("/")}
        >
          <ArrowBackRoundedIcon fontSize="large" />
        </IconButton>

        {/* 라벨 */}
        <Typography variant="h6">어디로 크레딧을 보낼까요?</Typography>
      </Stack>

      {/* 계좌번호 입력란 */}
      <ResponsiveTextField
        label="계좌번호 입력"
        value={accountNumber}
        onChange={handleAccountNumberChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && accountNumber.length === 9) {
            handleNext();
          }
        }}
        endAdornment={
          accountNumber && (
            <InputAdornment position="end">
              <IconButton onClick={() => setAccountNumber("")}>
                <CloseRoundedIcon />
              </IconButton>
            </InputAdornment>
          )
        }
        slotProps={{
          input: {
            type: "text",
            inputMode: "numeric",
            sx: {
              fontSize: "2em",
            },
          },
        }}
      />

      {/* 최근 보낸 계좌 */}
      <Collapse in={accountNumber.length === 0}>
        <Stack gap={1}>
          {/* 헤더 */}
          <Typography variant="body1" fontWeight={500}>
            최근 보낸 계좌
          </Typography>

          {/* 계좌 목록 */}
          <Box
            maxHeight={{
              xs: "auto",
              md: "240px",
            }}
            overflow="auto"
          >
            <Stack>
              {recentAccountData.map((recentAccount, index) => (
                <ButtonBase
                  key={`recent-send-account-${index}`}
                  disabled={accountNumber.length > 0}
                  sx={{
                    textAlign: "left",
                    borderRadius: 2,
                    overflow: "hidden",
                    p: 1,
                  }}
                  onClick={() => handleRecentAccountClick(recentAccount)}
                >
                  <Stack
                    width="100%"
                    direction="row"
                    alignItems="center"
                    gap={2}
                  >
                    {/* 은행 아이콘 */}
                    <JbankIcon
                      css={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "4px",
                      }}
                    />

                    {/* 계좌 정보 */}
                    <Stack flex={1}>
                      {/* 계좌명 */}
                      <Typography variant="body1" fontWeight="bold">
                        {recentAccount.userName || "알 수 없음"}
                      </Typography>

                      {/* 계좌번호 */}
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        color="text.secondary"
                      >
                        Jbank {recentAccount.accountNumber}
                      </Typography>
                    </Stack>
                  </Stack>
                </ButtonBase>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Collapse>

      {/* 다음 버튼 */}
      <Box
        overflow="hidden"
        width="100%"
        position={{
          xs: "fixed",
          md: "static",
        }}
        bottom="64px"
        left={0}
        mt="auto"
      >
        <Slide in={accountNumber.length === 9} direction="up">
          <Button
            ref={buttonRef}
            variant="contained"
            disableElevation
            fullWidth
            sx={{
              p: 1.5,
              borderRadius: {
                xs: 0,
                md: 2,
              },
            }}
            onClick={handleNext}
          >
            <Typography variant="h5">다음</Typography>
          </Button>
        </Slide>
      </Box>
    </Stack>
  );
};

export default AccountNumberForm;
