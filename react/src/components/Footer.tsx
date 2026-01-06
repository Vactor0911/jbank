import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import BuyMeACoffee from "../assets/buy-me-a-coffee.webp";

const Footer = () => {
  return (
    <Stack mt="auto">
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
            개발자 커피 사주기
          </Typography>
        </Stack>
      </ButtonBase>
    </Stack>
  );
};

export default Footer;
