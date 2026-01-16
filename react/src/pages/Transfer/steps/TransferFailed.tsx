import { Button, Stack, Typography, useTheme } from "@mui/material";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import { useTransfer } from "../../../hooks/transfer";
import { useCallback } from "react";
import Zoom from "../../../components/transitions/Zoom";

const TransferFailed = () => {
  const theme = useTheme();
  const { resetTransferData } = useTransfer();

  // 확인 버튼 클릭
  const handleConfirmClick = useCallback(() => {
    // 송금하기 페이지 접속 시 기존 데이터 초기화
    resetTransferData();
  }, [resetTransferData]);

  return (
    <Stack gap={5} flex={1} justifyContent="space-between">
      {/* 여백용 div */}
      <div />

      <Stack gap={5} alignItems="center">
        {/* 송금 실패 아이콘 */}
        <Zoom>
          <Stack
            p={1.5}
            borderRadius="50%"
            bgcolor={theme.palette.warning.main}
          >
            <PriorityHighRoundedIcon
              sx={{
                fontSize: "4rem",
                color: theme.palette.text.primary,
              }}
            />
          </Stack>
        </Zoom>

        {/* 송금 실패 문구 */}
        <Stack gap={1} alignItems="center">
          <Typography variant="h5">송금 중에 문제가 발생했어요.</Typography>

          <Typography variant="body1" color="text.secondary">
            나중에 다시 시도해주세요.
          </Typography>
        </Stack>
      </Stack>

      {/* 확인 버튼 */}
      <Button
        variant="contained"
        fullWidth
        disableElevation
        sx={{
          p: 1.5,
          borderRadius: 3,
        }}
        onClick={handleConfirmClick}
      >
        <Typography variant="h6" fontWeight={500}>
          확인
        </Typography>
      </Button>
    </Stack>
  );
};

export default TransferFailed;
