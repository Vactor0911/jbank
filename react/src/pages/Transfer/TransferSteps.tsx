import { useAtomValue } from "jotai";
import AccountNumberForm from "./AccountNumberForm";
import { transferDataAtom } from "../../states/transfer";
import AmountForm from "./AmountForm";

const TransferSteps = () => {
  const transferData = useAtomValue(transferDataAtom);

  if (!transferData.accountNumber) {
    return <AccountNumberForm />;
  }
  if (!transferData.amount) {
    return <AmountForm />;
  }
  if (!transferData.password) {
    return <div>거래 비밀번호 입력 폼</div>;
  }
};

export default TransferSteps;
