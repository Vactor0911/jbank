import { ButtonBase, Stack, Typography } from "@mui/material";
import type { TransactionData } from "../../services/transactionService";
import { useNavigate } from "react-router";
import { formatDateToLocal, formatNumberString } from "../../utils";
import { useCallback } from "react";
import type { AccountData } from "../../services/accountService";

interface TransactionButtonProps {
  transaction: TransactionData;
  accountData: AccountData | null;
}

const TransactionButton = (props: TransactionButtonProps) => {
  const { transaction, accountData } = props;

  const navigate = useNavigate();

  // 거래내역이 수신 거래인지 여부 확인
  const isReceivedTransaction = useCallback(
    (transaction: TransactionData) => {
      return transaction.receiver.accountNumber === accountData?.accountNumber;
    },
    [accountData]
  );

  return (
    <ButtonBase
      sx={{
        width: "100%",
        p: 0.5,
        px: 1,
        borderRadius: 2,
        overflow: "hidden",
      }}
      onClick={() => navigate("/transaction/transaction-uuid")}
    >
      <Stack direction="row" width="100%" gap={3}>
        {/* 날짜 */}
        <Typography
          variant="body2"
          fontWeight={500}
          color="text.secondary"
          mt="0.4em"
        >
          {formatDateToLocal(transaction.createdAt, {
            month: "2-digit",
            day: "2-digit",
          })
            .replace(". ", ".")
            .slice(0, -1)}
        </Typography>

        {/* 거래 정보 */}
        <Stack flexShrink={1} minWidth={0}>
          {/* 상대 계좌 예금주 */}
          <Typography variant="h6" fontWeight={600} noWrap textAlign="left">
            {isReceivedTransaction(transaction)
              ? transaction.sender.steamName
              : transaction.receiver.steamName}
          </Typography>

          {/* 거래 시각 */}
          <Typography variant="body2" color="text.secondary" textAlign="left">
            {formatDateToLocal(transaction.createdAt, {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }).slice(-5)}
          </Typography>
        </Stack>

        {/* 거래 금액 */}
        <Stack flex={1}>
          {/* 거래 금액 */}
          <Typography
            variant="h6"
            fontWeight={600}
            color={isReceivedTransaction(transaction) ? "primary" : "inherit"}
            noWrap
            textAlign="right"
          >
            <span
              css={{
                display: isReceivedTransaction(transaction) ? "none" : "inline",
              }}
            >
              -
            </span>
            {transaction.amount.toLocaleString("en-US")} 크레딧
          </Typography>

          {/* 거래 후 잔액 */}
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            textAlign="right"
          >
            {isReceivedTransaction(transaction)
              ? formatNumberString(transaction.receiver.currentBalance)
              : formatNumberString(transaction.sender.currentBalance)}{" "}
            크레딧
          </Typography>
        </Stack>
      </Stack>
    </ButtonBase>
  );
};

export default TransactionButton;
