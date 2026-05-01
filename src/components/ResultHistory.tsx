import { History } from 'lucide-react';

export interface RoundResult {
  id: string;
  result: number;
}

interface ResultHistoryProps {
  history: RoundResult[];
}

export function ResultHistory({ history }: ResultHistoryProps) {
  return (
    <div className="bg-[#151516] border border-[#2a2a2d] m-4 mt-0 rounded-[2rem] p-6 shadow-lg min-h-[300px]">
      <div className="flex items-center gap-2 mb-6">
        <History className="text-[#facc15]" size={20} />
        <h3 className="text-zinc-200 text-[1.1rem]">Recent Results</h3>
      </div>
      
      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="text-center text-zinc-500 py-8">No results yet.</div>
        ) : (
          history.map((item, i) => (
            <div 
              key={item.id} 
              className={`
                flex items-center justify-between p-4 rounded-xl border
                ${i === 0 
                  ? 'bg-gradient-to-r from-[#19191b] to-[#222225] border-[#facc15]/30 shadow-[0_0_10px_rgba(250,204,21,0.1)]' 
                  : 'bg-[#1e1e21] border-[#2a2a2d]'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 tracking-wider">ROUND</span>
                <span className="font-mono text-zinc-300 text-sm tracking-widest">{item.id}</span>
              </div>
              <div className={`w-8 h-8 rounded border flex items-center justify-center ${i === 0 ? 'bg-[#facc15] border-[#facc15]/50' : 'bg-[#151516] border-[#2a2a2d]'}`}>
                <span className={`font-bold text-lg ${i === 0 ? 'text-black' : 'text-[#facc15]'}`}>{item.result}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
