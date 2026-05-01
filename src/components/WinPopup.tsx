import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Coins } from 'lucide-react';

interface WinPopupProps {
  show: boolean;
  onClose: () => void;
  winData: {
    number: number;
    amount: number;
    payout: number;
  } | null;
}

export function WinPopup({ show, onClose, winData }: WinPopupProps) {
  const [multiplier, setMultiplier] = useState(1);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (show && winData) {
      setMultiplier(1);
      // Animate multiplier from 1 to 9 over 1.5 seconds purely visually
      let currentMul = 1;
      timer = setInterval(() => {
        if (currentMul < 9) {
          currentMul += 1;
          setMultiplier(currentMul);
        } else {
          clearInterval(timer);
        }
      }, 150);
    }
    return () => clearInterval(timer);
  }, [show, winData]);

  if (!winData) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto"
          onClick={onClose}
        >
          {/* Main Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300, mass: 0.8 }}
            className="w-full max-w-sm bg-gradient-to-b from-[#1c1c1f] to-[#09090b] rounded-[2rem] border border-[#facc15]/30 p-8 shadow-[0_0_50px_rgba(250,204,21,0.2)] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()} // prevent closing on inner click
          >
            {/* Glow effects */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#facc15]/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#facc15]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-[#facc15] to-[#ca8a04] rounded-full flex items-center justify-center shadow-xl shadow-[#facc15]/20 mb-6"
              >
                <Trophy size={40} className="text-black" />
              </motion.div>

              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#facc15] to-[#fef08a] mb-2 text-center uppercase tracking-wider">
                You Won!
              </h2>

              <p className="text-zinc-400 text-sm mb-6 text-center">
                Congratulations! You bet on winning number <span className="text-white font-bold">{winData.number}</span>
              </p>

              <div className="w-full bg-[#151516] border border-[#facc15]/20 rounded-2xl p-4 mb-6 relative">
                {/* Stats */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Entry</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    <Coins size={14} className="text-zinc-400" /> {winData.amount}
                  </span>
                </div>

                <div className="h-px w-full bg-[#facc15]/10 mb-3"></div>

                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Multiplier</span>
                  <motion.div 
                    key={multiplier}
                    initial={{ scale: 1.5, color: '#ffffff' }}
                    animate={{ scale: 1, color: '#facc15' }}
                    className="text-[#facc15] font-black italic text-xl"
                  >
                    {multiplier}x
                  </motion.div>
                </div>
              </div>

              {/* Total Payout */}
              <div className="text-center mb-8">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest block mb-1">Total Payout</span>
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="text-4xl font-black text-white flex items-center justify-center gap-2"
                >
                  <Coins size={28} className="text-[#facc15]" />
                  {winData.payout}
                </motion.div>
              </div>

              <button 
                onClick={onClose}
                className="w-full bg-gradient-to-r from-[#facc15] to-[#eab308] text-black font-bold py-4 rounded-xl hover:brightness-110 transition-all shadow-lg"
              >
                Awesome!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
