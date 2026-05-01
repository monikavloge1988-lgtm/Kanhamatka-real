interface BettingControlsProps {
  onPlaceBet: (number: number, amount: number) => void;
  disabled: boolean;
  selectedNumber: number | null;
  setSelectedNumber: (n: number | null) => void;
  betAmount: number;
  setBetAmount: (a: number) => void;
}

export function BettingControls({ 
  onPlaceBet, 
  disabled, 
  selectedNumber, 
  setSelectedNumber, 
  betAmount, 
  setBetAmount 
}: BettingControlsProps) {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleAmountChange = (delta: number) => {
    setBetAmount(Math.max(10, betAmount + delta));
  };

  return (
    <div className="bg-[#151516] border border-[#2a2a2d] m-4 mt-0 rounded-[2rem] p-6 shadow-lg">
      <h3 className="text-zinc-200 text-[1.1rem] mb-4">Select Number</h3>
      
      {/* Number Grid */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {numbers.map(num => (
          <button
            key={num}
            disabled={disabled}
            onClick={() => setSelectedNumber(num)}
            className={`
              aspect-[5/4] rounded-xl text-xl font-medium transition-all
              ${selectedNumber === num 
                ? 'bg-[#facc15] text-black shadow-[0_0_15px_rgba(250,204,21,0.4)]' 
                : disabled
                  ? 'bg-[#1c1c1e] text-zinc-500 opacity-50 cursor-not-allowed'
                  : 'bg-[#1e1e21] text-zinc-400 hover:bg-[#2a2a2d] hover:text-zinc-200'
              }
            `}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Bet Amount */}
      <div className="flex items-center bg-[#1e1e21] rounded-xl mb-6 overflow-hidden border border-[#2a2a2d]">
        <button 
          className="w-16 py-4 text-zinc-400 hover:text-white hover:bg-[#2a2a2d] transition-colors disabled:opacity-50 text-xl font-medium"
          onClick={() => handleAmountChange(-100)}
          disabled={disabled}
        >
          -
        </button>
        <div className="flex-1 text-center font-mono text-[1.35rem] font-medium text-white">
          {betAmount}
        </div>
        <button 
          className="w-16 py-4 text-zinc-400 hover:text-white hover:bg-[#2a2a2d] transition-colors disabled:opacity-50 text-xl font-medium"
          onClick={() => handleAmountChange(100)}
          disabled={disabled}
        >
          +
        </button>
      </div>

      {/* Place Bet Button */}
      <button
        disabled={disabled || selectedNumber === null}
        onClick={() => {
          if (selectedNumber !== null) onPlaceBet(selectedNumber, betAmount);
        }}
        className={`
          w-full py-4 rounded-xl text-lg font-bold transition-all
          ${(!disabled && selectedNumber !== null)
            ? 'bg-gradient-to-b from-[#facc15] to-[#eab308] text-black hover:from-[#eab308] hover:to-[#ca8a04] shadow-[0_4px_20px_rgba(250,204,21,0.3)]'
            : 'bg-[#1e1e21] text-[#3f3f46] border border-[#2a2a2d] cursor-not-allowed'
          }
        `}
      >
        Place Bet
      </button>
    </div>
  );
}
