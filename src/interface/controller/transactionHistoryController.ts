import { Response } from "express";
import { CustomRequest } from "../middlewares/auth";
import transactionsHistoryRepoIMPL from "../../infrastructure/repositories/transactionHistoryRepo";
import { transactionsHistoryModel } from "../../infrastructure/database/collections/transactionsHistoryModel";
import TransactionHistoryUseCas from "../../app/transaction-history/transactionHistorUseCasey";

export const transactionsHistoryUseCase=TransactionHistoryUseCas(transactionsHistoryRepoIMPL(transactionsHistoryModel))

export const getAllTransactionHistory = async (req: CustomRequest, res: Response) => {
  try {
    const investor = req.user.user._id
    const data = await transactionsHistoryUseCase.getTransactions(investor)
    res.status(200).json({ result: { transactions: data } });
    return;
  } catch (error: any) {
    console.log(error.message);
    res
      .status(error.statusCode || 500)
      .json({ error: true, message: error.message || "Something went wrong" });
    return;
  }
};
 