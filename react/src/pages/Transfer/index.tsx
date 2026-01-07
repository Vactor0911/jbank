import {
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  useTheme,
} from "@mui/material";
import Section from "../../components/Section";
import { useIsMobile } from "../../hooks";
import TransferSteps from "./TransferSteps";
import { useAtom } from "jotai";
import { transferDataAtom } from "../../states/transfer";
import { useCallback, useEffect } from "react";

// 단계 이름
const STEPS = ["계좌번호 입력", "송금 금액 입력", "입력 정보 확인"];

const Transfer = () => {
  const theme = useTheme();
  const isMobile = useIsMobile();

  const [transferData, setTransferData] = useAtom(transferDataAtom);

  // 송금하기 페이지 접속 시 기존 데이터 초기화
  useEffect(() => {
    setTransferData({ fromAccountNumber: "1234-5678" });
  }, [setTransferData]);

  // 현재 단계 계산
  const getCurrentStep = useCallback(() => {
    // 계좌번호 미입력
    if (!transferData.toAccountNumber) {
      return 0;
    }

    // 송금액 미입력
    if (!transferData.amount) {
      return 1;
    }

    // 입력 정보 미확인
    if (!transferData.inputVerified) {
      return 2;
    }

    return 3;
  }, [
    transferData.toAccountNumber,
    transferData.amount,
    transferData.inputVerified,
  ]);

  // 모바일인 경우 전체 화면으로 표시
  if (isMobile) {
    return <TransferSteps />;
  }

  // PC용 화면
  return (
    <Section
      label="송금하기"
      sx={{
        width: {
          xs: "100%",
          md: "50%",
        },
        minWidth: {
          xs: 0,
          md: "450px",
        },
        display: "flex",
        flex: 1,
        mt: {
          xs: 2,
          md: 0,
        },
      }}
    >
      <Stack gap={3} flex={1}>
        {/* PC용 단계 표시 */}
        <Stepper
          activeStep={getCurrentStep()}
          alternativeLabel
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
          }}
        >
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* 컨테이너 */}
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            flex: 1,
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.secondary.main,
          }}
        >
          {/* 단계별 화면 */}
          <TransferSteps />
        </Paper>
      </Stack>
    </Section>
  );
};

export default Transfer;
