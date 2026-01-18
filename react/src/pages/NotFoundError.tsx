import { Box, Button, Stack, Typography } from "@mui/material";
import TrafficCone from "../assets/traffic-cone.svg";
import { useNavigate } from "react-router";
import JbankIcon from "../assets/logo/icon.svg?react";
import { useCallback } from "react";

const NotFoundError = () => {
  const navigate = useNavigate();

  // 의견 보내기 버튼 클릭 핸들러
  const handleSendFeedbackClick = useCallback(() => {
    window.open("https://forms.gle/pWhCPMB2QhpF3oAX8", "_blank");
  }, []);

  return (
    <Stack
      flex={1}
      minHeight="100%"
      justifyContent="center"
      alignItems="center"
      gap={4}
    >
      {/* 로고 */}
      <Box
        width={{
          xs: "150px",
          md: "250px",
        }}
        height={{
          xs: "150px",
          md: "250px",
        }}
        position="relative"
        mx="auto"
        my={5}
      >
        <JbankIcon
          css={{
            width: "100%",
            height: "100%",
            borderRadius: "20px",
          }}
        />

        {/* 공사 아이콘 */}
        <Box
          component="img"
          src={TrafficCone}
          width="55%"
          position="absolute"
          bottom="-14%"
          right="-10%"
          draggable={false}
        />
        <Box
          component="img"
          src={TrafficCone}
          width="55%"
          position="absolute"
          bottom="-20%"
          left="-20%"
          draggable={false}
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
          onClick={() => handleSendFeedbackClick()}
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
  );
};

export default NotFoundError;
