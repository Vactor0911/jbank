import {
  Box,
  ClickAwayListener,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import SectionContainer from "./SectionContainer";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import { useState } from "react";

const AdsContainer = () => {
  const theme = useTheme();

  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <SectionContainer>
      <Stack p={1.5} px={2} gap={1}>
        {/* 라벨 컨테이너 */}
        <Stack direction="row" alignItems="center" gap={1}>
          {/* 라벨 */}
          <Typography variant="h6">Ads</Typography>

          {/* 도움말 */}
          <ClickAwayListener onClickAway={() => setTooltipOpen(false)}>
            <Tooltip
              open={tooltipOpen}
              onClose={() => setTooltipOpen(false)}
              onClick={() => setTooltipOpen(true)}
              placement="right"
              leaveDelay={3000}
              title="광고 관련 정보입니다."
              disableFocusListener
            >
              <HelpOutlineRoundedIcon
                sx={{
                  color: theme.palette.text.secondary,
                }}
              />
            </Tooltip>
          </ClickAwayListener>
        </Stack>

        {/* 광고 콘텐츠 */}
        <Box
          height={"250px"}
          bgcolor={theme.palette.secondary.main}
          borderRadius={2}
        />
      </Stack>
    </SectionContainer>
  );
};

export default AdsContainer;
