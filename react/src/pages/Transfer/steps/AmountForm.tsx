import {
  Box,
  Button,
  IconButton,
  Slide,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useAtom } from "jotai";
import { transferDataAtom } from "../../../states/transfer";
import ResponsiveTextField from "../../../components/ResponsiveTextField";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatNumberKor } from "../../../utils";

const AmountForm = () => {
  const theme = useTheme();

  const [transferData, setTransferData] = useAtom(transferDataAtom);
  const [amount, setAmount] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 송금액 추출
  const getRawAmount = useCallback((amountStr: string) => {
    return amountStr.replace(/[^0-9]/g, "");
  }, []);

  // 송금액 제한 검증
  const isAmountValid = useCallback(() => {
    const rawAmount = getRawAmount(amount);
    const amountNum = Number(rawAmount);

    return amountNum > 0 && amountNum <= 100000000;
  }, [getRawAmount, amount]);

  // 송금액 입력 핸들러
  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let rawValue = getRawAmount(event.target.value);

      // 백스페이스를 입력했다면 rawValue를 10으로 나눈 몫으로 저장
      if (
        event.nativeEvent instanceof InputEvent &&
        event.nativeEvent.inputType === "deleteContentBackward"
      ) {
        rawValue = String(Math.floor(Number(rawValue) / 10));
      }

      // 송금액이 최대치(100,000,000)를 넘었다면
      if (rawValue.length > 9) {
        return;
      }

      // 송금액이 0이라면
      if (rawValue === "" || rawValue === "0") {
        setAmount("");
        return;
      }

      // 콤마 추가
      rawValue = Number(rawValue).toLocaleString("en-US");

      setAmount(rawValue + " 크레딧");
    },
    [getRawAmount]
  );

  // 다음 단계로 이동 핸들러
  const handleNext = useCallback(() => {
    setTransferData((prev) => ({
      ...prev,
      amount: Number(getRawAmount(amount)),
    }));
  }, [setTransferData, getRawAmount, amount]);

  // Slide가 나타날 때 스크롤
  useEffect(() => {
    if (amount.length === 1 && buttonRef.current) {
      buttonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [amount.length, isAmountValid]);

  return (
    <Stack gap={3} flex={1} position="relative">
      {/* 뒤로가기 버튼 */}
      <IconButton
        sx={{
          p: 0,
          alignSelf: "flex-start",
          transform: "translateX(-10px)",
        }}
        onClick={() =>
          setTransferData((prev) => ({
            fromAccountNumber: prev.fromAccountNumber,
          }))
        }
      >
        <ArrowBackRoundedIcon fontSize="large" />
      </IconButton>

      {/* 보내는 계좌 */}
      <Stack>
        {/* 계좌명 */}
        <Typography variant="h5">
          내 Jbank 계좌
          <span
            css={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            에서
          </span>
        </Typography>

        {/* 잔액 */}
        <Typography variant="body1">
          잔액{" "}
          <span
            css={{
              color: theme.palette.text.primary,
              fontWeight: "bold",
            }}
          >
            123,456
          </span>{" "}
          크레딧
        </Typography>
      </Stack>

      {/* 받는 계좌 */}
      <Stack>
        {/* 입금주 */}
        <Typography variant="h5">
          홍길동
          <span
            css={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            님에게
          </span>
        </Typography>

        {/* 계좌 번호 */}
        <Typography variant="body1">
          Jbank {transferData.toAccountNumber}
        </Typography>
      </Stack>

      {/* 송금액 입력란 */}
      <Stack>
        <ResponsiveTextField
          value={amount}
          onChange={handleAmountChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isAmountValid()) {
              handleNext();
            }
          }}
          slotProps={{
            input: {
              type: "text",
              inputMode: "numeric",
              placeholder: "얼마나 보낼까요?",
              sx: {
                fontSize: "2em",
                "::placeholder": {
                  color: theme.palette.text.secondary,
                  opacity: 1,
                },
              },
            },
          }}
          error={Number(getRawAmount(amount)) > 100000000}
        />

        {/* 안내 문구 */}
        {/* 송금 한도 경고 메시지 */}
        {Number(getRawAmount(amount)) > 100000000 && (
          <Typography variant="caption" color="error">
            한 번에 1억 크레딧까지 보낼 수 있어요.
          </Typography>
        )}

        {/* 한글식 숫자 표기법 */}
        {isAmountValid() && Number(getRawAmount(amount)) >= 10000 && (
          <Typography variant="caption" color="text.secondary">
            {formatNumberKor(Number(getRawAmount(amount)))} 크레딧
          </Typography>
        )}
      </Stack>

      {/* 송금 한도 안내 버튼 */}
      {Number(getRawAmount(amount)) > 100000000 && (
        <Box>
          <Button
            variant="contained"
            color="secondary"
            disableElevation
            sx={{
              border: `1px solid ${theme.palette.action.disabled}`,
            }}
            onClick={() => setAmount("100,000,000 크레딧")}
          >
            <Typography variant="body2" color="text.secondary">
              1억 크레딧으로 변경
            </Typography>
          </Button>
        </Box>
      )}

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
        <Slide in={isAmountValid()} direction="up">
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

export default AmountForm;
