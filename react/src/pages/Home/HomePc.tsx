import { Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import LinkedSectionContainer from "../../components/LinkedSectionContainer";
import AccountSection from "./AccountSection";
import Section from "../../components/Section";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

const Home = () => {
  const theme = useTheme();

  return (
    <Stack direction="row" width="100%" gap={5} flexWrap="wrap">
      {/* 빠른 작업 */}
      <Section
        label="빠른 작업"
        sx={{
          minWidth: "400px",
          flex: 1,
        }}
      >
        {/* 송금하기 */}
        <LinkedSectionContainer label="송금하기" linkTo="/transfer" />

        {/* 계좌 */}
        <AccountSection />
      </Section>

      {/* 광고 */}
      <Section
        label={
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography variant="h6">광고</Typography>

            {/* 도움말 */}
            <Tooltip
              title="사용자가 직접 등록한 광고가 표시되는 배너입니다."
              placement="right-start"
              slotProps={{
                tooltip: {
                  sx: {
                    maxWidth: "200px",
                  },
                },
              }}
            >
              <HelpOutlineRoundedIcon
                sx={{
                  color: theme.palette.text.secondary,
                }}
              />
            </Tooltip>
          </Stack>
        }
        sx={{
          minWidth: "400px",
          flex: 1,
        }}
      >
        {/* 광고 콘텐츠 */}
        <Box
          width="100%"
          bgcolor={theme.palette.secondary.main}
          borderRadius={2}
          sx={{
            aspectRatio: "16 / 9",
          }}
        />
      </Section>
    </Stack>
  );
};

export default Home;
