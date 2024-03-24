import { Fund } from "../../domain/fund/fund";
import { MongoDBFund } from "../database/collections/fundModel";

export interface FundRepository {
  addFund: (fund: Fund) => Promise<Fund>;
  updateFund: (fund: Fund) => Promise<Fund | null>;
  findOneFund: (investor: string) => Promise<Fund | null>;
}

const fundRepositoryIMPL = (FundModel: MongoDBFund): FundRepository => {
  const addFund = async (fund: Fund): Promise<Fund> => {
    const data = await FundModel.create(fund);
    return data;
  };
  const updateFund = async (fund: Fund): Promise<Fund | null> => {
    const data = await FundModel.findOneAndUpdate(
      { investor: fund.investor },
      { $inc: { amount: fund.amount, revenue: fund.amount } },
      { new: true }
    ).populate("investor");
    return data;
  };
  const findOneFund = async (investor: string): Promise<Fund | null> => {
    const data = await FundModel.findOne({ investor: investor }).populate(
      "investor"
    );
    return data;
  };
  return {
    addFund,
    findOneFund,
    updateFund,
  };
};

export default fundRepositoryIMPL;
