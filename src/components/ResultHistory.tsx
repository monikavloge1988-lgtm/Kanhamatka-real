import { History } from 'lucide-react';

export interface RoundResult {
  id: string;
  result: number;
  bet?: {
    number: number;
    amount: number;
    payout: number;
    isWin: boolean;
  };
}

interface ResultHistoryProps {
  history: RoundResult[];
  noBox?: boolean;
  isBetHistory?: boolean;
}

export function ResultHistory({ history, noBox = false, isBetHistory = false }: ResultHistoryProps) {
  const containerClass = noBox 
    ? "" 
    : "bg-[#151516] border border-[#2a2a2d] m-4 mt-0 rounded-[2rem] p-6 shadow-lg min-h-[300px]";

  const displayHistory = isBetHistory ? history.filter(item => item.bet) : history;

  return (
    <div className={containerClass}>
      {!noBox && (
        <div className="flex items-center gap-2 mb-6">
          <History className="text-[#facc15]" size={20} />
          <h3 className="text-zinc-200 text-[1.1rem]">{isBetHistory ? 'Bet History' : 'Recent Results'}</h3>
        </div>
      )}
      
      <div className="space-y-3">
        {displayHistory.length === 0 ? (
          <div className="text-center text-zinc-500 py-8">No results yet.</div>
        ) : (
          displayHistory.map((item, i) => (
            <div 
              key={item.id} 
              className={`
                flex flex-col p-4 rounded-xl border gap-3
                ${i === 0 && !isBetHistory
                  ? 'bg-gradient-to-r from-[#19191b] to-[#222225] border-[#facc15]/30 shadow-[0_0_10px_rgba(250,204,21,0.1)]' 
                  : 'bg-[#1e1e21] border-[#2a2a2d]'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 tracking-wider">ROUND</span>
                  <span className="font-mono text-zinc-300 text-sm tracking-widest">{item.id}</span>
                </div>
                <div className={`w-8 h-8 rounded border flex items-center justify-center ${i === 0 && !isBetHistory ? 'bg-[#facc15] border-[#facc15]/50 text-black' : 'bg-[#151516] border-[#2a2a2d] text-[#facc15]'}`}>
                  <span className="font-bold text-lg">{item.result}</span>
                </div>
              </div>
              
              {isBetHistory && item.bet && (
                <div className={`flex items-center justify-between p-3 rounded-lg border ${item.bet.isWin ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-zinc-400">Your Bet: <span className="font-bold text-white">{item.bet.number}</span></span>
                    <span className="text-xs text-zinc-400">Amount: <span className="font-bold text-white">🪙 {item.bet.amount}</span></span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-sm font-bold ${item.bet.isWin ? 'text-green-500' : 'text-red-500'}`}>
                      {item.bet.isWin ? 'PROFIT' : 'LOSS'}
                    </span>
                    <span className={`text-sm font-bold ${item.bet.isWin ? 'text-green-400' : 'text-red-400'}`}>
                      {item.bet.isWin ? '+' : '-'} 🪙 {Math.abs(item.bet.payout)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
