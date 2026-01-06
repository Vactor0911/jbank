import {
  Avatar,
  Button,
  ButtonBase,
  Chip,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import LinkButtonContainer from "./LinkButtonContainer";
import { useState } from "react";

const AccountLinkButtonContainer = () => {
  const theme = useTheme();

  const [credits] = useState("1,234,567,123,123,132");

  return (
    <LinkButtonContainer
      label={
        <Stack
          direction="row"
          flex={1}
          alignItems="center"
          gap={1}
          overflow="hidden"
        >
          {/* 라벨 */}
          <Typography variant="h6">계좌</Typography>

          {/* 계좌 수 */}
          <Chip variant="filled" label={2} size="small" />

          {/* 크레딧 정보 */}
          <Stack
            flex={1}
            direction="row"
            alignItems="center"
            overflow="hidden"
            gap="0.5em"
            ml={2}
          >
            {/* 보유 크레딧 */}
            <Typography
              variant="body2"
              fontWeight="bold"
              flex={1}
              noWrap
              overflow="hidden"
              textAlign="right"
            >
              {credits}
            </Typography>

            {/* 크레딧 문구 */}
            <Typography variant="body2" fontWeight="bold" noWrap>
              크레딧
            </Typography>
          </Stack>
        </Stack>
      }
      linkTo="/accounts"
    >
      {/* Jbank 계좌 */}
      <ButtonBase
        sx={{
          width: "100%",
          p: 0.5,
          px: 1,
          borderRadius: 2,
        }}
        onClick={() => console.log("계좌 버튼 클릭")}
      >
        <Stack direction="row" width="100%" alignItems="center" gap={2}>
          {/* Jbank 아이콘 */}
          <Avatar
            sx={{
              width: "32px",
              height: "32px",
              bgcolor: theme.palette.primary.main,
              fontWeight: "bold",
            }}
            variant="rounded"
          >
            J
          </Avatar>

          {/* 계좌 정보 */}
          <Stack alignItems="flex-start" flex={1} overflow="hidden">
            {/* 은행명 */}
            <Typography variant="body1" color="text.secondary">
              Jbank
            </Typography>

            {/* 계좌 잔액 */}
            <Stack
              width="100%"
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              overflow="hidden"
              gap="0.5em"
            >
              {/* 보유 크레딧 */}
              <Typography
                variant="body2"
                fontWeight="bold"
                noWrap
                overflow="hidden"
              >
                {credits}
              </Typography>

              {/* 크레딧 문구 */}
              <Typography
                variant="body2"
                textAlign="left"
                fontWeight="bold"
                noWrap
                flexShrink={0}
              >
                크레딧
              </Typography>
            </Stack>
          </Stack>

          {/* 송금 버튼 */}
          <Button
            component="span"
            variant="contained"
            color="secondary"
            disableElevation
            sx={{
              p: "6px 12px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log("송금 버튼 클릭");
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            송금
          </Button>
        </Stack>
      </ButtonBase>
    </LinkButtonContainer>
  );
};

export default AccountLinkButtonContainer;
