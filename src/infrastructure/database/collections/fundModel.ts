import mongoose, { Document, Model, Schema } from "mongoose";
import { Fund, } from "../../../domain/fund/fund";

export type MongoDBFund = Model<Fund & Document>; 

const fundSchema = new Schema<Fund & Document>({ 
    amount:{type:Number},
    investor:{type:mongoose.Schema.Types.ObjectId,ref:'investor',unique:true},
    revenue:{type:Number},
    createdOn: { type: Number, default: Date.now },  
    updatedOn: { type: Number, default: Date.now } ,
}, {
  timestamps: { createdAt: true },
});

export const fundModel: MongoDBFund = mongoose.model<Fund & Document>("fund", fundSchema); 