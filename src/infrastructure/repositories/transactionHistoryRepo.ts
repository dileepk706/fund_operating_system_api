import { ObjectId } from "mongoose";
import { TransactionHistory } from "../../domain/fund/fund";
import { MongoDBTransactionsHistorySchema } from "../database/collections/transactionsHistoryModel";

export interface TransactionsHistoryRepo {
  getTransactionHistory: (
    investor: string | ObjectId,
    position?: string | ObjectId
  ) => Promise<TransactionHistory[]>;
  createTransactionHistory: (history: TransactionHistory) => Promise<void>;
}
const transactionsHistoryRepoIMPL = (
  TransactionsHistoryModel: MongoDBTransactionsHistorySchema
): TransactionsHistoryRepo => {
  const createTransactionHistory = async (history: TransactionHistory) => {
    await TransactionsHistoryModel.create(history);
  };
  const getTransactionHistory = async (
    investor: string | ObjectId,
    position?: string | ObjectId
  ): Promise<TransactionHistory[]> => {
    const data = await TransactionsHistoryModel.find({ investor })
      .populate("position investor")
      .sort({ updatedOn: -1 });
    return data;
  };
  return {
    createTransactionHistory,
    getTransactionHistory,
  };
};

export default transactionsHistoryRepoIMPL;
