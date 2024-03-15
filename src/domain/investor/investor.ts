import { ObjectId } from "mongoose";

export interface Investor{
    name:string;
    email:string;
    password:string
    createdOn:number;
    updatedOn:number
    _id:ObjectId
}