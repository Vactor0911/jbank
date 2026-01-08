import { Button, Stack, Typography, useTheme } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useTransfer } from "../../../hooks/transfer";
import Zoom from "../../../components/transitions/Zoom";

const TransferSuccess = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { resetTransferData } = useTransfer();

  // 확인 버튼 클릭
  const handleConfirmClick = useCallback(() => {
    // 송금하기 페이지 접속 시 기존 데이터 초기화
    resetTransferData();

    // 메인 페이지로 이동
    navigate("/");
  }, [navigate, resetTransferData]);

  return (
    <Stack gap={5} flex={1} justifyContent="space-between">
      {/* 여백용 div */}
      <div />

      <Stack gap={5} alignItems="center">
        {/* 송금 성공 아이콘 */}
        <Zoom>
          <Stack
            p={1.5}
            borderRadius="50%"
            bgcolor={theme.palette.primary.main}
          >
            <CheckRoundedIcon
              sx={{
                fontSize: "4rem",
                color: "white",
              }}
            />
          </Stack>
        </Zoom>

        {/* 송금 성공 문구 */}
        <Typography variant="h5">포인트를 안전하게 송금했어요.</Typography>
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

export default TransferSuccess;
