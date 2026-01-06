import { Box, Stack, Typography } from "@mui/material";
import PageWrapper from "../components/PageWrapper";

const Home = () => {
  return (
    <PageWrapper>
      <Stack>
        <Typography variant="h4">Welcome to JBank</Typography>

        <Box height="2000px" />
      </Stack>
    </PageWrapper>
  );
};

export default Home;
