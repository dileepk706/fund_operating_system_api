import { Response } from "express";
import { CustomRequest } from "../middlewares/auth";
import { scrapeStockDetails } from "../../app/scrapper/scrapeStockDetails";
import { positionUseCase } from "./positionController";
 
export const getStockDetailsAndUpdatePosition = async (req: CustomRequest, res: Response) => {
  try {
    const stock:any = req.query.stock
    const position:any = req.query.position
    const data=await scrapeStockDetails(stock)
    const pData:any={
        ltd:data.ltd

    }
    await positionUseCase.updatePosition(position,pData)
    const positionData=await positionUseCase.getOneAggregatedPosition(position)
    
    res.status(200).json({ result:positionData });
    return;
  } catch (error: any) {
    console.log(error.message);
    res
      .status(error.statusCode || 500)
      .json({ error: true, message: error.message || "Something went wrong" });
    return;
  }
};
