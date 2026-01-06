import { Box, IconButton, Stack, useTheme } from "@mui/material";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";

const Header = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <>
      {/* 헤더 공간 차지용 div */}
      <Box minHeight="64px" flexShrink={0} />

      {/* 헤더 */}
      <Stack
        direction="row"
        width="100%"
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
    </>
  );
};

export default Header;
