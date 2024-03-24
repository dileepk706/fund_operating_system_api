import mongoose from "mongoose";
import { Position } from "../../domain/position/position";
import { ClosedPositionsGetType } from "../../type/type";
import { AppError } from "../../utils/customError";
import { MongoDBPosition } from "../database/collections/positionModel";
import {
  changeStringToNumber,
  getFilterObject,
  getSortingObject,
} from "../../utils/sortAndFilterHelpers";

export interface PositionRepository {
  createPosition: (position: Position) => Promise<Position>;
  updatePosition: (_id: string, position: Position) => Promise<Position>;
  getAllPositions: (investorId: string) => Promise<Position[]>;
  getAllClosedPositions: ({
    from,
    investor,
    to,
  }: ClosedPositionsGetType) => Promise<Position[]>;
  getOnePositions: (investor: string) => Promise<Position | null>;
  profitAndLossReport: (params: any) => Promise<Position[]>;
  getOneAggregatedPositions: (position: string) => Promise<Position>;
}

const positionRepositoryIMPL = (
  PositionModel: MongoDBPosition
): PositionRepository => {
  const createPosition = async (position: Position): Promise<Position> => {
    const newPosition = await PositionModel.create(position);
    return newPosition.toObject();
  };
  const updatePosition = async (
    _id: string,
    position: Position
  ): Promise<Position> => {
    const newPosition = await PositionModel.findByIdAndUpdate(_id, position, {
      new: true,
    })
      .populate("investor")
      .exec();
    if (!newPosition) {
      throw new AppError("position not exist", 404);
    }
    newPosition.updatedOn = new Date().getTime();
    await newPosition.save();
    return newPosition.toObject();
  };
  const getAllPositions = async (investor: string): Promise<Position[]> => {
    const data = await PositionModel.aggregate([
      {
        $match: {
          investor: new mongoose.Types.ObjectId(investor),
          closed: false,
        },
      },
      {
        $addFields: {
          totalInvested: { $multiply: ["$qty", "$buyingPrice"] },
          currentWorth: { $multiply: ["$qty", "$ltd"] },
          totalProfit: {
            $subtract: [
              { $multiply: ["$qty", "$ltd"] },
              { $multiply: ["$qty", "$buyingPrice"] },
            ],
          },
          profit: { $subtract: ["$ltd", "$buyingPrice"] },
          returnOnInvestment: {
            $multiply: [
              {
                $divide: [
                  { $subtract: ["$ltd", "$buyingPrice"] },
                  "$buyingPrice",
                ],
              },
              100,
            ],
          },
        },
      },
      {
        $sort: { createdOn: -1 },
      },
    ]);
    return data;
  };
  const getOneAggregatedPositions = async (
    position: string
  ): Promise<Position> => {
    const data = await PositionModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(position),
          closed: false,
        },
      },
      {
        $addFields: {
          totalInvested: { $multiply: ["$qty", "$buyingPrice"] },
          currentWorth: { $multiply: ["$qty", "$ltd"] },
          totalProfit: {
            $subtract: [
              { $multiply: ["$qty", "$ltd"] },
              { $multiply: ["$qty", "$buyingPrice"] },
            ],
          },
          profit: { $subtract: ["$ltd", "$buyingPrice"] },
          returnOnInvestment: {
            $multiply: [
              {
                $divide: [
                  { $subtract: ["$ltd", "$buyingPrice"] },
                  "$buyingPrice",
                ],
              },
              100,
            ],
          },
        },
      },
    ]);

    return data[0];
  };
  const getOnePositions = async (id: string): Promise<Position | null> => {
    const data = await PositionModel.findById(id).populate("investor");
    return data;
  };
  const getAllClosedPositions = async ({
    from,
    investor,
    to,
    sort,
    filter,
  }: ClosedPositionsGetType): Promise<Position[]> => {
    const sortObject: any = getSortingObject({
      sortBy: sort.sortBy,
      orderBy: sort.orderBy,
    });
    const filterObt = JSON.parse(filter);

    let filterObject: any = getFilterObject(filterObt);

    const pipeline = [
      {
        $match: {
          investor: new mongoose.Types.ObjectId(investor),
          closed: true,
          updatedOn: { $gte: from, $lte: to },
          ...filterObject,
        },
      },
      {
        $addFields: {
          currentWorth: { $multiply: ["$qty", "$ltd"] },
          invested: { $multiply: ["$qty", "$buyingPrice"] },
          profit: {
            $cond: {
              if: { $gt: [{ $subtract: ["$ltd", "$buyingPrice"] }, 0] },
              then: { $subtract: ["$ltd", "$buyingPrice"] },
              else: 0,
            },
          },
          loss: {
            $cond: {
              if: { $lt: [{ $subtract: ["$ltd", "$buyingPrice"] }, 0] },
              then: { $subtract: ["$ltd", "$buyingPrice"] },
              else: 0,
            },
          },
          totalProfit: {
            $multiply: [{ $subtract: ["$ltd", "$buyingPrice"] }, "$qty"],
          },
          returnOnInvestment: {
            $multiply: [
              {
                $divide: [
                  { $subtract: ["$ltd", "$buyingPrice"] },
                  "$buyingPrice",
                ],
              },
              100,
            ],
          },
          strikeSl: {
            $cond: {
              if: {
                $and: [
                  { $lt: ["$ltd", "$buyingPrice"] },
                  { $lte: ["$ltd", "$sl"] },
                ],
              },
              then: ["YES", "red"],
              else: ["NO", "orange"],
            },
          },

          strikeTarget: {
            $cond: {
              if: {
                $and: [
                  { $gt: ["$ltd", "$buyingPrice"] },
                  { $gte: ["$ltd", "$target"] },
                ],
              },
              then: ["YES", "#006C9C"],
              else: ["NO", "green"],
            },
          },
          holdingPeriodInDays: {
            $divide: [
              { $subtract: ["$updatedAt", "$createdAt"] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $sort: sortObject,
      },
    ];

    const data = await PositionModel.aggregate(pipeline);
    return data;
  };
  const profitAndLossReport = async (params: any): Promise<any[]> => {
    let { from, to, investor, range } = params;
    from = changeStringToNumber(from);
    to = changeStringToNumber(to);

    let investorsTimePeriod = {
      year: { $year: "$updatedAt" },
    };
    if (range === "monthly") {
      investorsTimePeriod = {
        ...investorsTimePeriod,
        ...{ month: { $month: "$updatedAt" } },
      };
    }
    if (range === "weekly") {
      investorsTimePeriod = {
        ...investorsTimePeriod,
        ...{ month: { $month: "$updatedAt" }, week: { $week: "$updatedAt" } },
      };
    }
    if (range === "daily") {
      investorsTimePeriod = {
        ...investorsTimePeriod,
        ...{
          month: { $month: "$updatedAt" },
          week: { $week: "$updatedAt" },
          day: "$updatedAt",
        },
      };
    }

    const data = await PositionModel.aggregate([
      {
        $match: {
          investor: new mongoose.Types.ObjectId(investor),
          closed: true,
          updatedOn: { $gte: from, $lte: to },
        },
      },
      {
        $addFields: {
          invested: { $multiply: ["$buyingPrice", "$qty"] },
          totalSellingPrice: { $multiply: ["$ltd", "$qty"] },
          totalProfit: {
            $multiply: [{ $subtract: ["$ltd", "$buyingPrice"] }, "$qty"],
          },
          returnOnInvestment: {
            $divide: [{ $subtract: ["$ltd", "$buyingPrice"] }, "$buyingPrice"],
          },
          inProfit: {
            $cond: {
              if: {
                $gte: [
                  {
                    $multiply: [
                      { $subtract: ["$ltd", "$buyingPrice"] },
                      "$qty",
                    ],
                  },
                  0,
                ],
              },
              then: 1,
              else: 0,
            },
          },
          inLoss: {
            $cond: {
              if: {
                $lt: [
                  {
                    $multiply: [
                      { $subtract: ["$ltd", "$buyingPrice"] },
                      "$qty",
                    ],
                  },
                  0,
                ],
              },
              then: 1,
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: investorsTimePeriod,
          stockBatches: {
            $sum: 1,
          },
          investedAmount: {
            $sum: "$invested",
          },
          investedAmountAfterSellThePosition: {
            $sum: "$totalSellingPrice",
          },
          return: {
            $sum: "$totalProfit",
          },
          returnOnInvestment: {
            $avg: "$returnOnInvestment",
          },
          tradesInProfit: {
            $sum: "$inProfit",
          },
          tradesInLoss: {
            $sum: "$inLoss",
          },
          // positions: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
        },
      },
    ]);

    return data;
  };
  return {
    createPosition,
    updatePosition,
    getAllPositions,
    getAllClosedPositions,
    getOnePositions,
    profitAndLossReport,
    getOneAggregatedPositions,
  };
};

export default positionRepositoryIMPL;
