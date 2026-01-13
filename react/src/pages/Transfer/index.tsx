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
import { useAtom, useAtomValue } from "jotai";
import { transferDataAtom, transferStepAtom } from "../../states/transfer";
import { useEffect } from "react";
import { useTransfer } from "../../hooks/transfer";
import { accountDataAtom } from "../../states/account";
import { useNavigate } from "react-router";

// 단계 이름
const STEPS = ["계좌번호 입력", "송금 금액 입력", "입력 정보 확인"];

const Transfer = () => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const { resetTransferData } = useTransfer();
  const navigate = useNavigate();

  const [transferStep, setTransferStep] = useAtom(transferStepAtom);
  const accountData = useAtomValue(accountDataAtom);

  // TODO: 디버그용
  const transferData = useAtomValue(transferDataAtom);
  useEffect(() => {
    console.log(transferData);
  }, [transferData]);

  // 송금하기 페이지 접속 시 기존 데이터 초기화
  useEffect(() => {
    resetTransferData();
    setTransferStep(0);
  }, [resetTransferData, setTransferStep]);

  // 개설된 계좌가 없다면 계좌 개설 페이지로 이동
  useEffect(() => {
    if (accountData.length === 0) {
      navigate("/account/new", { replace: true });
    }
  }, [accountData, navigate]);

  // 개설된 계좌가 없다면 아무것도 표시하지 않음
  if (accountData.length === 0) {
    return null;
  }

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
          activeStep={transferStep}
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
            bgcolor: theme.palette.background.default,
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
