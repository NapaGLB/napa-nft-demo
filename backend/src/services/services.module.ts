import { Module } from '@nestjs/common';
import { TransactionServiceModule } from './transaction/transaction.service.module';

@Module({
  imports: [
    TransactionServiceModule
  ],
  exports: [
    TransactionServiceModule
  ]
})
export class ServicesModule { }
