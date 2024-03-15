import { Request, Response } from "express";
import { Investor } from "../../domain/investor/investor";
import { AppError } from "../../utils/customError";
import { InvestorUseCase } from "../../app/investor/investorUseCase";
import investorRepositoryIMPL from "../../infrastructure/repositories/investorRepo";
import { investorModel } from "../../infrastructure/database/collections/investorModel";
import { createToken } from "../middlewares/auth";

export const investorUseCase = InvestorUseCase(investorRepositoryIMPL(investorModel));

export const signup = async (req: Request, res: Response) => {
  try {
    const user: Investor = req.body;
    if (!user.name) {
      throw new AppError("name is required field", 401);
    }
    if (!user.email) {
      throw new AppError("email is required field", 401);
    }
    if (!user.password) {
      throw new AppError("password is required field", 401);
    }
    const data = await investorUseCase.createInvestor(user);
    res.status(201).json({ result: data });
    return;
  } catch (error: any) {
    console.log(error.message);
    res
      .status(error.statusCode || 500)
      .json({ error: true, message: error.message || "Something went wrong" });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user: Investor = req.body;
    if (!user.email) {
      throw new AppError("email is required field", 401);
    }
    if (!user.password) {
      throw new AppError("password is required field", 401);
    }
    const data = await investorUseCase.investorLogin(user);
    const token = createToken(data)
    res.status(200).json({ result: { token } });
  } catch (error: any) {
    console.log(error.message);
    res
      .status(error.statusCode || 500)
      .json({ error: true, message: error.message || "Something went wrong" });
    return;
  }
};
