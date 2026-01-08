import {
  ButtonBase,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Section from "../components/Section";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

const Notice = () => {
  const theme = useTheme();

  return (
    <Section
      label="공지사항"
      sx={{
        mt: {
          xs: 2,
          md: 0,
        },
      }}
    >
      <Stack
        borderRadius={5}
        overflow="hidden"
        border={`1px solid ${theme.palette.divider}`}
        divider={
          <Divider
            flexItem
            sx={{
              borderWidth: "1px",
              opacity: 0.3,
            }}
          />
        }
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <ButtonBase
            key={`notice=-${index}`}
            sx={{
              textAlign: "left",
            }}
          >
            <Stack
              width="100%"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={3}
              p={1}
              px={2}
            >
              {/* 공지사항 정보 */}
              <Stack flex={1}>
                {/* 제목 */}
                <Typography variant="h6" noWrap>
                  공지사항 제목 어쩌구 저쩌구
                </Typography>

                {/* 작성일자 */}
                <Typography variant="body2" color="text.secondary" noWrap>
                  2026년 01월 01일
                </Typography>
              </Stack>

              {/* 화살표 아이콘 */}
              <NavigateNextRoundedIcon />
            </Stack>
          </ButtonBase>
        ))}
      </Stack>
    </Section>
  );
};

export default Notice;
