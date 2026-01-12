import {
  Box,
  Button,
  ButtonBase,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import LinkedSectionContainer from "../../components/LinkedSectionContainer";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import JbankIcon from "../../assets/logo/icon.svg?react";
import AccountService from "../../services/accountService";
import { useAtomValue } from "jotai";
import { accountDataAtom } from "../../states/account";

const AccountSection = () => {
  const navigate = useNavigate();

  const accountData = useAtomValue(accountDataAtom);

  // 페이지 로드 시 계좌 목록 조회
  useEffect(() => {
    const fetchAccountList = async () => {
      await AccountService.fetchAccounts();
    };

    fetchAccountList();
  }, []);

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
          <Chip variant="filled" label={accountData.length} size="small" />

          {/* 크레딧 정보 */}
          <Stack
            flex={1}
            direction="row"
            alignItems="center"
            overflow="hidden"
            gap="0.5em"
            ml={2}
            sx={{
              opacity: accountData.length ? 1 : 0,
            }}
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
              {accountData[0]?.credit || "0"}
            </Typography>

            {/* 크레딧 문구 */}
            <Typography variant="body2" fontWeight="bold" noWrap>
              크레딧
            </Typography>
          </Stack>
        </Stack>
      }
      linkTo={
        accountData.length > 0
          ? `/account/${accountData[0]?.uuid}`
          : "/account/new"
      }
    >
      {/* Jbank 계좌 */}
      {accountData.length > 0 ? (
        accountData.map((account, index) => (
          <ButtonBase
            key={`account-${index}`}
            sx={{
              width: "100%",
              p: 0.5,
              px: 1,
              borderRadius: 2,
            }}
            onClick={() => navigate(`/account/${account.uuid}`)}
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
                    {account.credit || "0"}
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
                  Jbank {account.accountNumber}
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
        ))
      ) : (
        <Stack alignItems="center" gap={2} p={2}>
          <JbankIcon
            css={{
              width: "96px",
              height: "96px",
              borderRadius: "8px",
            }}
          />

          <Typography variant="h6" fontWeight={500} color="text.secondary">
            개설된 계좌가 없어요.
          </Typography>

          <Box>
            <Button
              variant="contained"
              onClick={() => navigate("/account/new")}
            >
              <Typography variant="h6">계좌 만들러 가기</Typography>
            </Button>
          </Box>
        </Stack>
      )}
    </LinkedSectionContainer>
  );
};

export default AccountSection;
