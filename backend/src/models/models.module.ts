import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { LatestBlockReposity } from './latestBlock/latestBlock.reposity';
import { TransactionReposity } from './transaction/transaction.reposity';

@Module({
  imports: [
    ConnectionsModule
  ],
  providers: [
    TransactionReposity,
    LatestBlockReposity
  ],
  exports: [
    TransactionReposity,
    LatestBlockReposity
  ]
})
export class ModelsModule { }
