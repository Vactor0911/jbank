import { IconButton, Paper, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router";
import ProductInfo from "./ProductInfo";
import { useEffect, useState } from "react";
import PasswordForm from "./PasswordForm";
import PasswordConfirmForm from "./PasswordConfirmForm";
import CreateAccountLoading from "./CreateAccountLoading";
import CreateAccountSuccess from "./CreateAccountSuccess";
import CreateAccountFailed from "./CreateAccountFailed";
import AccountService from "../../services/accountService";
import { AxiosError } from "axios";

const AccountNew = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // 필드가 모두 채워지면 계좌 생성 요청
  useEffect(() => {
    // 단계 초기화 함수
    const setError = (message: string) => {
      console.error("계좌 개설 중 오류 발생:", message);
      setPassword("");
      setPasswordConfirm("");
      setErrorMessage(message);
      setIsSuccess(false);
      setStep(4);
    };

    const createAccount = async () => {
      // 계좌 생성 API 호출
      try {
        const response = await AccountService.createAccount(password);

        if (response.data.success) {
          // 계좌 생성 성공
          setIsSuccess(true);
          setStep(4);
        } else {
          setError(response.data.error || "알 수 없는 오류가 발생했습니다.");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Axios error:", error.response?.data.error);
          setError(
            error.response?.data.error || "알 수 없는 오류가 발생했습니다."
          );

          // 기존 계좌가 있을 수 있으므로 계좌 목록 새로고침
          await AccountService.fetchAccounts();
        }
      }
    };

    // 단계가 3일 때만 실행
    if (step !== 3) {
      return;
    }

    // 필드가 비어있으면 실행 중단
    if (!password || !passwordConfirm) {
      setError("비밀번호가 올바르지 않습니다.");
      return;
    }

    // 비밀번호와 비밀번호 확인이 다르면 실행 중단
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 계좌 개설 API 호출
    createAccount();
  }, [password, passwordConfirm, step]);

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: {
          xs: "100%",
          md: "500px",
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
          <Typography variant="h6">새 Jbank 계좌 개설</Typography>
        </Stack>

        {/* 계좌 상품 안내 단계 */}
        {step === 0 && <ProductInfo onNext={() => setStep(1)} />}
        {/* 계좌 비밀번호 입력 단계 */}
        {step === 1 && (
          <PasswordForm
            onNext={() => setStep(2)}
            submitPassword={setPassword}
          />
        )}
        {/* 계좌 비밀번호 재입력 단계 */}
        {step === 2 && (
          <PasswordConfirmForm
            onNext={() => setStep(3)}
            submitPassword={setPasswordConfirm}
          />
        )}
        {/* 로딩 단계 */}
        {step === 3 && <CreateAccountLoading />}
        {/* 성공 단계 */}
        {step === 4 && isSuccess && <CreateAccountSuccess />}
        {/* 실패 단계 */}
        {step === 4 && !isSuccess && (
          <CreateAccountFailed errorMessage={errorMessage} />
        )}
      </Stack>
    </Paper>
  );
};

export default AccountNew;
