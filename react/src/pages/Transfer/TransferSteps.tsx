import { useAtomValue } from "jotai";
import { isTransferSuccessAtom, transferDataAtom } from "../../states/transfer";
import { useEffect } from "react";
import { scrollContainerRefAtom } from "../../states";
import {
  AccountNumberForm,
  AmountForm,
  PasswordForm,
  VerifyInputForm,
} from "./steps";
import TransferSuccess from "./steps/TransferSuccess";
import TransferFailed from "./steps/TransferFailed";

const TransferSteps = () => {
  const transferData = useAtomValue(transferDataAtom);
  const scrollContainerRef = useAtomValue(scrollContainerRefAtom);
  const isTransferSuccess = useAtomValue(isTransferSuccessAtom);

  // 단계 변경 시 스크롤 맨 위로 이동
  useEffect(() => {
    if (!scrollContainerRef) {
      return;
    }

    scrollContainerRef.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [scrollContainerRef, transferData]);

  // 송금 결과
  if (isTransferSuccess) {
    // 송금 성공
    return <TransferSuccess />;
  } else if (isTransferSuccess === false) {
    // 송금 실패
    return <TransferFailed />;
  }

  // 단계별 폼 렌더
  if (!transferData.toAccountNumber) {
    return <AccountNumberForm />;
  }
  if (!transferData.amount) {
    return <AmountForm />;
  }
  if (!transferData.inputVerified) {
    return <VerifyInputForm />;
  }
  if (!transferData.password) {
    return <PasswordForm />;
  }
};

export default TransferSteps;
