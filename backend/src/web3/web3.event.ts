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
    const { web3, contract } = await this.wed3Config.init();
    this.web3 = web3;
    this.contract = contract;
    this.latestBlock = await this.transactionService.getLatestBlock();;

    this.setupEventListeners();
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
          const latestBlock = await this.transactionService.getLatestBlock();

          if (!event || event.blockNumber <= latestBlock) return;
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
          await this.transactionService.syncLatestBlock(event.blockNumber);
          await this.socketGateway.emitMessage(transactionDto);
        });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
