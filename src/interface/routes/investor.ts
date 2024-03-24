import express, { Request, Response } from "express";
import { login, signup } from "../controller/investorController";
import {
  closePosition,
  createPosition,
  getAllClosedPositions,
  getAllPositions,
  profitAndLossReport,
  updatePosition,
} from "../controller/positionController";
import authenticateInvestor from "../middlewares/auth";
import { addFund, getFund } from "../controller/fundController";
import { getAllTransactionHistory } from "../controller/transactionHistoryController";
import { getStockDetailsAndUpdatePosition } from "../controller/webScrapperController";

const router = express.Router();

router.get('/get-scraped-real-time-stock-details-and-update-position',getStockDetailsAndUpdatePosition)
router.post("/signup", signup);
router.post("/login", login);
router.post("/position", authenticateInvestor, createPosition);
router.put("/position/:id", authenticateInvestor, updatePosition);
router.get("/position", authenticateInvestor, getAllPositions);
router.get("/position-closed", authenticateInvestor, getAllClosedPositions);
router.put("/add-fund",authenticateInvestor,addFund)
router.get("/fund",authenticateInvestor,getFund)
router.get("/transactions-history",authenticateInvestor,getAllTransactionHistory)
router.put('/close-position/:id',authenticateInvestor,closePosition)
router.get('/profit-and-loss-report',authenticateInvestor,profitAndLossReport)

export default router;
