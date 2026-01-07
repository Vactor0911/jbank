import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import PageWrapper from "../components/PageWrapper";
import TrafficCone from "../assets/traffic-cone.svg";
import { useNavigate } from "react-router";

const NotFoundError = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Stack
        minHeight="100%"
        justifyContent="center"
        alignItems="center"
        gap={4}
      >
        {/* 로고 */}
        <Box
          width={{
            xs: "150px",
            md: "200px",
          }}
          position="relative"
          mx="auto"
          my={5}
          sx={{
            aspectRatio: "1 / 1",
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: "100%",
              height: "100%",
              bgcolor: theme.palette.primary.main,
              fontWeight: "bold",
              fontSize: "8em",
              borderRadius: 5,
            }}
          >
            J
          </Avatar>

          {/* 공사 아이콘 */}
          <Box
            component="img"
            src={TrafficCone}
            width="55%"
            position="absolute"
            bottom="-14%"
            right="-10%"
          />
          <Box
            component="img"
            src={TrafficCone}
            width="55%"
            position="absolute"
            bottom="-20%"
            left="-20%"
          />
        </Box>

        <Typography variant="h4" textAlign="center">
          오류가 발생했습니다!
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          textAlign="center"
          fontWeight={500}
        >
          오류가 계속 발생한다면 아래 버튼을 눌러 신고해주세요.
        </Typography>

        {/*버튼 컨테이너 */}
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          alignItems="center"
          gap={{
            xs: 3,
            md: 5,
          }}
        >
          {/* 오류 신고 버튼 */}
          <Button
            variant="contained"
            sx={{
              borderRadius: 2,
            }}
            onClick={() => {
              // TODO: 오류 신고 페이지 링크로 이동
            }}
          >
            <Typography variant="h6">오류 신고하기</Typography>
          </Button>

          {/* 돌아가기 버튼 */}
          <Button
            variant="outlined"
            sx={{
              borderRadius: 2,
            }}
            onClick={() => navigate("/", { replace: true })}
          >
            <Typography variant="h6">처음으로 돌아가기</Typography>
          </Button>
        </Stack>
      </Stack>
    </PageWrapper>
  );
};

export default NotFoundError;
