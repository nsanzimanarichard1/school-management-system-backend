import { Fee, FeeTransaction, Student, User } from '@prisma/client';

// INPUT DTOs
export interface DepositInputDTO {
  amount: number;
  description?: string;
}

export interface WithdrawInputDTO {
  amount: number;
  description: string;
}

// OUTPUT DTOs
export class FeeBalanceDTO {
  balance: number;
  studentName: string;

  static fromFee(fee: Fee & { student: Student & { user: User } }): FeeBalanceDTO {
    return {
      balance: fee.balance,
      studentName: fee.student.user.name
    };
  }
}

export class TransactionDTO {
  id: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  createdAt: Date;

  static fromTransaction(tx: FeeTransaction): TransactionDTO {
    return {
      id: tx.id,
      type: tx.type,
      amount: tx.amount,
      status: tx.status,
      description: tx.description || undefined,
      createdAt: tx.createdAt
    };
  }
}

export class TransactionHistoryDTO {
  transactions: TransactionDTO[];
  totalDeposits: number;
  totalWithdrawals: number;

  static create(transactions: FeeTransaction[]): TransactionHistoryDTO {
    return {
      transactions: transactions.map(tx => TransactionDTO.fromTransaction(tx)),
      totalDeposits: transactions
        .filter(tx => tx.type === 'DEPOSIT' && tx.status === 'COMPLETED')
        .reduce((sum, tx) => sum + tx.amount, 0),
      totalWithdrawals: transactions
        .filter(tx => tx.type === 'WITHDRAW' && tx.status === 'APPROVED')
        .reduce((sum, tx) => sum + tx.amount, 0)
    };
  }
}
