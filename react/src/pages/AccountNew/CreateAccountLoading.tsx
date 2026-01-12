import { CircularProgress, Stack, Typography } from "@mui/material";

const CreateAccountLoading = () => {
  return (
    <Stack flex={1} justifyContent="center" alignItems="center" gap={1}>
      <CircularProgress
        size="64px"
        sx={{
          mb: 3,
        }}
      />

      <Typography variant="h6">새로운 계좌를 만들고 있어요.</Typography>

      <Typography variant="body1" fontWeight={500}>
        조금만 기다려주세요.
      </Typography>
    </Stack>
  );
};

export default CreateAccountLoading;
