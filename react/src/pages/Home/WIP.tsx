import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import TrafficCone from "../../assets/traffic-cone.svg";

const WIP = () => {
  const theme = useTheme();

  return (
    <Stack height="100%" justifyContent="center" alignItems="center" gap={4}>
      {/* 로고 */}
      <Box width="250px" height="250px" position="relative" mx="auto" my={5}>
        <Avatar
          variant="rounded"
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: theme.palette.primary.main,
            fontWeight: "bold",
            fontSize: "10em",
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
