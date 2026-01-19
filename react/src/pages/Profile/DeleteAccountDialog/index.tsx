import { Dialog, IconButton, type DialogProps } from "@mui/material";
import DeleteConfirmForm from "./DeleteConfirmForm";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useCallback, useState } from "react";
import SteamIdForm from "./SteamIdForm";

const DeleteAccountDialog = (props: DialogProps) => {
  const { open, onClose, ...other } = props;

  const [step, setStep] = useState(0);

  // 대화상자 닫기 핸들러
  const handleClose = useCallback(() => {
    if (onClose) {
      setStep(0);
      onClose({}, "backdropClick");
    }
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} {...other}>
      {/* 닫기 버튼 */}
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseRoundedIcon />
      </IconButton>

      {/* 내용 */}
      {step === 0 && (
        <DeleteConfirmForm onClose={handleClose} onConfirm={() => setStep(1)} />
      )}
      {step === 1 && <SteamIdForm />}
    </Dialog>
  );
};

export default DeleteAccountDialog;
