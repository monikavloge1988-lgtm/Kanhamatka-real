export type TabType = 'SUPPORT' | 'ACTIVITY' | 'HOME' | 'WALLET' | 'ACCOUNT';

export type Transaction = {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  date: Date;
  utr?: string;
  upiId?: string;
};
