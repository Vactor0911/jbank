import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import AdsClickRoundedIcon from "@mui/icons-material/AdsClickRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import { useAtom } from "jotai";
import { navigationValueAtom } from "../states";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [navigationValue, setNavigationValue] = useAtom(navigationValueAtom);

  // 네비게이션 변경 핸들러
  const handleNavigationChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setNavigationValue(newValue);

      // 홈 화면으로 이동
      if (location.pathname !== "/") {
        navigate("/");
      }
    },
    [location.pathname, navigate, setNavigationValue]
  );

  return (
    <Paper
      elevation={2}
      sx={{
        position: "relative",
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
        {/* 홈 */}
        <BottomNavigationAction
          label="홈"
          icon={<HomeRoundedIcon fontSize="large" />}
        />

        {/* ATM */}
        <BottomNavigationAction
          label="ATM"
          icon={<LocalAtmIcon fontSize="large" />}
        />

        {/* 광고 */}
        <BottomNavigationAction
          label="광고"
          icon={<AdsClickRoundedIcon fontSize="large" />}
        />

        {/* 개발자 */}
        <BottomNavigationAction
          label="개발자"
          icon={<DevicesRoundedIcon fontSize="large" />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Navigation;
