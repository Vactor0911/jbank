import { Paper, Stack } from "@mui/material";
import Tasks from "./Tasks";
import Ads from "./Ads";

const Home = () => {
  return (
    <Stack width="100%" gap={5}>
      <Stack direction="row" gap={5} flexWrap="wrap">
        {/* 빠른 작업 섹션 */}
        <Paper
          elevation={0}
          sx={{
            minWidth: "400px",
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
            minWidth: "400px",
            flex: 1,
            borderRadius: 5,
          }}
        >
          <Ads />
        </Paper>
      </Stack>

      <Stack direction="row" gap={5} flexWrap="wrap">
        {/* 빠른 작업 섹션 */}
        <Paper
          elevation={0}
          sx={{
            minWidth: "400px",
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
            minWidth: "400px",
            flex: 1,
            borderRadius: 5,
          }}
        >
          <Ads />
        </Paper>
      </Stack>

      <Stack direction="row" gap={5} flexWrap="wrap">
        {/* 빠른 작업 섹션 */}
        <Paper
          elevation={0}
          sx={{
            minWidth: "400px",
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
            minWidth: "400px",
            flex: 1,
            borderRadius: 5,
          }}
        >
          <Ads />
        </Paper>
      </Stack>

      <Stack direction="row" gap={5} flexWrap="wrap">
        {/* 빠른 작업 섹션 */}
        <Paper
          elevation={0}
          sx={{
            minWidth: "400px",
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
            minWidth: "400px",
            flex: 1,
            borderRadius: 5,
          }}
        >
          <Ads />
        </Paper>
      </Stack>

      <Stack direction="row" gap={5} flexWrap="wrap">
        {/* 빠른 작업 섹션 */}
        <Paper
          elevation={0}
          sx={{
            minWidth: "400px",
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
            minWidth: "400px",
            flex: 1,
            borderRadius: 5,
          }}
        >
          <Ads />
        </Paper>
      </Stack>
    </Stack>
  );
};

export default Home;
