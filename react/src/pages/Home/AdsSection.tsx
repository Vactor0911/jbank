import { Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import Section from "../../components/Section";

const AdsSection = () => {
  const theme = useTheme();

  return (
    <Section
      label={
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="h6">광고</Typography>

          {/* 도움말 */}
          <Tooltip
            title="사용자가 직접 등록한 광고가 표시되는 배너입니다."
            enterTouchDelay={0}
            leaveTouchDelay={3000}
            placement="right-start"
            disableFocusListener
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
      dense
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
  );
};

export default AdsSection;
