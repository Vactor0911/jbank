import { useAtomValue } from "jotai";
import AccountNumberForm from "./AccountNumberForm";
import { transferDataAtom } from "../../states/transfer";
import AmountForm from "./AmountForm";
import { useEffect } from "react";
import { scrollContainerRefAtom } from "../../states";
import VerifyInputForm from "./VerifyInputForm";
import PasswordForm from "./PasswordForm";
import Loading from "./Loading";

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
