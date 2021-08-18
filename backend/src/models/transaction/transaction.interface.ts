export interface ITransaction {
  type: string,
  spaceId: string,
  amount?: number,
  from: string,
  to?: string,
  createdAt: number,
  txn: string
};

export interface IOverallStats {
  numberOfSales: number,
  totalLifeTimeValueOfAllSales: number,
  largestSales: ITransaction[],
  recentTransactions: ITransaction[]
}

export interface IAccountStats {
  bought: ITransaction[],
  boughtETHTotal: number,
  sold: ITransaction[],
  soldETHTotal: number
}
