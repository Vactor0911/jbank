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
    return <div>송금 확인</div>;
  }
};

export default TransferSteps;
