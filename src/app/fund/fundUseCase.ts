import { FundRepository } from "../../infrastructure/repositories/fundRepo";
import { Fund } from "../../domain/fund/fund";
import { AppError } from "../../utils/customError";
import { transactionsHistoryUseCase } from "../../interface/controller/transactionHistoryController";
import { ObjectId } from "mongoose";

const FundUseCase = (fundRepository: FundRepository) => {
  return {
    updateFund: async (fund: Fund,transactionNote?:string,position?:ObjectId) => {
      const data = await fundRepository.updateFund(fund);
      const transaction = {
        amount: fund.amount,
        note: transactionNote || "fund in",
        investor: fund.investor,
        position
      };
      if (!data) {
        await transactionsHistoryUseCase.addTransaction(transaction);
        return await fundRepository.addFund(fund);
      }
      await transactionsHistoryUseCase.addTransaction(transaction);
      return data;
    },
    getFund: async (investor: string): Promise<Fund|null> => {
      const data = await fundRepository.findOneFund(investor);
      return data;
    },
  };
};

export default FundUseCase;
