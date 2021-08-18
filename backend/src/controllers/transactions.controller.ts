import { Controller, Get, Param } from '@nestjs/common';
import { IAccountStats, IOverallStats, ITransaction } from 'src/models/transaction/transaction.interface';
import { TransactionService } from 'src/services/transaction/transaction.service';

@Controller('transactions')
export class TransactionsController {

  constructor(
    private readonly transactionService: TransactionService
  ) { }

  @Get('space/:id')
  async getBySpace(@Param('id') spaceId: string): Promise<ITransaction[]> {
    return this.transactionService.getTransactionBySpaceId(spaceId);
  }

  @Get('topSales')
  async getTopSales(): Promise<ITransaction[]> {
    return this.transactionService.getTopSales();
  }

  @Get('stats/overall')
  async getOverallStats(): Promise<IOverallStats> {
    return this.transactionService.getOverallStats();
  }

  @Get('stats/account/:address')
  async getAccountStats(@Param('address') address: string): Promise<IAccountStats> {
    return this.transactionService.getAccountStats(address);
  }
}
