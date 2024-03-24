import { ObjectId } from "mongoose";

export interface Fund {
  amount: number;
  investor: ObjectId;
  revenue:number;
  createdOn?: number;
  updatedOn?: number;
}

export interface TransactionHistory{
  amount:number,
  note:string,
  position?:ObjectId
  investor: ObjectId;
  createdOn?: number; 
  updatedOn?: number;
}