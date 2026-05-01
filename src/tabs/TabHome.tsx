import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, X } from 'lucide-react';
import { Spinner, GameState } from '../components/Spinner';
import { BettingControls } from '../components/BettingControls';
import { ResultHistory, RoundResult } from '../components/ResultHistory';
import { WinPopup } from '../components/WinPopup';

const PATTERN = [
  { number: 7, id: 'AX7P812K' },
  { number: 2, id: 'B2Q91LMX' },
  { number: 9, id: 'Z9X812AB' },
  { number: 1, id: 'M1L78QPX' },
  { number: 5, id: 'K5Q812LM' },
  { number: 8, id: 'P8X91ABZ' },
  { number: 3, id: 'C3L781QP' },
  { number: 0, id: 'D0Z812LM' },
  { number: 6, id: 'E6Q91ABX' },
  { number: 4, id: 'F4X781LM' },

  { number: 4, id: 'G4P812ZX' },
  { number: 1, id: 'H1Q91LMX' },
  { number: 8, id: 'J8X812AB' },
  { number: 2, id: 'K2L78QPX' },
  { number: 9, id: 'L9Q812LM' },
  { number: 5, id: 'M5X91ABZ' },
  { number: 7, id: 'N7L781QP' },
  { number: 3, id: 'P3Z812LM' },
  { number: 6, id: 'Q6Q91ABX' },
  { number: 0, id: 'R0X781LM' },

  { number: 6, id: 'S6P812ZX' },
  { number: 3, id: 'T3Q91LMX' },
  { number: 0, id: 'U0X812AB' },
  { number: 9, id: 'V9L78QPX' },
  { number: 2, id: 'W2Q812LM' },
  { number: 7, id: 'X7X91ABZ' },
  { number: 1, id: 'Y1L781QP' },
  { number: 8, id: 'Z8Z812LM' },
  { number: 5, id: 'A5Q91ABX' },
  { number: 4, id: 'B4X781LM' },

  { number: 1, id: 'C1P812ZX' },
  { number: 9, id: 'D9Q91LMX' },
  { number: 4, id: 'E4X812AB' },
  { number: 6, id: 'F6L78QPX' },
  { number: 3, id: 'G3Q812LM' },
  { number: 0, id: 'H0X91ABZ' },
  { number: 2, id: 'J2L781QP' },
  { number: 7, id: 'K7Z812LM' },
  { number: 8, id: 'L8Q91ABX' },
  { number: 5, id: 'M5X781LM' },

  { number: 8, id: 'N8P812ZX' },
  { number: 5, id: 'P5Q91LMX' },
  { number: 2, id: 'Q2X812AB' },
  { number: 7, id: 'R7L78QPX' },
  { number: 1, id: 'S1Q812LM' },
  { number: 4, id: 'T4X91ABZ' },
  { number: 9, id: 'U9L781QP' },
  { number: 6, id: 'V6Z812LM' },
  { number: 0, id: 'W0Q91ABX' },
  { number: 3, id: 'X3X781LM' },

  { number: 3, id: 'Y3P812ZX' },
  { number: 6, id: 'Z6Q91LMX' },
  { number: 7, id: 'A7X812AB' },
  { number: 5, id: 'B5L78QPX' },
  { number: 8, id: 'C8Q812LM' },
  { number: 2, id: 'D2X91ABZ' },
  { number: 0, id: 'E0L781QP' },
  { number: 1, id: 'F1Z812LM' },
  { number: 4, id: 'G4Q91ABX' },
  { number: 9, id: 'H9X781LM' },

  { number: 9, id: 'J9P812ZX' },
  { number: 0, id: 'K0Q91LMX' },
  { number: 1, id: 'L1X812AB' },
  { number: 3, id: 'M3L78QPX' },
  { number: 4, id: 'N4Q812LM' },
  { number: 6, id: 'P6X91ABZ' },
  { number: 5, id: 'Q5L781QP' },
  { number: 2, id: 'R2Z812LM' },
  { number: 7, id: 'S7Q91ABX' },
  { number: 8, id: 'T8X781LM' },

  { number: 2, id: 'U2P812ZX' },
  { number: 8, id: 'V8Q91LMX' },
  { number: 6, id: 'W6X812AB' },
  { number: 4, id: 'X4L78QPX' },
  { number: 7, id: 'Y7Q812LM' },
  { number: 1, id: 'Z1X91ABZ' },
  { number: 3, id: 'A3L781QP' },
  { number: 9, id: 'B9Z812LM' },
  { number: 0, id: 'C0Q91ABX' },
  { number: 5, id: 'D5X781LM' },

  { number: 5, id: 'E5P812ZX' },
  { number: 7, id: 'F7Q91LMX' },
  { number: 3, id: 'G3X812AB' },
  { number: 8, id: 'H8L78QPX' },
  { number: 0, id: 'J0Q812LM' },
  { number: 9, id: 'K9X91ABZ' },
  { number: 4, id: 'L4L781QP' },
  { number: 6, id: 'M6Z812LM' },
  { number: 2, id: 'N2Q91ABX' },
  { number: 1, id: 'P1X781LM' },

  { number: 0, id: 'Q0P812ZX' },
  { number: 4, id: 'R4Q91LMX' },
  { number: 5, id: 'S5X812AB' },
  { number: 2, id: 'T2L78QPX' },
  { number: 6, id: 'U6Q812LM' },
  { number: 3, id: 'V3X91ABZ' },
  { number: 8, id: 'W8L781QP' },
  { number: 7, id: 'X7Z812LM' },
  { number: 1, id: 'Y1Q91ABX' },
  { number: 9, id: 'Z9X781LM' }
];

