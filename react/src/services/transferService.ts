import type { TransferData } from "../states/transfer";
import { axiosInstance } from "./axios";

class TransferService {
  /**
   * 송금 처리
   * @param transferData 송금 데이터
   * @returns Axios 응답 객체
   */
  static async transfer(transferData: TransferData) {
    const response = await axiosInstance.post("/api/v1/transaction/transfer", {
      senderAccountNumber: transferData.senderAccountNumber,
      receiverAccountNumber: transferData.receiverAccountNumber,
      amount: transferData.amount,
      password: transferData.password,
    });
    return response;
  }
}

export default TransferService;
