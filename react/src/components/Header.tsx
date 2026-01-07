import { IconButton, Stack, useTheme } from "@mui/material";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import { useAtomValue } from "jotai";
import { isScrollOnTopAtom } from "../states";

const Header = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // 스크롤이 최상단에 있는지 여부
  const isScrollOnTop = useAtomValue(isScrollOnTopAtom);

  return (
    <Stack
      direction="row"
      width={{
        xs: "100vw",
        md: "calc(100vw - 314px)",
      }}
      height="64px"
      justifyContent="flex-end"
      alignItems="center"
      p={1}
      gap={0.5}
      position="fixed"
      top={0}
      right={0}
      bgcolor="#F6F7F9"
      zIndex={1000}
      borderBottom={`1px solid ${theme.palette.divider}`}
      borderColor={isScrollOnTop ? "transparent" : theme.palette.divider}
      sx={{
        transition: "border-color 0.15s ease",
      }}
    >
      {/* 언어 변경 버튼 */}
      <IconButton>
        <LanguageRoundedIcon
          sx={{
            fontSize: 32,
          }}
        />
      </IconButton>

      {/* 테마 변경 버튼 */}
      <IconButton>
        {isDarkMode ? (
          <DarkModeRoundedIcon
            sx={{
              fontSize: 32,
            }}
          />
        ) : (
          <LightModeRoundedIcon
            sx={{
              fontSize: 32,
            }}
          />
        )}
      </IconButton>

      {/* 알림 버튼 */}
      <IconButton>
        <NotificationsNoneRoundedIcon
          sx={{
            fontSize: 32,
          }}
        />
      </IconButton>
    </Stack>
  );
};

export default Header;