const getNextPatternIndex = () => {
  let nextIndex = parseInt(localStorage.getItem('spinPatternIndexV2') || '0', 10);
  if (isNaN(nextIndex) || nextIndex >= PATTERN.length) {
    nextIndex = 0;
  }
  return nextIndex;
};

interface TabHomeProps {
  wallet: number;
  setWallet: Dispatch<SetStateAction<number>>;
}

export function TabHome({ wallet, setWallet }: TabHomeProps) {
  const [gameState, setGameState] = useState<GameState>('BETTING');
  const [timeLeft, setTimeLeft] = useState(20);
  const [roundId, setRoundId] = useState(PATTERN[getNextPatternIndex()].id);
  
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [currentBet, setCurrentBet] = useState<{ number: number; amount: number } | null>(null);
  
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [resultNumber, setResultNumber] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [winData, setWinData] = useState<{ number: number; amount: number; payout: number; } | null>(null);
  const [showWinPopup, setShowWinPopup] = useState(false);
  
  // Spinner physical state
  const [rotation, setRotation] = useState(0);

  // Game Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gameState === 'BETTING') {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      } else {
        // Transition to spinning
        setGameState('SPINNING');
        
        // Determine result
        let nextIndex = getNextPatternIndex();
        const winItem = PATTERN[nextIndex];
        localStorage.setItem('spinPatternIndexV2', (nextIndex + 1).toString());
        
        setResultNumber(winItem.number);
        
        // Calculate rotation.
        const targetAngle = 360 - (winItem.number * 36);
        const newRotation = rotation + (360 * 10) + targetAngle - (rotation % 360);
        
        setRotation(newRotation);
      }
    } else if (gameState === 'RESULT') {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      } else {
        // Reset for next betting round
        setGameState('BETTING');
        setRoundId(PATTERN[getNextPatternIndex()].id);
        setTimeLeft(20);
        setResultNumber(null);
        setCurrentBet(null);
        setSelectedNumber(null);
      }
    }

    return () => clearTimeout(timer);
  }, [timeLeft, gameState, roundId, rotation]);

  const handleSpinComplete = () => {
    setGameState('RESULT');
    setTimeLeft(5); // 5 seconds showing result
    
    // Process bets
    let betResult;
    if (currentBet) {
      const isWin = currentBet.number === resultNumber;
      const payout = isWin ? currentBet.amount * 9 : -currentBet.amount;
      
      betResult = {
        number: currentBet.number,
        amount: currentBet.amount,
        payout,
        isWin
      };

      if (isWin) {
        // 9x payout + original bet back = 10x total added or w + amount * 9 meaning profit
        setWallet(w => w + currentBet.amount * 9);
        setWinData({
          number: currentBet.number,
          amount: currentBet.amount,
          payout: currentBet.amount * 9
        });
        setTimeout(() => setShowWinPopup(true), 500); // Small delay to let spinner stop completely
      }
    }
    
    if (resultNumber !== null) {
      setHistory(prev => [{ 
        id: roundId, 
        result: resultNumber,
        bet: betResult
      }, ...prev].slice(0, 10)); // Keep last 10
    }
  };

  const handlePlaceBet = (number: number, amount: number) => {
    if (wallet >= amount) {
      setWallet(w => w - amount);
      setCurrentBet({ number, amount });
    } else {
      alert("Insufficient funds!");
    }
  };

  return (
    <div className="pb-24">
      {/* Top action row containing the history button, visually right beneath the app header's wallet */}
      <div className="flex justify-end px-4 pt-4 -mb-2 relative z-20">
        <button 
          onClick={() => setShowHistory(true)}
          className="bg-[#151516] border border-[#2a2a2d] text-zinc-300 text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#2a2a2d] transition-colors shadow-lg"
        >
          <History size={14} className="text-[#facc15]" /> Bet History
        </button>
      </div>

      <Spinner 
        gameState={gameState} 
        timeLeft={timeLeft} 
        roundId={roundId} 
        rotation={rotation}
        resultNumber={resultNumber}
        onSpinComplete={handleSpinComplete}
      />
      
      <BettingControls 
        disabled={gameState !== 'BETTING' || currentBet !== null}
        onPlaceBet={handlePlaceBet}
        selectedNumber={selectedNumber}
        setSelectedNumber={setSelectedNumber}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
      />

      <ResultHistory history={history} isBetHistory={false} />

      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex flex-col justify-end pointer-events-auto"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-[#151516] rounded-t-[2.5rem] mt-24 h-full flex flex-col border-t border-[#2a2a2d]"
            >
              <div className="flex justify-between items-center p-6 border-b border-[#2a2a2d]">
                 <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                   <History className="text-[#facc15]" /> Bet History
                 </h2>
                 <button 
                   onClick={() => setShowHistory(false)} 
                   className="p-2 bg-[#1e1e21] rounded-full text-zinc-400 hover:text-white"
                 >
                   <X size={20} />
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 pb-24">
                <ResultHistory history={history} noBox={true} isBetHistory={true} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating bet indicator if bet is placed */}
      <AnimatePresence>
        {currentBet && gameState === 'BETTING' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#1a1a1c] border border-[#facc15]/30 text-[#facc15] px-6 py-3 rounded-full font-bold shadow-[0_4px_20px_rgba(250,204,21,0.2)] z-40 flex items-center gap-2 w-[90%] max-w-sm justify-center"
          >
            <span>Bet Placed:</span>
            <span className="text-white">🪙 {currentBet.amount}</span>
            <span className="text-zinc-500 font-normal">on</span>
            <span className="w-6 h-6 rounded-md bg-[#facc15] text-black flex items-center justify-center text-sm">{currentBet.number}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <WinPopup 
        show={showWinPopup} 
        onClose={() => setShowWinPopup(false)} 
        winData={winData} 
      />
    </div>
  );
}
