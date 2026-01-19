import {
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import JbankIcon from "../../assets/logo/icon.svg?react";
import InfoOutlineRoundedIcon from "@mui/icons-material/InfoOutlineRounded";
import { useCallback, useState } from "react";

interface ProductInfoProps {
  onNext: () => void;
}

const ProductInfo = (props: ProductInfoProps) => {
  const { onNext } = props;

  const [confirmed, setConfirmed] = useState(false);

  // 계좌 만들기 클릭 핸들러
  const handleCreateAccountClick = useCallback(() => {
    onNext();
  }, [onNext]);

  return (
    <>
      {/* 스크롤 컨테이너 */}
      <Box flex={1} overflow="auto" mt={2}>
        <Stack gap={3}>
          {/* 은행 정보 */}
          <Stack direction="row" gap={3}>
            <Stack flex={1} gap={0.5}>
              {/* 은행 이름 */}
              <Typography variant="h5">Jbank</Typography>

              {/* 계좌 유형 */}
              <Typography variant="body1">일반 예금</Typography>
            </Stack>

            {/* 은행 로고 */}
            <JbankIcon
              css={{
                width: "64px",
                height: "64px",
                borderRadius: "8px",
              }}
            />
          </Stack>

          {/* 이자율 */}
          <Stack>
            <Typography variant="body2" color="text.secondary">
              이자율
            </Typography>
            <Typography variant="body1" color="primary" fontWeight={500}>
              이자 없음
            </Typography>
          </Stack>

          {/* 구분선 */}
          <Divider
            sx={{
              my: 2,
            }}
          />

          {/* 상품 안내 */}
          <Stack gap={3}>
            <Typography variant="body1" fontWeight="bold">
              상품 안내
            </Typography>

            {/* 상품 정보 */}
            <Grid container spacing={3}>
              {/* 상품명 */}
              <Grid size={3}>
                <Typography variant="body1" fontWeight={500}>
                  상품명
                </Typography>
              </Grid>
              <Grid size={9}>
                <Typography variant="body1">Jbank 예금 계좌</Typography>
              </Grid>

              {/* 가입대상 */}
              <Grid size={3}>
                <Typography variant="body1" fontWeight={500}>
                  가입대상
                </Typography>
              </Grid>
              <Grid size={9}>
                <Typography variant="body1">
                  Jellen 서버 유저 (1인 1계좌)
                </Typography>
              </Grid>

              {/* 계약기간 */}
              <Grid size={3}>
                <Typography variant="body1" fontWeight={500}>
                  계약기간
                </Typography>
              </Grid>
              <Grid size={9}>
                <Typography variant="body1">무기한</Typography>
              </Grid>
            </Grid>
          </Stack>

          {/* 구분선 */}
          <Divider
            sx={{
              my: 2,
            }}
          />

          {/* 유의사항 */}
          <Typography variant="body1" color="text.secondary">
            <InfoOutlineRoundedIcon
              sx={{
                fontSize: "1em",
                mr: 0.5,
                transform: "translateY(0.15em)",
              }}
            />
            Jellen 서버와 연동된 가상의 계좌로, 실제 금전과는 무관해요.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <InfoOutlineRoundedIcon
              sx={{
                fontSize: "1em",
                mr: 0.5,
                transform: "translateY(0.15em)",
              }}
            />
            Jellen 서버에서 차단될 경우, 계좌도 함께 해지될 수 있어요.
          </Typography>

          {/* 약관 동의 버튼 */}
          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              mb: 5,
              p: 0.5,
              bgcolor: "action.disabledBackground",
              borderRadius: 2,
              cursor: "pointer",
            }}
            onClick={() => setConfirmed((prev) => !prev)}
          >
            <Stack direction="row" alignItems="center">
              <Checkbox checked={confirmed} />
              <Typography variant="body1">
                위 내용을 충분히 확인하고 동의했어요
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Box>

      {/* 계좌 만들기 버튼 */}
      <Stack
        width="100%"
        height="64px"
        justifyContent="center"
        position={{
          xs: "fixed",
          md: "static",
        }}
        bottom="64px"
        left={0}
        mt="auto"
        px={{
          xs: 3,
          md: 0,
        }}
      >
        <Button
          variant="contained"
          disableElevation
          fullWidth
          sx={{
            p: 1.5,
            borderRadius: 2,
          }}
          disabled={!confirmed}
          onClick={handleCreateAccountClick}
        >
          <Typography variant="h5">
            {confirmed ? "계좌 만들기" : "약관에 동의해주세요"}
          </Typography>
        </Button>
      </Stack>
    </>
  );
};

export default ProductInfo;
