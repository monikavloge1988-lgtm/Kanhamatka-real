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
      <h3 className="text-zinc-200 text-[1.1rem] mb-3">Bet Amount</h3>
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center bg-[#1e1e21] rounded-xl overflow-hidden border border-[#2a2a2d]">
          <button 
            className="w-16 py-3 text-zinc-400 hover:text-white hover:bg-[#2a2a2d] transition-colors disabled:opacity-50 text-xl font-medium"
            onClick={() => handleAmountChange(-10)}
            disabled={disabled}
          >
            -
          </button>
          <input 
            type="number"
            className="flex-1 bg-transparent text-center font-mono text-[1.35rem] font-medium text-white outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={betAmount === 0 ? '' : betAmount}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val >= 1) {
                setBetAmount(val);
              } else if (e.target.value === '') {
                setBetAmount(0); // Temporary 0 for empty state
              }
            }}
            disabled={disabled}
            placeholder="0"
            min="1"
          />
          <button 
            className="w-16 py-3 text-zinc-400 hover:text-white hover:bg-[#2a2a2d] transition-colors disabled:opacity-50 text-xl font-medium"
            onClick={() => handleAmountChange(10)}
            disabled={disabled}
          >
            +
          </button>
        </div>
        
        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[10, 50, 100, 500].map(amount => (
            <button
              key={amount}
              disabled={disabled}
              onClick={() => setBetAmount(amount)}
              className="py-2 bg-[#1e1e21] hover:bg-[#2a2a2d] text-zinc-400 hover:text-zinc-200 rounded-lg text-sm transition-colors border border-[#2a2a2d] disabled:opacity-50"
            >
              +{amount}
            </button>
          ))}
        </div>
      </div>

      {/* Place Bet Button */}
      <button
        disabled={disabled || selectedNumber === null || betAmount < 1}
        onClick={() => {
          if (selectedNumber !== null && betAmount >= 1) onPlaceBet(selectedNumber, betAmount);
        }}
        className={`
          w-full py-4 rounded-xl text-lg font-bold transition-all
          ${(!disabled && selectedNumber !== null && betAmount >= 1)
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
