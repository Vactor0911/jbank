import { Box, Stack } from "@mui/material";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";

const TransferFailed = () => {
  return (
    <Stack gap={5} flex={1}>
      {/* 송금 실패 아이콘 */}
      <Box>
        <PriorityHighRoundedIcon />
      </Box>
    </Stack>
  );
};

export default TransferFailed;
