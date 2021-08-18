import { Injectable } from '@nestjs/common';
import { IAccountStats, IOverallStats, ITransaction } from 'src/models/transaction/transaction.interface';
import { TransactionReposity } from 'src/models/transaction/transaction.reposity';
import { DecimalUtils } from 'src/utils/decimal.utils';

const LIMIT_RECENTS_NUMBER = 12;
const LIMIT_SOLD_NUMBER = 60;

@Injectable()
export class TransactionService {

  constructor(
    private readonly transactionRepo: TransactionReposity
  ) { }

  async createTransaction(historyData: ITransaction) {
    this.transactionRepo.create(historyData);
  }

  async getTransactionBySpaceId(spaceId: string): Promise<ITransaction[]> {
    if (!spaceId || spaceId === '') return [];
    const transactions = await this.transactionRepo.getBySpaceId(spaceId);
    return transactions.sort((a, b) => b.createdAt - a.createdAt);
  }

  async getTopSales(): Promise<ITransaction[]> {
    const transactions = await this.transactionRepo.getAll();

    const soldTransactions = transactions.filter(item => {
      return item.type === 'Sold';
    });

    // Sort transaction amount largest to smallest
    const sortedTransactions = soldTransactions.sort((a, b) => b.amount - a.amount);

    if (sortedTransactions.length > LIMIT_SOLD_NUMBER) {
      return sortedTransactions.slice(0, LIMIT_SOLD_NUMBER);
    }

    return sortedTransactions;
  }

  async getOverallStats(): Promise<IOverallStats> {
    const transactions = await this.transactionRepo.getAll();

    const soldTransactions = transactions.filter(item => {
      return item.type === 'Sold';
    });
    const numberOfSales = soldTransactions.length;
    const totalLifeTimeValueOfAllSales = DecimalUtils.round10(
      soldTransactions.reduce((a, b) => a + (b.amount ? Number(b.amount) : 0), 0),
      -2
    );
    const largestSales = this.getLargestSales(soldTransactions);
    const recentTransactions = this.getRecentTransactions(transactions);

    return {
      numberOfSales,
      totalLifeTimeValueOfAllSales,
      largestSales,
      recentTransactions
    } as IOverallStats;
  }

  async getAccountStats(address: string): Promise<IAccountStats> {
    const transactions = await this.transactionRepo.getAll();

    const soldTransactions = transactions.filter(item => {
      return item.type === 'Sold';
    });

    const boughtsByAccount = soldTransactions.filter(item => {
      return item.to === address;
    });
    const boughtsByAccountTotal = DecimalUtils.round10(
      boughtsByAccount.reduce((a, b) => a + (b.amount ? Number(b.amount) : 0), 0),
      -2
    );

    const soldsByAccount = soldTransactions.filter(item => {
      return item.from === address;
    });
    const soldsByAccountTotal = DecimalUtils.round10(
      soldsByAccount.reduce((a, b) => a + (b.amount ? Number(b.amount) : 0), 0),
      -2
    );

    return {
      bought: boughtsByAccount,
      boughtETHTotal: boughtsByAccountTotal,
      sold: soldsByAccount,
      soldETHTotal: soldsByAccountTotal
    } as IAccountStats;
  }

  private getLargestSales(transactions: ITransaction[]): ITransaction[] {
    // Sort transaction amount largest to smallest
    let largestSales = transactions.sort((a, b) => b.amount - a.amount);
    if (largestSales.length > LIMIT_RECENTS_NUMBER) {
      largestSales = largestSales.slice(0, LIMIT_RECENTS_NUMBER);
    }

    return largestSales;
  }

  private getRecentTransactions(transactions: ITransaction[]): ITransaction[] {
    // Sort transaction newest to oldest
    const sortedTransactions = transactions.sort((a, b) => b.createdAt - a.createdAt);

    if (sortedTransactions.length > LIMIT_RECENTS_NUMBER) {
      return sortedTransactions.slice(0, LIMIT_RECENTS_NUMBER);
    }

    return sortedTransactions;
  }

}
