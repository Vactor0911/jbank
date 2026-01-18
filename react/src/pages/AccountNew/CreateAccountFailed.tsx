import { Button, Stack, Typography, useTheme, Zoom } from "@mui/material";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import { useNavigate } from "react-router";

interface CreateAccountFailedProps {
  errorMessage?: string;
}

const CreateAccountFailed = (props: CreateAccountFailedProps) => {
  const { errorMessage } = props;

  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Stack flex={1} justifyContent="space-between" alignItems="center" gap={1}>
      {/* 여백용 div */}
      <div />

      <Stack gap={5} alignItems="center">
        {/* 실패 아이콘 */}
        <Zoom in={true}>
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

        {/* 개설 실패 문구 */}
        <Stack gap={1}>
          <Typography variant="h5" mt={4} textAlign="center">
            계좌 개설 중 문제가 발생했어요.
          </Typography>

          {errorMessage && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              {errorMessage}
            </Typography>
          )}
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
        onClick={() => navigate("/")}
      >
        <Typography variant="h6" fontWeight={500}>
          확인
        </Typography>
      </Button>
    </Stack>
  );
};

export default CreateAccountFailed;
