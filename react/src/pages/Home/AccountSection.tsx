import { Button, ButtonBase, Chip, Stack, Typography } from "@mui/material";
import LinkedSectionContainer from "../../components/LinkedSectionContainer";
import { useState } from "react";
import { useNavigate } from "react-router";
import JbankIcon from "../../assets/logo/icon.svg?react";
import { useAtomValue } from "jotai";
import { accountDataAtom } from "../../states/account";

const AccountSection = () => {
  const navigate = useNavigate();

  const [credits] = useState("1,234,567,123,123,132");
  const accountData = useAtomValue(accountDataAtom);

  return (
    <LinkedSectionContainer
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
          <Chip variant="filled" label={1} size="small" />

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
      linkTo={`/account/${accountData?.uuid}`}
    >
      {/* Jbank 계좌 */}
      <ButtonBase
        sx={{
          width: "100%",
          p: 0.5,
          px: 1,
          borderRadius: 2,
        }}
        onClick={() => navigate(`/account/${accountData?.uuid}`)}
      >
        <Stack direction="row" width="100%" alignItems="center" gap={2}>
          {/* Jbank 아이콘 */}
          <JbankIcon
            css={{
              width: "36px",
              height: "36px",
              borderRadius: "4px",
            }}
          />

          {/* 계좌 정보 */}
          <Stack alignItems="flex-start" flex={1} overflow="hidden">
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

            {/* 은행명 */}
            <Typography variant="body1" color="text.secondary">
              Jbank {accountData?.accountNumber}
            </Typography>
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
              navigate("/transfer");
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            송금
          </Button>
        </Stack>
      </ButtonBase>
    </LinkedSectionContainer>
  );
};

export default AccountSection;
