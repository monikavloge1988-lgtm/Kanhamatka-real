import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Spinner, GameState } from '../components/Spinner';
import { BettingControls } from '../components/BettingControls';
import { ResultHistory, RoundResult } from '../components/ResultHistory';

const generateRoundId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
};

interface TabHomeProps {
  wallet: number;
  setWallet: React.Dispatch<React.SetStateAction<number>>;
}

export function TabHome({ wallet, setWallet }: TabHomeProps) {
  const [gameState, setGameState] = useState<GameState>('BETTING');
  const [timeLeft, setTimeLeft] = useState(20);
  const [roundId, setRoundId] = useState(generateRoundId());
  
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [currentBet, setCurrentBet] = useState<{ number: number; amount: number } | null>(null);
  
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [resultNumber, setResultNumber] = useState<number | null>(null);
  
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
        const winNum = Math.floor(Math.random() * 10);
        setResultNumber(winNum);
        
        // Calculate rotation.
        const targetAngle = 360 - (winNum * 36);
        const newRotation = rotation + (360 * 10) + targetAngle - (rotation % 360);
        
        setRotation(newRotation);
      }
    } else if (gameState === 'RESULT') {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      } else {
        // Reset for next betting round
        setGameState('BETTING');
        setRoundId(generateRoundId());
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
    if (currentBet && currentBet.number === resultNumber) {
      // Win!
      setWallet(w => w + currentBet.amount * 9); // 9x payout
    }
    
    if (resultNumber !== null) {
      setHistory(prev => [{ id: roundId, result: resultNumber }, ...prev].slice(0, 10)); // Keep last 10
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

      <ResultHistory history={history} />

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
    </div>
  );
}
