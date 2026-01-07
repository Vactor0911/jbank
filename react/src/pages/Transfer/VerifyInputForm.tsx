import { IconButton, Stack } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useSetAtom } from "jotai";
import { transferDataAtom } from "../../states/transfer";

const VerifyInputForm = () => {
  const setTransferData = useSetAtom(transferDataAtom);

  return (
    <Stack gap={3} flex={1}>
      {/* 뒤로가기 버튼 */}
      <IconButton
        sx={{
          p: 0,
          alignSelf: "flex-start",
          transform: "translateX(-10px)",
        }}
        onClick={() =>
          setTransferData((prev) => ({
            accountNumber: prev.accountNumber,
            amount: undefined,
            inputVerified: undefined,
            password: undefined,
          }))
        }
      >
        <ArrowBackRoundedIcon fontSize="large" />
      </IconButton>
    </Stack>
  );
};

export default VerifyInputForm;
