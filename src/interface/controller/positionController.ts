import { Request, Response } from "express";
import { PositionUseCase } from "../../app/posiotion/positionUseCase";
import positionRepositoryIMPL from "../../infrastructure/repositories/positionRepo";
import { positionModel } from "../../infrastructure/database/collections/positionModel";
import { CustomRequest } from "../middlewares/auth";
import { changeStringToNumber, isValidURL } from "../../utils/sortAndFilterHelpers";
import { AppError } from "../../utils/customError";

export const positionUseCase = PositionUseCase(
  positionRepositoryIMPL(positionModel)
);

export const createPosition = async (req: CustomRequest, res: Response) => {
  try {
    const position = req.body;
    if (!position.stock) {
      throw new AppError("Stock name is required", 401);
    }
    if (!position.buyingPrice) {
      // throw new AppError('buyingPrice is required',401)
    }
    if (position.chartLink&&!isValidURL(position.chartLink)) {
      throw new AppError("Invalid URL. Please enter a valid URL", 401);
    }
     
    const data = await positionUseCase.createNewPosition({
      ...position,
      investor: req.user.user._id,
    });
    res.status(200).json({ result: data });
    return;
  } catch (error: any) {
    console.log(error.message);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Something went wrong" });
    return;
  }
};

export const updatePosition = async (req: CustomRequest, res: Response) => {
  try {
    const position = req.body;
    if(!position.target||!position.sl){
      throw new AppError('target and sl is required',401)
    }
    const _id = req.params.id;
    const data = await positionUseCase.updatePosition(_id, position);
    res.status(200).json({ result: data });
    return;
  } catch (error: any) {
    console.log(error.message);
    res
      .status(error.statusCode || 500)
      .json({ error: true, message: error.message || "Something went wrong" });
    return;
  }
};

export const getAllPositions = async (req: CustomRequest, res: Response) => {
  try {
    const data = await positionUseCase.getAllPositions(req.user.user._id);
    res.status(200).json({ result: data });
    return;
  } catch (error: any) {
    console.log(error.message);
    res
      .status(error.statusCode || 500)
      .json({ error: true, message: error.message || "Something went wrong" });
    return;
  }
};

export const getAllClosedPositions = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const investor = req.user.user._id;
    const sort ={
      sortBy: req.query.sortBy ,
      orderBy:req.query.orderBy
    }
    const filter=req.query.filter
    let from = changeStringToNumber(req.query.from);
    let to = changeStringToNumber(req.query.to);
    if(!from||!to){
      from=1699388173000
      to=new Date().getTime()
    }
    const data = await positionUseCase.getAllClosedPositions({
      from,
      to,
      investor,
      sort,
      filter,
    });
    res.status(200).json({ result: data });
    return;
  } catch (error: any) {
    console.log(error.message);
    res
      .status(error.statusCode || 500)
      .json({ error: true, message: error.message || "Something went wrong" });
    return;
  }
};

export const closePosition = async (req: CustomRequest, res: Response) => {
  try {
    const ltd = req.body.ltd;
    const investor = req.user.user._id;
    const positionId = req.params.id;

    const data = await positionUseCase.closePosition(positionId, investor);
    res.status(200).json({ result: data });
    return;
  } catch (error: any) {
    console.log(error.message);
    res
      .status(error.statusCode || 500)
      .json({ error: true, message: error.message || "Something went wrong" });
    return;
  }
};

export const profitAndLossReport = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const investor = req.user.user._id;
    const params: any = req.query;

    const data = await positionUseCase.profitAndLossReport({
      ...params,
      investor,
    });

    res.status(200).json({ result: data });
    return;
  } catch (error: any) {
    console.log(error.message);
    res
      .status(error.statusCode || 500)
      .json({ error: true, message: error.message || "Something went wrong" });
    return;
  }
};
