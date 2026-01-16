import { Stack, Tooltip, Typography, useTheme } from "@mui/material";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import Section, { type SectionProps } from "../../components/Section";

const AdsSection = (props: Omit<SectionProps, "label">) => {
  const theme = useTheme();

  return (
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
      {...props}
    >
      {/* 광고 콘텐츠 */}
      <Stack
        width="100%"
        justifyContent="center"
        alignItems="center"
        bgcolor={theme.palette.secondary.main}
        borderRadius={2}
        sx={{
          aspectRatio: "16 / 9",
        }}
      >
        <Typography variant="h4" color="text.secondary" textAlign="center">
          금방 추가되요.
          <br />
          조금만 기다려주세요!
        </Typography>
      </Stack>
    </Section>
  );
};

export default AdsSection;
