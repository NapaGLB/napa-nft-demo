import { SC_EVENT_MAPPER } from "src/constants";
import { ITransaction } from "./transaction.interface";

export class TransactionMap {
  static createDTO(web3Utils, event, transactionData) {
    const eventValues = event.returnValues;
    const transactionDto = {
      type: SC_EVENT_MAPPER[event.event],
      spaceId: eventValues.spaceId,
      from: transactionData.from,
      txn: event.transactionHash
    } as ITransaction;

    switch (event.event) {
      case 'Assign':
      case 'SpaceTransfer':
        transactionDto.to = eventValues.to;
        break;

      case 'SpaceOffered':
        transactionDto.amount = web3Utils.fromWei(eventValues.minValue, 'ether');
        transactionDto.to = eventValues.toAddress;
        break;

      case 'SpaceBidEntered':
      case 'SpaceBidWithdrawn':
        transactionDto.amount = web3Utils.fromWei(eventValues.value, 'ether');
        break;

      case 'SpaceBought':
        transactionDto.amount = web3Utils.fromWei(eventValues.value, 'ether');
        transactionDto.from = eventValues.fromAddress;
        transactionDto.to = eventValues.toAddress;
        break;

      default:
        break;
    }

    return transactionDto;
  }
}
