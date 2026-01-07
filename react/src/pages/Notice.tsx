import { Paper, Stack } from "@mui/material";
import PageWrapper from "../components/PageWrapper";

const Notice = () => {
  return (
    <PageWrapper>
      <Stack height="100%" gap={5}>
        <Paper
          elevation={0}
          sx={{
            dispay: "flex",
            flex: 1,
            borderRadius: 5,
          }}
        >
          <Stack width="100%" height="100%"></Stack>
        </Paper>
        <Stack direction="row" flex={1} gap={5}>
          <Paper
            elevation={0}
            sx={{
              dispay: "flex",
              flex: 1,
              borderRadius: 5,
            }}
          >
            <Stack width="100%" height="100%"></Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              dispay: "flex",
              flex: 1,
              borderRadius: 5,
            }}
          >
            <Stack width="100%" height="100%"></Stack>
          </Paper>
        </Stack>
      </Stack>
    </PageWrapper>
  );
};

export default Notice;
