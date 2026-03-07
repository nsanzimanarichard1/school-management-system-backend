import { Response, NextFunction } from 'express';
import feeService from '../services/fee.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { FeeBalanceDTO, TransactionDTO, TransactionHistoryDTO } from '../dtos/fee.dto';
import { asyncHandler } from '../middlewares/error.middleware';

export class FeeController {
  deposit = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const transaction = await feeService.deposit(req.userId!, req.body);
    const response = TransactionDTO.fromTransaction(transaction);
    res.status(201).json({ success: true, data: response });
  });

  withdraw = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const transaction = await feeService.withdraw(req.userId!, req.body);
    const response = TransactionDTO.fromTransaction(transaction);
    res.status(201).json({ success: true, data: response });
  });

  getBalance = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const balance = await feeService.getBalance(req.userId!);
    res.json({ success: true, data: balance });
  });

  getHistory = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const transactions = await feeService.getTransactionHistory(req.userId!);
    const response = TransactionHistoryDTO.create(transactions);
    res.json({ success: true, data: response });
  });
}

export default new FeeController();
