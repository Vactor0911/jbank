import {
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useIsMobile } from "../hooks";
import SteamLogo from "../assets/steam.svg?react";
import JbankIcon from "../assets/logo/icon.svg?react";
import { useCallback, useEffect } from "react";
import AuthService from "../services/authService";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserService from "../services/userService";
import { enqueueSnackbar } from "notistack";

const Login = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Steam 로그인 버튼 클릭
  const handleSteamLoginClick = useCallback(() => {
    AuthService.loginWithSteam();
  }, []);

  // 로그인 성공 처리
  const handleLoginSuccess = useCallback(async () => {
    if (!code) {
      return;
    }

    // 서버에서 토큰 교환
    const success = await AuthService.handleLoginSuccess(code);
    if (success) {
      // 사용자 정보 불러오기
      await UserService.fetchMe();

      // 메인 페이지로 이동
      navigate("/");
      return;
    } else {
      enqueueSnackbar(
        <>
          로그인에 실패했어요.
          <br />
          다시 시도해주세요.
        </>,
        { variant: "error" },
      );
      navigate("/login");
    }
  }, [code, navigate]);

  // 페이지 로드 시 로그인 성공 또는 실패 처리
  useEffect(() => {
    if (code) {
      handleLoginSuccess();
    } else if (error) {
      switch (error) {
        case "account_deleted":
          enqueueSnackbar(
            <>
              삭제된 계정이에요.
              <br />
              관리자에게 문의해주세요.
            </>,
            { variant: "error" },
          );
          break;
        case "account_banned":
          enqueueSnackbar(
            <>
              차단된 계정이에요.
              <br />
              관리자에게 문의해주세요.
            </>,
            { variant: "error" },
          );
          break;
        default:
          enqueueSnackbar(
            <>
              로그인에 실패했어요.
              <br />
              다시 시도해주세요.
            </>,
            { variant: "error" },
          );
          break;
      }

      // 로그인 페이지로 리다이렉트
      navigate("/login");
    }
  }, [code, error, handleLoginSuccess, navigate]);

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: "calc(100dvh - 128px)",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: {
          xs: 2,
          md: 5,
        },
        overflow: "hidden",
        bgcolor: isMobile ? "transparent" : "background.paper",
      }}
    >
      <Container maxWidth="xs">
        <Stack
          justifyContent="space-between"
          height="calc(100dvh - 128px)"
          py={3}
        >
          {/* 여백용 div */}
          <div />

          <Stack gap={5} justifyContent="center" alignItems="center">
            {/* Jbank 로고 */}
            <JbankIcon
              css={{
                width: "128px",
                height: "128px",
                borderRadius: "10px",
              }}
            />

            {/* 슬로건 */}
            <Stack alignItems="center" gap={1.5}>
              <Typography
                variant="h5"
                textAlign="center"
                sx={{
                  textWrap: "pretty",
                }}
              >
                게임을 뛰어넘는 포인트 거래 시스템
              </Typography>
              <Typography variant="h6" textAlign="center">
                포인트의 새로운 세상을 열다
              </Typography>
            </Stack>

            {/* 구분선 */}
            <Divider flexItem />

            {/* 스팀 로그인 버튼 */}
            <Button
              variant="contained"
              fullWidth
              disableElevation
              sx={{
                bgcolor: "#171A21",
                textTransform: "none",
                borderRadius: 2,
              }}
              onClick={handleSteamLoginClick}
            >
              <Stack
                width="100%"
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={3}
              >
                <Typography>Login with Steam</Typography>

                {/* 스팀 로고 */}
                <Stack bgcolor="white" borderRadius="50%">
                  <SteamLogo
                    css={{
                      width: "32px",
                      height: "32px",
                      fill: "#171A21",
                      transform: "scale(1.05)",
                    }}
                  />
                </Stack>
              </Stack>
            </Button>
          </Stack>

          {/* 서비스 이용 동의 명시 */}
          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
            sx={{
              textWrap: "balance",
            }}
          >
            Jbank 서비스를 이용함으로써 이용약관 및 개인정보처리방침에 동의하는
            것으로 간주됩니다.
          </Typography>
        </Stack>
      </Container>
    </Paper>
  );
};

export default Login;
