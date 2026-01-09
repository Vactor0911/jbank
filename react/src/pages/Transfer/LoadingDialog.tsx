import {
  CircularProgress,
  Dialog,
  Stack,
  Typography,
  type DialogProps,
} from "@mui/material";

const LoadingDialog = (props: DialogProps) => {
  const { maxWidth, ...others } = props;

  return (
    <Dialog
      maxWidth={maxWidth ?? "xs"}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 5,
          },
        },
      }}
      {...others}
    >
      <Stack alignItems="center" p={3} py={5}>
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
    </Dialog>
  );
};

export default LoadingDialog;
