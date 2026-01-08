import { useAtomValue } from "jotai";
import { transferDataAtom } from "../../states/transfer";
import { useEffect } from "react";
import { scrollContainerRefAtom } from "../../states";
import {
  AccountNumberForm,
  AmountForm,
  Loading,
  PasswordForm,
  VerifyInputForm,
} from "./steps";

const TransferSteps = () => {
  const transferData = useAtomValue(transferDataAtom);
  const scrollContainerRef = useAtomValue(scrollContainerRefAtom);

  // 단계 변경 시 스크롤 맨 위로 이동
  useEffect(() => {
    if (!scrollContainerRef) {
      return;
    }

    scrollContainerRef.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [scrollContainerRef, transferData]);

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
  return <Loading />;
};

export default TransferSteps;
