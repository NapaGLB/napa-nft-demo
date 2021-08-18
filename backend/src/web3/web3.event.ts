import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { SC_EVENT_MAPPER } from 'src/constants';
import { TransactionMap } from 'src/models/transaction/transaction.map';
import { TransactionService } from 'src/services/transaction/transaction.service';
import { SocketGateway } from 'src/socket-gateways/socket.gateway';
import { Web3Config } from './web3.config';

@Injectable()
export class Web3Event implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(Web3Event.name);
  private web3;
  private contract;
  private latestBlock;

  constructor(
    private readonly wed3Config: Web3Config,
    private readonly transactionService: TransactionService,
    private readonly socketGateway: SocketGateway
  ) { }

  async onApplicationBootstrap() {
    const { web3, contract, latestBlock } = await this.wed3Config.init();
    this.web3 = web3;
    this.contract = contract;
    this.latestBlock = latestBlock;

    this.setupEventListeners();
  }

  async setupEventListenersForDevlepment() {
    try {
      const events = await this.contract.getPastEvents(
        'allEvents',
        { filter: {}, fromBlock: this.latestBlock, toBlock: 'latest' },
        (_err, _event) => { }
      )

      if (!events || events.length === 0) return;
      if (events[0].blockNumber < this.latestBlock) return;
      this.latestBlock = this.latestBlock + 1;

      for (const event of events) {
        if (Object.keys(event).length === 0) continue;
        if (!SC_EVENT_MAPPER[event.event]) continue;

        const transactionData = await this.web3.eth.getTransaction(
          event.transactionHash
        );

        const transactionDto = TransactionMap.createDTO(
          this.web3.utils,
          event,
          transactionData
        );

        await this.transactionService.createTransaction(transactionDto);
        await this.socketGateway.emitMessage(transactionDto);
      }

    } catch (error) {
      this.logger.error(error);
    }
  }

  private setupEventListeners() {
    this.setupEventListener(this.contract.events.Assign);
    this.setupEventListener(this.contract.events.SpaceTransfer);
    this.setupEventListener(this.contract.events.SpaceOffered);
    this.setupEventListener(this.contract.events.SpaceBidEntered);
    this.setupEventListener(this.contract.events.SpaceBidWithdrawn);
    this.setupEventListener(this.contract.events.SpaceBought);

  }

  private async setupEventListener(contractEvent: any) {
    try {
      contractEvent({ fromBlock: this.latestBlock }, (_error, _event) => { })
        .on('data', async (event) => {
          if (!event || event.blockNumber === this.latestBlock) return;

          this.latestBlock = this.latestBlock + 1;
          if (Object.keys(event).length === 0) return;

          // Executed trade market
          if (!SC_EVENT_MAPPER[event.event]) return;

          const transactionData = await this.web3.eth.getTransaction(
            event.transactionHash
          );

          const transactionDto = TransactionMap.createDTO(
            this.web3.utils,
            event,
            transactionData
          );

          await this.transactionService.createTransaction(transactionDto);
          await this.socketGateway.emitMessage(transactionDto);
        });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
