import type { TransferData } from "../states/transfer";
import { axiosInstance } from "./axios";

class TransferService {
  static async transfer(transferData: TransferData) {
    await axiosInstance.post("/api/transaction/transfer", {
      senderAccountNumber: transferData.senderAccountNumber,
      receiverAccountNumber: transferData.receiverAccountNumber,
      amount: transferData.amount,
      password: transferData.password,
    });
  }
}

export default TransferService;
