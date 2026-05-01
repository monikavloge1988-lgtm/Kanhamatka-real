import { Transaction } from '../types';
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';

interface TabActivityProps {
  transactions: Transaction[];
}

export function TabActivity({ transactions }: TabActivityProps) {
  return (
    <div className="p-4 pb-24">
      <h2 className="text-2xl font-bold text-white mb-6">Activity History</h2>
      
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center text-zinc-500 py-12 bg-[#151516] rounded-[2rem] border border-[#2a2a2d]">
            No transactions yet.
          </div>
        ) : (
          transactions.map(tx => (
            <div key={tx.id} className="bg-[#151516] rounded-2xl p-4 border border-[#2a2a2d] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'DEPOSIT' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">
                    {tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">{tx.date.toLocaleString()}</p>
                  <p className="text-xs text-zinc-600 font-mono mt-0.5">ID: {tx.id}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`font-bold text-lg ${tx.type === 'DEPOSIT' ? 'text-green-500' : 'text-white'}`}>
                  {tx.type === 'DEPOSIT' ? '+' : '-'}🪙{tx.amount}
                </span>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${tx.status === 'SUCCESS' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {tx.status === 'SUCCESS' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  <span>{tx.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
