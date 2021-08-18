import { Module } from '@nestjs/common';
import { ConnectionsModule } from 'src/connections/connections.module';
import { TransactionReposity } from './transaction/transaction.reposity';

@Module({
  imports: [
    ConnectionsModule
  ],
  providers: [
    TransactionReposity
  ],
  exports: [
    TransactionReposity
  ]
})
export class ModelsModule { }
