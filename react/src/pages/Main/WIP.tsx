import { Box, Stack, Typography, useTheme } from "@mui/material";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import TrafficCone from "../../assets/traffic-cone.svg";

const WIP = () => {
  const theme = useTheme();

  return (
    <Stack
      height="calc(100% - 64px)"
      justifyContent="center"
      alignItems="center"
      gap={4}
    >
      {/* 로고 */}
      <Box width="250px" height="250px" position="relative" mx="auto" my={5}>
        <Box
          width="100%"
          height="100%"
          bgcolor={theme.palette.text.secondary}
        />

        {/* 공사 아이콘 */}
        <ConstructionRoundedIcon
          sx={{
            position: "absolute",
            top: "0",
            right: "0",
            transform: "rotate(15deg)",
            fontSize: "120px",
            color: theme.palette.text.primary,
          }}
        />
        <Box
          component="img"
          src={TrafficCone}
          width="140px"
          position="absolute"
          bottom={0}
          left={0}
          sx={{
            transform: "translate(-40%, 25%)",
          }}
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
