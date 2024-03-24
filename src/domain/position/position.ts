import { ObjectId } from "mongoose";

export interface Position{
    stock:string;
    buyingPrice:number;
    sector:string;
    chartLink?:string
    target?:number;
    sl?:number;
    notes?:string;
    image?:string[];
    createdOn:number;
    updatedOn:number;
    closed?:boolean;
    investor:ObjectId
    ltd?:number,
    qty:number,
    _id:ObjectId,
    tradeInLoss:boolean
}
