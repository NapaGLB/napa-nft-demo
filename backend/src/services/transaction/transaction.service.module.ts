import { Module } from '@nestjs/common';
import { ModelsModule } from 'src/models/models.module';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    ModelsModule
  ],
  providers: [
    TransactionService
  ],
  exports: [
    TransactionService
  ]
})
export class TransactionServiceModule { }
