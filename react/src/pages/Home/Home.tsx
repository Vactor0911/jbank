import { Paper, Stack } from "@mui/material";
import Tasks from "./Tasks";

const Home = () => {
  return (
    <Stack height="100%" gap={5}>
      {/* Jbank 소개 섹션 */}
      <Paper
        elevation={0}
        sx={{
          dispay: "flex",
          flex: 1,
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
      </Paper>

      {/* 2행 */}
      <Stack direction="row" flex={1} gap={5}>
        {/* 빠른 작업 섹션 */}
        <Paper
          elevation={0}
          sx={{
            dispay: "flex",
            flex: 1,
            borderRadius: 5,
          }}
        >
          <Tasks />
        </Paper>

        {/* 광고 섹션 */}
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
  );
};

export default Home;
