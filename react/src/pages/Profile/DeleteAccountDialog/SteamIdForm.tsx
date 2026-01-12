import { useCallback, useState } from "react";
import UserService from "../../../services/userService";
import apiClient from "../../../services/axios";
import { useNavigate } from "react-router";
import { getDefaultStore, useAtomValue } from "jotai";
import { userDataAtom } from "../../../states";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  useTheme,
} from "@mui/material";

const SteamIdForm = () => {
  const navigate = useNavigate();
  const store = getDefaultStore();
  const theme = useTheme();

  const userData = useAtomValue(userDataAtom);

  // Steam 고유 번호 입력란 변경 핸들러
  const [steamId, setSteamId] = useState("");
  const handleSteamIdChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSteamId(event.target.value);
    },
    []
  );

  // 회원 탈퇴 핸들러
  const handleDeleteAccount = useCallback(async () => {
    await UserService.deleteAccount();
    apiClient.clearTokens();
    store.set(userDataAtom, null);
    navigate("/");
  }, [navigate, store]);

  return (
    <>
      {/* 제목 */}
      <DialogTitle>Steam 고유 번호 입력</DialogTitle>

      {/* 내용 */}
      <DialogContent dividers>
        <DialogContentText>
          계정 삭제를 위해 Steam 고유 번호를 입력해주세요.
        </DialogContentText>
        <DialogContentText
          variant="caption"
          sx={{
            mt: 2,
          }}
        >
          아래 입력란에{" "}
          <span css={{ color: theme.palette.primary.main, fontWeight: "bold" }}>
            {userData?.steamId}
          </span>
          를 입력해주세요.
        </DialogContentText>

        {/* Steam 고유 번호 입력란 */}
        <form>
          <TextField
            value={steamId}
            onChange={handleSteamIdChange}
            variant="standard"
            required
            fullWidth
            placeholder="Steam 고유 번호를 입력하세요."
          />
        </form>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          onClick={() => handleDeleteAccount()}
          disabled={steamId !== userData?.steamId}
        >
          계정 삭제
        </Button>
      </DialogActions>
    </>
  );
};

export default SteamIdForm;
