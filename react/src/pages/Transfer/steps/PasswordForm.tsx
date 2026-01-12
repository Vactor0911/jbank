import {
  Box,
  IconButton,
  Input,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  isTransferLoadingAtom,
  isTransferSuccessAtom,
  transferDataAtom,
} from "../../../states/transfer";
import { useSetAtom } from "jotai";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useCallback, useRef, useState } from "react";

const PasswordForm = () => {
  const theme = useTheme();

  const setTransferData = useSetAtom(transferDataAtom);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [isPasswordInputFocused, setIsPasswordInputFocused] = useState(false);
  const setIsTransferLoading = useSetAtom(isTransferLoadingAtom);

  // TODO: 테스트용
  const setIsTransferSuccess = useSetAtom(isTransferSuccessAtom);

  // 뒤로가기 핸들러
  const handleBackClick = useCallback(() => {
    // 이미 비밀번호를 다 입력한 상태라면 뒤로가지 않음
    if (password.length >= 4) {
      return;
    }

    // 이전 화면으로 이동
    setTransferData((prev) => ({
      fromAccountNumber: prev.fromAccountNumber,
      toAccountNumber: prev.toAccountNumber,
      amount: prev.amount,
    }));
  }, [password.length, setTransferData]);

  // 비밀번호 입력 핸들러
  const handlePasswordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // 4자리 제한
      if (event.target.value.length > 4) {
        event.target.blur();
        return;
      }

      // 백스페이스시 가장 마지막 문자 제거
      if (event.target.value.length < password.length) {
        setPassword((prev) => prev.slice(0, -1));
        return;
      }

      // 숫자만 허용
      const rawValue = event.target.value.replace(/-/g, "");
      if (!/^\d*$/.test(rawValue)) {
        return;
      }

      setPassword(rawValue);

      // 4자리 입력 시 포커스 해제 후 다음 단계로 이동
      if (rawValue.length >= 4) {
        event.target.blur();
        setTransferData((prev) => ({
          ...prev,
          password: rawValue,
        }));
        setIsTransferLoading(true);
        setTimeout(() => {
          setIsTransferLoading(false);
          setIsTransferSuccess(true);
        }, 2000);
      }
    },
    [
      password.length,
      setIsTransferLoading,
      setIsTransferSuccess,
      setTransferData,
    ]
  );

  return (
    <Stack
      gap={5}
      flex={1}
      onClick={() => {
        passwordInputRef.current?.focus();
      }}
    >
      {/* 뒤로가기 버튼 */}
      <IconButton
        sx={{
          p: 0,
          alignSelf: "flex-start",
          transform: "translateX(-10px)",
        }}
        onClick={handleBackClick}
      >
        <ArrowBackRoundedIcon fontSize="large" />
      </IconButton>

      {/* 계좌 비밀번호 입력 */}
      <Stack
        my={5}
        flex={1}
        justifyContent="center"
        alignItems="center"
        gap={1}
      >
        {/* 계좌 비밀번호 입력 문구 */}
        <Typography variant="h5" fontWeight={500}>
          계좌 비밀번호를 눌러주세요
        </Typography>

        {/* 비밀번호 입력란 */}
        <Box position="relative">
          {/* 실제 입력란 */}
          <Input
            inputRef={passwordInputRef}
            value={password}
            onChange={handlePasswordChange}
            autoFocus
            onFocus={() => setIsPasswordInputFocused(true)}
            onBlur={() => setIsPasswordInputFocused(false)}
            disabled={password.length >= 4}
            slotProps={{
              input: {
                type: "text",
                inputMode: "numeric",
                sx: {
                  width: "6em",
                  fontSize: "2em",
                },
              },
            }}
            sx={{
              opacity: 0,
            }}
          />

          {/* 가상 입력란 */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            position="absolute"
            width="100%"
            height="100%"
            top={0}
            left={0}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Box
                key={`password-indicator-${index}`}
                width="1.25em"
                borderRadius="50%"
                bgcolor={
                  password.length > index
                    ? theme.palette.text.primary
                    : theme.palette.action.disabled
                }
                sx={{
                  aspectRatio: "1 / 1",
                  transform:
                    password.length > index ? "scale(1.2)" : "scale(1)",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* 비밀번호 입력란 문구 */}
        {isPasswordInputFocused && (
          <Typography variant="body2" color="text.secondary">
            비밀번호를 입력 받고 있어요.
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default PasswordForm;
