import { Position } from "../../domain/position/position";
import { PositionRepository } from "../../infrastructure/repositories/positionRepo";
import { fundUseCase } from "../../interface/controller/fundController";
import { transactionsHistoryUseCase } from "../../interface/controller/transactionHistoryController";
import { ClosedPositionsGetType } from "../../type/type";
import { AppError } from "../../utils/customError";
import { scrapeStockDetails } from "../scrapper/scrapeStockDetails";

export const PositionUseCase = (positionRepository: PositionRepository) => {
  return {
    createNewPosition: async (position: Position): Promise<Position> => {
      const isCorrectStock = await scrapeStockDetails(position.stock);
      if (position.target && position.target < isCorrectStock.ltd) {
        throw new AppError(
          "target should greater than last trading price",
          401
        );
      }
      if (position.sl && position.sl > isCorrectStock.ltd) {
        throw new AppError(
          "stop loss should less than last trading price",
          401
        );
      }
      const totalAmountNeeded = isCorrectStock.ltd * position.qty;
      const investor: any = position.investor;
      const availableFundInHand = await fundUseCase.getFund(investor);
      if (!availableFundInHand)
        throw new AppError("You not added fund yet to your account", 404);
      if (totalAmountNeeded > availableFundInHand.amount) {
        throw new AppError(
          "Insufficient funds. Please add more to proceed.",
          404
        );
      }

      const data = await positionRepository.createPosition({
        ...position,
        ltd: isCorrectStock.ltd,
        buyingPrice: isCorrectStock.ltd,
      });
      console.log({ ...position, ltd: isCorrectStock.ltd });

      const fund: any = {
        amount: -totalAmountNeeded,
        investor,
      };
      await fundUseCase.updateFund(fund, "position buy", data._id);
      return data;
    },
    updatePosition: async (
      _id: string,
      position: Position
    ): Promise<Position> => {
      const Position: any = await positionRepository.getOnePositions(_id);

      if (position.target && position.target < Position?.buyingPrice) {
        throw new AppError("target should greater than last price", 401);
      }
      if (position.sl && position.sl > Position?.buyingPrice) {
        throw new AppError("stop loss should less than last price", 401);
      }
      return await positionRepository.updatePosition(_id, position);
    },
    getAllPositions: async (investor: string): Promise<Position[]> => {
      return await positionRepository.getAllPositions(investor);
    },
    getOneAggregatedPosition: async (position: string): Promise<Position> => {
      return await positionRepository.getOneAggregatedPositions(position);
    },
    getAllClosedPositions: async ({
      from,
      investor,
      to,
      sort,
      filter,
    }: ClosedPositionsGetType): Promise<Position[]> => {
      return await positionRepository.getAllClosedPositions({
        from,
        investor,
        to,
        sort,
        filter,
      });
    },
    closePosition: async (
      positionId: string,
      investor: string
    ): Promise<Position> => {
      const position = await positionRepository.getOnePositions(positionId);
      if (!position) throw new AppError("position not found", 404);
      if (position.closed) throw new AppError("position already closed", 401);
      const { buyingPrice, qty, stock } = position;
      const { ltd } = await scrapeStockDetails(stock);
      const profit = ltd - buyingPrice;
      const totalProfit = profit * qty;
      const invested = buyingPrice * qty;
      const amountToAddBack = invested + totalProfit;
      const closingPositionInfo: any = {
        ltd,
        closed: true,
        tradeInLoss: profit < 0 ? true : false,
      };
      const fund: any = {
        amount: amountToAddBack,
        investor,
        revenue: totalProfit,
      };
      const updatedPosition = await positionRepository.updatePosition(
        positionId,
        closingPositionInfo
      );
      await fundUseCase.updateFund(fund, "position sell", updatedPosition._id);
      return updatedPosition;
    },
    profitAndLossReport: async (params: any): Promise<Position[]> => {
      const data = await positionRepository.profitAndLossReport(params);
      return data;
    },
  };
};

