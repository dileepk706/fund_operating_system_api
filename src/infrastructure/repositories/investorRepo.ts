import { Investor } from "../../domain/investor/investor";
import { AppError } from "../../utils/customError";
import { MongoDBInvestor } from "../database/collections/investorModel";

export interface InvestorRepository {
  createInvestor: (investor: Investor) => Promise<Investor>;
  findOneInvestorBy_id: (_id: string) => Promise<Investor | null>;
  findOneInvestorByEmail: (email: string) => Promise<Investor | null>;
}

const investorRepositoryIMPL = (
  InvestorModel: MongoDBInvestor
): InvestorRepository => {
  const createInvestor = async (investor: Investor): Promise<Investor> => {
    const data = await InvestorModel.create(investor);
    return data;
  };
  const findOneInvestorBy_id = async (
    _id: string
  ): Promise<Investor | null> => {
    const data = await InvestorModel.findById(_id);
    return data;
  };
  const findOneInvestorByEmail = async (
    email: string
  ): Promise<Investor | null> => {
    const data = await InvestorModel.findOne({ email });
    return data;
  };
  return {
    createInvestor,
    findOneInvestorBy_id,
    findOneInvestorByEmail,
  };
};

export default investorRepositoryIMPL;
