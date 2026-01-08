import { Button, Stack, Typography, useTheme, Zoom } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useCallback, useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import {
  isTransferLoadingAtom,
  isTransferSuccessAtom,
  transferDataAtom,
} from "../../../states/transfer";
import { useNavigate } from "react-router";

const TransferSuccess = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [isIconVisible, setIsIconVisible] = useState(false);
  const setTransferData = useSetAtom(transferDataAtom);
  const setIsTransferLoading = useSetAtom(isTransferLoadingAtom);
  const setIsTransferSuccess = useSetAtom(isTransferSuccessAtom);

  // 페이지 로드 시 아이콘 표시
  useEffect(() => {
    // 0.25초 후 아이콘 표시
    const timer = setTimeout(() => {
      setIsIconVisible(true);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  // 확인 버튼 클릭
  const handleConfirmClick = useCallback(() => {
    // 송금하기 페이지 접속 시 기존 데이터 초기화
    setTransferData({ fromAccountNumber: "1234-5678" });
    setIsTransferLoading(false);
    setIsTransferSuccess(null);

    // 메인 페이지로 이동
    navigate("/");
  }, [navigate, setIsTransferLoading, setIsTransferSuccess, setTransferData]);

  return (
    <Stack gap={5} flex={1} justifyContent="space-between">
      {/* 여백용 div */}
      <div />

      <Stack gap={5} alignItems="center">
        {/* 송금 성공 아이콘 */}
        <Zoom
          in={isIconVisible}
          easing={{
            enter: "cubic-bezier(0, 1.5, 0.75, 1)",
            exit: "linear",
          }}
          timeout={200}
        >
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
