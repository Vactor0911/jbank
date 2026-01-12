import { Button, Stack, Typography, useTheme, Zoom } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useNavigate } from "react-router";

const CreateAccountSuccess = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Stack flex={1} justifyContent="space-between" alignItems="center" gap={1}>
      {/* 여백용 div */}
      <div />

      <Stack gap={5} alignItems="center">
        {/* 성공 아이콘 */}
        <Zoom in={true}>
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

        {/* 개설 성공 문구 */}
        <Typography variant="h5">새로운 계좌를 만들었어요.</Typography>
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

export default CreateAccountSuccess;
