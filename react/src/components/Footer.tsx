import {
  Box,
  ButtonBase,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import BuyMeACoffee from "../assets/buy-me-a-coffee.webp";

const Footer = () => {
  const theme = useTheme();

  return (
    <Stack gap={3} mt={3}>
      {/* Buy me a coffee 버튼 */}
      <ButtonBase
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Stack
          direction="row"
          width="100%"
          justifyContent="center"
          alignItems="center"
          bgcolor="#FFDD00"
          p="4px 8px"
        >
          {/* 아이콘 */}
          <Box
            component="img"
            src={BuyMeACoffee}
            width="32px"
            sx={{
              transform: "translateX(-8px)",
            }}
          />

          {/* 텍스트 */}
          <Typography variant="body1" fontWeight="bold">
            개발자에게 커피 사주기
          </Typography>
        </Stack>
      </ButtonBase>

      {/* 모바일용 링크 버튼 컨테이너 */}
      <Stack
        display={{
          xs: "flex",
          md: "none",
        }}
        direction="row"
        divider={<Divider flexItem />}
        gap={1}
        bgcolor={theme.palette.secondary.main}
        p={1}
        borderRadius={2}
      >
        <ButtonBase
          sx={{
            flex: 1,
            borderRadius: 1.5,
          }}
        >
          <Typography variant="body1" textAlign="center" color="text.primary">
            로그아웃
          </Typography>
        </ButtonBase>

        <ButtonBase
          sx={{
            flex: 1,
            borderRadius: 1.5,
          }}
        >
          <Typography
            variant="body1"
            flex={1}
            textAlign="center"
            color="text.primary"
          >
            의견 보내기
          </Typography>
        </ButtonBase>
      </Stack>
    </Stack>
  );
};

export default Footer;
