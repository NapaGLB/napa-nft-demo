import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionSchedule } from './transaction.schedule';
import { Web3Module } from 'src/web3/web3.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    Web3Module
  ],
  providers: [
    TransactionSchedule
  ],
  exports: [
    TransactionSchedule
  ]
})
export class SchedulesModule { }
