import { CircularProgress, Stack, Typography } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import {
  isTransferSuccessAtom,
  transferDataAtom,
  transferErrorMessageAtom,
  transferStepAtom,
} from "../../../states/transfer";
import { useEffect } from "react";
import TransferService from "../../../services/transferService";
import { AxiosError } from "axios";

const TransferLoading = () => {
  const setTransferStep = useSetAtom(transferStepAtom);
  const transferData = useAtomValue(transferDataAtom);
  const setIsTransferSuccess = useSetAtom(isTransferSuccessAtom);
  const setTransferErrorMessage = useSetAtom(transferErrorMessageAtom);

  // 송금 처리
  useEffect(() => {
    const transfer = async () => {
      try {
        // 송금 서비스 호출
        const response = await TransferService.transfer(transferData);
        if (!response.data.success) {
          throw new Error(response.data.error || "나중에 다시 시도해주세요.");
        }

        // 성공 시 완료 단계로 이동
        setIsTransferSuccess(true);
      } catch (error) {
        // 실패 시 완료 단계로 이동
        setIsTransferSuccess(false);

        if (error instanceof AxiosError) {
          setTransferErrorMessage(
            error.response?.data.error || "나중에 다시 시도해주세요."
          );
        } else if (error instanceof Error) {
          setTransferErrorMessage(error.message || "나중에 다시 시도해주세요.");
        }
      } finally {
        setTransferStep(5);
      }
    };

    transfer();
  }, [
    setIsTransferSuccess,
    setTransferErrorMessage,
    setTransferStep,
    transferData,
  ]);

  return (
    <Stack flex={1} justifyContent="center" alignItems="center" gap={1}>
      <CircularProgress
        size="64px"
        sx={{
          mb: 3,
        }}
      />

      <Typography variant="h6">안전하게 송금하고 있어요.</Typography>

      <Typography variant="body1" fontWeight={500}>
        조금만 기다려주세요.
      </Typography>
    </Stack>
  );
};

export default TransferLoading;
