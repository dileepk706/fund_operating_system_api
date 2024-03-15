import { Investor } from "../../domain/investor/investor";
import { InvestorRepository } from "../../infrastructure/repositories/investorRepo";
import { AppError } from "../../utils/customError";

export const InvestorUseCase = (investorRepository: InvestorRepository) => {
  return {
    createInvestor: async (investor: Investor): Promise<Investor> => {
      const dataExist = await investorRepository.findOneInvestorByEmail(
        investor.email
      );
      if (dataExist) {
        throw new AppError("user is already exist", 401);
      }
      const data = await investorRepository.createInvestor(investor);
      return data;
    },
    investorLogin: async (investor: Investor): Promise<Investor> => {
      const dataExist = await investorRepository.findOneInvestorByEmail(
        investor.email
      );
      if (!dataExist) {
        throw new AppError("user not exist", 404);
      }
      if (dataExist.password !== investor.password) {
        throw new AppError("password is not correct", 403);
      }
      return dataExist;
    },
    findInvestorById: async (_id: string): Promise<Investor> => {
      const data = await investorRepository.findOneInvestorBy_id(_id);
      if (!data) throw new AppError("user not found", 404);
      return data;
    },
  };
};
