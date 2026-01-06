import { Stack, Typography } from "@mui/material";
import LinkedSectionContainer from "../../components/LinkedSectionContainer";
import AccountSection from "../../components/sections/AccountSection";

const Tasks = () => {
  return (
    <Stack height="100%" gap={3} p={3}>
      {/* 헤더 */}
      <Typography variant="h6">빠른 작업</Typography>

      {/* 송금하기 */}
      <LinkedSectionContainer label="송금하기" linkTo="/transfer" />

      {/* 계좌 */}
      <AccountSection />
    </Stack>
  );
};

export default Tasks;
