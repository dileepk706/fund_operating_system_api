import mongoose, { Document, Model, Schema } from "mongoose";
import { Investor } from "../../../domain/investor/investor";

export type MongoDBInvestor = Model<Investor & Document>; 

const investorSchema = new Schema<Investor & Document>({ 
    name:{type:String,trim:true},
    email:{type:String,trim:true,unique:true,required:true},
    password:{type:String,trim:true,required:true},
    createdOn: { type: Number, default: Date.now },  
    updatedOn: { type: Number, default: Date.now } ,
}, {
  timestamps: { createdAt: true },
});

export const investorModel: MongoDBInvestor = mongoose.model<Investor & Document>("investor", investorSchema); 