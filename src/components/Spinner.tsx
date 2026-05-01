import { motion } from 'motion/react';
import { Clock } from 'lucide-react';

export type GameState = 'BETTING' | 'SPINNING' | 'RESULT';

interface SpinnerProps {
  gameState: GameState;
  timeLeft: number;
  roundId: string;
  rotation: number;
  resultNumber: number | null;
  onSpinComplete?: () => void;
}

export function Spinner({ gameState, timeLeft, roundId, rotation, resultNumber, onSpinComplete }: SpinnerProps) {
  const isBetting = gameState === 'BETTING';
  const isSpinning = gameState === 'SPINNING';
  const isResult = gameState === 'RESULT';

  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Dynamic colors based on state
  const ringColor = isBetting ? 'text-[#00e676]' : 'text-yellow-500';
  
  const circumference = 2 * Math.PI * 47;

  // Build the alternating background colors for the wheel.
  // 0 is at top (0deg). Its slice is from 342 to 18.
  const gradientParts = [
    '#19191b 0deg 18deg',  // right half of 0
    '#222225 18deg 54deg', // 1
    '#19191b 54deg 90deg', // 2
    '#222225 90deg 126deg', // 3
    '#19191b 126deg 162deg', // 4
    '#222225 162deg 198deg', // 5
    '#19191b 198deg 234deg', // 6
    '#222225 234deg 270deg', // 7
    '#19191b 270deg 306deg', // 8
    '#222225 306deg 342deg', // 9
    '#19191b 342deg 360deg'  // left half of 0
  ];
  const wheelBackground = `conic-gradient(${gradientParts.join(', ')})`;

  return (
    <div className="bg-[#151516] m-4 rounded-[2rem] p-6 flex flex-col items-center relative overflow-hidden border border-[#2a2a2d] shadow-lg">
      {/* Header Info */}
      <div className="w-full flex items-center gap-2 mb-6 text-zinc-400 text-sm font-medium tracking-wider">
        <div className={`w-2.5 h-2.5 rounded-full ${isBetting ? 'bg-[#00e676]' : 'bg-yellow-500'}`} />
        <span className="opacity-80">ROUND</span>
        <span className="font-mono text-zinc-300">{roundId}</span>
      </div>

      {/* Spinner Area */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        {/* Outer Ring with progress */}
        <div className={`absolute inset-0 rounded-full border-[6px] border-[#222225]`}></div>
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
          <motion.circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className={ringColor}
            strokeDasharray={circumference}
            initial={false}
            animate={{
              strokeDashoffset: isBetting 
                ? circumference * (1 - timeLeft / 20)
                : 0
            }}
            transition={{
              duration: isBetting ? 1 : 0.5,
              ease: "linear"
            }}
          />
        </svg>

        {/* Pointer Triangle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 drop-shadow-md">
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[18px] border-l-transparent border-r-transparent border-t-[#ef4444]" />
        </div>

        {/* The Wheel */}
        <motion.div 
          className="absolute inset-[8px] rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] overflow-hidden border border-[#2a2a2d]"
          style={{ background: wheelBackground }}
          animate={{ rotate: rotation }}
          transition={
            isSpinning 
              ? { duration: 10, ease: [0.15, 0.85, 0.25, 1] } 
              : { duration: 0 }
          }
          onAnimationComplete={() => {
            if (isSpinning) {
              onSpinComplete?.();
            }
          }}
        >
          {numbers.map((num, i) => {
            const lineAngle = i * 36 + 18;
            return (
              <div
                key={`line-${num}`}
                className="absolute inset-0 flex items-start justify-center origin-center"
                style={{ transform: `rotate(${lineAngle}deg)` }}
              >
                <div className="w-[1.5px] h-1/2 bg-[#111112]" />
              </div>
            );
          })}

          {numbers.map((num, i) => {
            const angle = i * 36;
            return (
              <div 
                key={num}
                className="absolute inset-0 flex items-start justify-center pt-3 origin-center"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <span 
                  className={`text-xl font-bold font-sans ${
                    resultNumber === num && isResult
                      ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]' 
                      : 'text-[#facc15] drop-shadow-[0_0_8px_rgba(250,204,21,0.2)]'
                  }`}
                >
                  {num}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* Center Display */}
        <div className="absolute w-[6.5rem] h-[6.5rem] bg-[#0c0c0e] rounded-full z-10 border-[6px] border-[#151516] flex items-center justify-center shadow-[inset_0_4px_15px_rgba(0,0,0,0.8),0_0_10px_rgba(0,0,0,0.5)]">
          <span className="text-[3rem] font-medium text-white drop-shadow-md">
            {isResult ? resultNumber : '?'}
          </span>
        </div>
      </div>

      {/* Status Text below spinner */}
      <div className="text-center">
        <h2 className="text-2xl font-light text-zinc-100 mb-2 whitespace-nowrap">
          {isBetting ? 'Place your bets!' : isSpinning ? 'PLEASE WAIT FOR RESULT' : `Result is ${resultNumber}!`}
        </h2>
        <div className={`flex items-center justify-center gap-2 font-mono ${ringColor}`}>
          {isBetting || isResult ? <Clock size={16} /> : <div className="w-4 h-4 rounded-full border-[2.5px] border-[currentColor] border-t-transparent animate-spin" />}
          <span>
            {isBetting ? `${timeLeft}s left to bet` : isSpinning ? 'spinning...' : `Next round soon...`}
          </span>
        </div>
      </div>
    </div>
  );
}
