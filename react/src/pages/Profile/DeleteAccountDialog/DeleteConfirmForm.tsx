import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface DeleteConfirmFormProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmForm = (props: DeleteConfirmFormProps) => {
  const { onClose, onConfirm } = props;

  return (
    <>
      {/* 제목 */}
      <DialogTitle>계정을 삭제할까요?</DialogTitle>

      {/* 내용 */}
      <DialogContent dividers>
        <DialogContentText>
          한 번 삭제된 계정은 다시 복구할 수 없어요.
        </DialogContentText>
        <DialogContentText>계정 삭제를 진행할까요?</DialogContentText>
      </DialogContent>

      {/* 버튼 */}
      <DialogActions>
        <Button onClick={() => onClose()}>취소</Button>
        <Button variant="contained" onClick={() => onConfirm()}>
          예
        </Button>
      </DialogActions>
    </>
  );
};

export default DeleteConfirmForm;
