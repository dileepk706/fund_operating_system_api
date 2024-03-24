import { Response } from "express";
import FundUseCase from "../../app/fund/fundUseCase";
import { fundModel } from "../../infrastructure/database/collections/fundModel";
import fundRepositoryIMPL from "../../infrastructure/repositories/fundRepo";
import { CustomRequest } from "../middlewares/auth";
import { AppError } from "../../utils/customError";

export const fundUseCase = FundUseCase(fundRepositoryIMPL(fundModel));

export const addFund = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.body.amount) throw new AppError("amount is required", 401);
    const fund = req.body;
    const data = await fundUseCase.updateFund({
      ...fund,
      investor: req.user.user._id,
    });
    res.status(200).json({ result: { fund: data } });
    return;
  } catch (error: any) {
    console.log(error.message);
    res
      .status(error.statusCode || 500)
      .json({ error: true, message: error.message || "Something went wrong" });
    return;
  }
};

export const getFund = async (req: CustomRequest, res: Response) => {
  try {
    const investor = req.user.user._id;
    const data = await fundUseCase.getFund(investor);
    res.status(200).json({ result: { fund: data } });
    return;
  } catch (error: any) {
    console.log(error.message);
    res
      .status(error.statusCode || 500)
      .json({ error: true, message: error.message || "Something went wrong" });
    return;
  }
};
