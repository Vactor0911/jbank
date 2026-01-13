import { useAtomValue } from "jotai";
import { isTransferSuccessAtom, transferStepAtom } from "../../states/transfer";
import { useEffect } from "react";
import { scrollContainerRefAtom } from "../../states";
import {
  AccountNumberForm,
  AmountForm,
  PasswordForm,
  VerifyInputForm,
  TransferLoading,
} from "./steps";
import TransferSuccess from "./steps/TransferSuccess";
import TransferFailed from "./steps/TransferFailed";
import NotFoundError from "../NotFoundError";

const TransferSteps = () => {
  const transferStep = useAtomValue(transferStepAtom);
  const scrollContainerRef = useAtomValue(scrollContainerRefAtom);
  const isTransferSuccess = useAtomValue(isTransferSuccessAtom);

  // 단계 변경 시 스크롤 맨 위로 이동
  useEffect(() => {
    if (!scrollContainerRef) {
      return;
    }

    scrollContainerRef.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [scrollContainerRef, transferStep]);

  // 단계별 폼 렌더
  switch (transferStep) {
    case 0:
      // 계좌번호 입력 폼
      return <AccountNumberForm />;
    case 1:
      // 송금 금액 입력 폼
      return <AmountForm />;
    case 2:
      // 입력 정보 확인 폼
      return <VerifyInputForm />;
    case 3:
      // 비밀번호 입력 폼
      return <PasswordForm />;
    case 4:
      // 송금 로딩 화면
      return <TransferLoading />;
    default:
      // 송금 결과 페이지
      if (isTransferSuccess !== null) {
        if (isTransferSuccess) {
          // 송금 성공
          return <TransferSuccess />;
        } else {
          // 송금 실패
          return <TransferFailed />;
        }
      }
      return <NotFoundError />;
  }
};

export default TransferSteps;
