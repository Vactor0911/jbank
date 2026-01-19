import { Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useAtom, useSetAtom } from "jotai";
import { transferDataAtom, transferStepAtom } from "../../../states/transfer";

const VerifyInputForm = () => {
  const theme = useTheme();

  const setTransferStep = useSetAtom(transferStepAtom);
  const [transferData, setTransferData] = useAtom(transferDataAtom);

  return (
    <Stack gap={5} flex={1}>
      {/* 뒤로가기 버튼 */}
      <IconButton
        sx={{
          p: 0,
          alignSelf: "flex-start",
          transform: "translateX(-10px)",
        }}
        onClick={() => setTransferStep(1)}
      >
        <ArrowBackRoundedIcon fontSize="large" />
      </IconButton>

      {/* 송금 확인 문구 */}
      <Stack
        my={5}
        flex={1}
        justifyContent="center"
        alignItems="center"
        gap={1}
      >
        {/* 예금주 */}
        <Typography variant="h5">
          <span
            css={{
              color: theme.palette.primary.main,
            }}
          >
            {transferData.receiverAccountHolder}
          </span>
          님에게
        </Typography>
        <Typography variant="h5">
          {Number(transferData.amount).toLocaleString("en-US")} 크레딧을
        </Typography>
        <Typography variant="h5">보낼까요?</Typography>
      </Stack>

      {/* 계좌 정보 */}
      <Stack gap={2}>
        {/* 출금 계좌 */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" color="text.secondary">
            출금 계좌
          </Typography>
          <Typography variant="body1">
            Jbank {transferData.senderAccountNumber}
          </Typography>
        </Stack>

        {/* 입금 계좌 */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" color="text.secondary">
            입금 계좌
          </Typography>
          <Typography variant="body1">
            Jbank {transferData.receiverAccountNumber}
          </Typography>
        </Stack>
      </Stack>

      {/* 보내기 버튼 */}
      <Button
        variant="contained"
        fullWidth
        disableElevation
        sx={{
          p: 1.5,
          borderRadius: 3,
        }}
        onClick={() => {
          setTransferData((prev) => ({
            ...prev,
            inputVerified: true,
          }));
          setTransferStep(3);
        }}
      >
        <Typography variant="h6" fontWeight={500}>
          보내기
        </Typography>
      </Button>
    </Stack>
  );
};

export default VerifyInputForm;
