import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useCallback, useState } from "react";

const NavigationBar = () => {
  const [navigationValue, setNavigationValue] = useState(0);

  const handleNavigationChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setNavigationValue(newValue);
    },
    []
  );

  return (
    <Paper elevation={2}>
      <BottomNavigation
        showLabels
        value={navigationValue}
        onChange={handleNavigationChange}
        sx={{
          minWidth: {
            xs: "100vw",
            md: "56px",
          },
          height: {
            xs: "64px",
            md: "100vh",
          },
          pt: {
            xs: 0,
            md: 2,
          },
          px: {
            xs: 0,
            md: 1.5,
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
            borderRadius: 2,
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
  );
};

export default NavigationBar;
