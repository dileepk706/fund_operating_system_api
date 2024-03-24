import { ObjectId } from "mongoose";
import { TransactionsHistoryRepo } from "../../infrastructure/repositories/transactionHistoryRepo";
import { TransactionHistory } from "../../domain/fund/fund";

const TransactionHistoryUseCas = (
  transactionsHistoryRepo: TransactionsHistoryRepo
) => {
  return {
    getTransactions: async (
      investor: string | ObjectId,
      position?: string | ObjectId
    ): Promise<TransactionHistory[]> => {
      return await transactionsHistoryRepo.getTransactionHistory(
        investor,
        position
      );
    },
    addTransaction: async (transaction: TransactionHistory) => {
      await transactionsHistoryRepo.createTransactionHistory(transaction);
    },
  };
};

export default TransactionHistoryUseCas;
