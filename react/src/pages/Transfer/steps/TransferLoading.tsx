import { CircularProgress, Stack, Typography } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import {
  isTransferSuccessAtom,
  transferDataAtom,
  transferStepAtom,
} from "../../../states/transfer";
import { useEffect } from "react";
import TransferService from "../../../services/transferService";

const TransferLoading = () => {
  const setTransferStep = useSetAtom(transferStepAtom);
  const transferData = useAtomValue(transferDataAtom);
  const setIsTransferSuccess = useSetAtom(isTransferSuccessAtom);

  // 송금 처리
  useEffect(() => {
    const transfer = async () => {
      try {
        // 송금 서비스 호출
        await TransferService.transfer(transferData);

        // 성공 시 완료 단계로 이동
        setIsTransferSuccess(true);
      } catch {
        // 실패 시 완료 단계로 이동
        setIsTransferSuccess(false);
      } finally {
        setTransferStep(5);
      }
    };

    transfer();
  }, [setIsTransferSuccess, setTransferStep, transferData]);

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
