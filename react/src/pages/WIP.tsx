import { Box, Stack, Typography } from "@mui/material";
import TrafficCone from "../assets/traffic-cone.svg";
import JbankIcon from "../assets/logo/icon.svg?react";

const WIP = () => {
  return (
    <Stack justifyContent="center" alignItems="center" flex={1} gap={4}>
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

      <Typography variant="h3" textAlign="center">
        열심히 개발하는중!
      </Typography>

      <Typography
        variant="h6"
        color="text.secondary"
        textAlign="center"
        fontWeight={500}
      >
        곧 멋진 기능으로 찾아올게요.
        <br />
        조금만 기다려주세요!
      </Typography>
    </Stack>
  );
};

export default WIP;
