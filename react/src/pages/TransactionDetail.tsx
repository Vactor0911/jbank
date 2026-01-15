import { Divider, IconButton, Paper, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useEffect, useState } from "react";
import TransactionService, {
  type TransactionData,
} from "../services/transactionService";
import { useAtomValue } from "jotai";
import { userDataAtom } from "../states";

const TransactionDetail = () => {
  const navigate = useNavigate();
  const { transactionUuid } = useParams<{ transactionUuid: string }>();

  const userData = useAtomValue(userDataAtom);
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);

  // 거래내역 데이터 불러오기
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await TransactionService.fetchTransaction(
          transactionUuid!
        );

        if (response.data.success) {
          const fetchedTransactionData: TransactionData =
            response.data.data.transaction;
          setTransactionData(fetchedTransactionData);
        }
      } catch (error) {
        console.error("Failed to fetch transaction data:", error);
      }
    };

    fetchTransactionData();
  }, [transactionUuid]);

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: {
          xs: "100%",
          md: "800px",
        },
        bgcolor: {
          xs: "transparent",
          md: "background.paper",
        },
        borderRadius: 5,
      }}
    >
      <Stack
        p={{
          xs: 0,
          md: 3,
        }}
        gap={3}
        height={{
          xs: "calc(100dvh - 196px)",
          md: "calc(100dvh - 128px)",
        }}
      >
        {/* 헤더 */}
        <Stack direction="row" alignItems="center">
          {/* 뒤로가기 버튼 */}
          <IconButton
            sx={{
              p: 0,
              transform: "translateX(-10px)",
            }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackRoundedIcon fontSize="large" />
          </IconButton>

          {/* 라벨 */}
          <Typography variant="h6">상세내역</Typography>
        </Stack>

        {/* 거래 개요 */}
        <Stack mt={5}>
          {/* 상대 계좌 예금주 */}
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            {transactionData?.sender.uuid === userData?.uuid
              ? transactionData?.receiver.steamName
              : transactionData?.sender.steamName}
          </Typography>

          {/* 거래 금액 */}
          <Typography variant="h3">
            {transactionData?.sender.uuid === userData?.uuid ? "-" : ""}
            {transactionData?.amount.toLocaleString()} 크레딧
          </Typography>
        </Stack>

        {/* 구분선 */}
        <Divider
          sx={{
            mt: "auto",
          }}
        />

        {/* 거래 상세 내역 */}
        <Stack gap={2}>
          {/* 입금처 */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignContent="center"
            flexWrap="wrap"
          >
            {/* 라벨 */}
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              입금처
            </Typography>

            {/* 계좌번호 */}
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              Jbank {transactionData?.receiver.accountNumber}
            </Typography>
          </Stack>

          {/* 출금처 */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignContent="center"
            flexWrap="wrap"
          >
            {/* 라벨 */}
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              출금처
            </Typography>

            {/* 계좌번호 */}
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              Jbank {transactionData?.sender.accountNumber}
            </Typography>
          </Stack>

          {/* 이체일시 */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignContent="center"
            flexWrap="wrap"
          >
            {/* 라벨 */}
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              이체일시
            </Typography>

            {/* 계좌번호 */}
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              {transactionData?.createdAt
                ? (() => {
                    const date = new Date(transactionData.createdAt);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    const hour = String(date.getHours()).padStart(2, "0");
                    const minute = String(date.getMinutes()).padStart(2, "0");
                    return `${year}년 ${month}월 ${day}일 ${hour}:${minute}`;
                  })()
                : "알 수 없음"}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default TransactionDetail;
