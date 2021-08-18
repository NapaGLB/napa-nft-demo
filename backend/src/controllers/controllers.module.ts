import { ServicesModule } from '../services/services.module';
import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [
    ServicesModule
  ],
  controllers: [
    TransactionsController
  ]
})
export class ControllersModule { }
