import mongoose, { Document, Model, Schema } from "mongoose";
import { TransactionHistory } from "../../../domain/fund/fund";

export type MongoDBTransactionsHistorySchema = Model<
  TransactionHistory & Document
>;

const transactionsHistorySchema = new Schema<TransactionHistory & Document>(
  {
    amount: { type: Number },
    note: { type: String, trim: true },
    position: { type: mongoose.Schema.Types.ObjectId, ref: "position" },
    investor: { type: mongoose.Schema.Types.ObjectId, ref: "investor" },
    createdOn: { type: Number, default: Date.now },
    updatedOn: { type: Number, default: Date.now },
  },
  {
    timestamps: { createdAt: true },
  }
);

export const transactionsHistoryModel: MongoDBTransactionsHistorySchema =
  mongoose.model<TransactionHistory & Document>(
    "history",
    transactionsHistorySchema
  );
