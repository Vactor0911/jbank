import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useCallback, useState } from "react";

const Navigation = () => {
  const theme = useTheme();

  const [navigationValue, setNavigationValue] = useState(0);

  // 모바일 환경 여부
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // 네비게이션 변경 핸들러
  const handleNavigationChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setNavigationValue(newValue);
    },
    []
  );

  return (
    <>
      {/* 모바일 환경 공간 차지용 div */}
      {isMobile && <Box width="100vw" height="64px" />}

      {/* 네비게이션 바 */}
      <Paper
        elevation={2}
        sx={{
          position: {
            xs: "fixed",
            md: "relative",
          },
          bottom: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <BottomNavigation
          showLabels
          value={navigationValue}
          onChange={handleNavigationChange}
          sx={{
            width: {
              xs: "100vw",
              md: "64px",
            },
            height: {
              xs: "64px",
              md: "100dvh",
            },
            p: {
              xs: 0,
              md: "16px 12px",
            },
            flexDirection: {
              xs: "row",
              md: "column",
            },
            justifyContent: {
              xs: "space-evenly",
              md: "flex-start",
            },
            alignItems: "center",
            gap: {
              xs: 0,
              md: 1,
            },
            // 버튼
            "& .MuiButtonBase-root": {
              flex: 0,
              width: "auto",
              minWidth: {
                xs: "auto",
                md: "0",
              },
              padding: {
                xs: "0 8px",
                md: "8px",
              },
              fontWeight: "bold",
              borderRadius: {
                xs: 2,
                md: 3,
              },
            },
            // 버튼 라벨
            "& .MuiBottomNavigationAction-label.Mui-selected": {
              fontSize: "0.75rem",
            },
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<HomeRoundedIcon fontSize="large" />}
          />
          <BottomNavigationAction
            label="Home"
            icon={<HomeRoundedIcon fontSize="large" />}
          />
          <BottomNavigationAction
            label="Home"
            icon={<HomeRoundedIcon fontSize="large" />}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default Navigation;
