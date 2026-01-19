import { Stack } from "@mui/material";
import LinkedSectionContainer from "../../components/LinkedSectionContainer";
import AccountSection from "./AccountSection";
import Section from "../../components/Section";
import AdsSection from "./AdsSection";

const Home = () => {
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
      <AdsSection
        sx={{
          minWidth: "400px",
          flex: 1,
        }}
      />
    </Stack>
  );
};

export default Home;
