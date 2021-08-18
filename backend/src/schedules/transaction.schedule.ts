import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Web3Event } from "src/web3/web3.event";

@Injectable()
export class TransactionSchedule {
  constructor(
    private readonly config: ConfigService,
    private readonly web3Event: Web3Event
  ) { }

  // Because listening for transaction events in Hardhat is problematic
  // for the development environment, event data is only obtained at
  // the first application startup. So we will call event every 1 second
  // to get event data in development environment
  @Cron(CronExpression.EVERY_SECOND)
  async getTransactions() {
    if (this.config.get('NODE_ENV') !== 'development') return;
    this.web3Event.setupEventListenersForDevlepment();
  }
}
