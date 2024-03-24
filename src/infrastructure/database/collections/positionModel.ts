import mongoose, { Document, Model, Schema } from "mongoose";
import { Position } from "../../../domain/position/position";

export type MongoDBPosition = Model<Position & Document>; 

const positionSchema = new Schema<Position & Document>({ 
  stock: { type: String, trim: true },
  buyingPrice: { type: Number, required: true },
  chartLink: { type: String, trim: true },
  image: { type: [String] },
  notes: { type: String },
  sector: { type: String, required: true, trim: true },
  sl: { type: Number,default:0 },
  target: { type: Number ,default:0},
  createdOn: { type: Number, default: Date.now },  
  updatedOn: { type: Number, default: Date.now } ,
  closed:{type:Boolean,default:false},
  ltd:{type:Number},
  qty:{type:Number,required:true},
  investor:{type: mongoose.Schema.Types.ObjectId,ref:'investor'},
  tradeInLoss:{type:Boolean,default:false}
}, {
  timestamps: { createdAt: true },
});

export const positionModel: MongoDBPosition = mongoose.model<Position & Document>("position", positionSchema); 