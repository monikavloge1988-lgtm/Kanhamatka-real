import { useState } from 'react';
import { Copy, Upload, ArrowRight, Wallet, CheckCircle2, AlertCircle } from 'lucide-react';

interface TabWalletProps {
  wallet: number;
  onDeposit: (amount: number, utr: string) => void;
  onWithdrawRequest: (amount: number, upiId: string) => boolean;
}

export function TabWallet({ wallet, onDeposit, onWithdrawRequest }: TabWalletProps) {
  const [activeSegment, setActiveSegment] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT');
  
  // Deposit state
  const [depositAmount, setDepositAmount] = useState('');
  const [depositStep, setDepositStep] = useState(1);
  const [utr, setUtr] = useState('');

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [withdrawStep, setWithdrawStep] = useState(1);

  const handleDepositSubmit = () => {
    if (utr.length < 5) return;
    onDeposit(Number(depositAmount), utr);
    // Reset and show success briefly
    alert('Deposit request submitted! Please wait for approval.');
    setDepositAmount('');
    setUtr('');
    setDepositStep(1);
  };

  const handleWithdrawSubmit = () => {
    const success = onWithdrawRequest(Number(withdrawAmount), upiId);
    if (!success) {
      alert('Insufficient funds!');
      return;
    }
    setWithdrawStep(2);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="p-4 pb-24">
      {/* Top segments */}
      <div className="flex p-1 bg-[#151516] rounded-xl border border-[#2a2a2d] mb-6">
        <button 
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeSegment === 'DEPOSIT' ? 'bg-[#2a2a2d] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
          onClick={() => setActiveSegment('DEPOSIT')}
        >
          Deposit
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeSegment === 'WITHDRAW' ? 'bg-[#2a2a2d] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
          onClick={() => setActiveSegment('WITHDRAW')}
        >
          Withdraw
        </button>
      </div>

      {activeSegment === 'DEPOSIT' && (
        <div className="bg-[#151516] border border-[#2a2a2d] rounded-3xl p-5 shadow-lg">
          {depositStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-zinc-400 mb-2 block">Deposit Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-yellow-500">🪙</span>
                  <input 
                    type="number" 
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-[#1e1e21] border border-[#2a2a2d] rounded-xl h-14 pl-12 pr-4 text-white text-lg font-mono focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[100, 500, 1000, 5000].map(amt => (
                  <button 
                    key={amt}
                    onClick={() => setDepositAmount(amt.toString())}
                    className="bg-[#1e1e21] border border-[#2a2a2d] py-2 rounded-lg text-zinc-300 font-mono hover:border-yellow-500/50 hover:text-white transition-colors"
                  >
                    {amt}
                  </button>
                ))}
              </div>

              <button 
                disabled={!depositAmount || Number(depositAmount) < 50}
                onClick={() => setDepositStep(2)}
                className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {depositStep === 2 && (
            <div className="space-y-6 flex flex-col items-center">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-2">Scan & Pay</h3>
                <p className="text-sm text-zinc-400">Pay 🪙{depositAmount} to the QR code below</p>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-xl">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=6398197590@ptyes&pn=Monika%20Ug%20Yashoda%20Kumari" 
                  alt="Payment QR"
                  className="w-48 h-48"
                />
              </div>

              <div className="w-full bg-[#1e1e21] border border-[#2a2a2d] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">UPI ID</p>
                  <p className="text-white font-mono text-sm">6398197590@ptyes</p>
                </div>
                <button onClick={() => copyToClipboard('6398197590@ptyes')} className="p-2 text-yellow-500 bg-yellow-500/10 rounded-lg">
                  <Copy size={18} />
                </button>
              </div>

              <div className="w-full space-y-4 pt-4 border-t border-[#2a2a2d]">
                <div>
                  <label className="text-sm font-semibold text-zinc-400 mb-2 block">Enter UTR / Ref No.</label>
                  <input 
                    type="text" 
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="12 digit UTR number"
                    className="w-full bg-[#1e1e21] border border-[#2a2a2d] rounded-xl h-12 px-4 text-white font-mono focus:outline-none focus:border-yellow-500 mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-zinc-400 mb-2 block flex items-center gap-2">
                    <Upload size={16} /> Upload Screenshot (Optional)
                  </label>
                  <input type="file" accept="image/*" className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500/10 file:text-yellow-500 hover:file:bg-yellow-500/20 w-full" />
                </div>
              </div>

              <div className="w-full flex gap-3 pt-2">
                <button 
                  onClick={() => setDepositStep(1)}
                  className="flex-1 py-4 border border-[#2a2a2d] text-zinc-400 font-bold rounded-xl"
                >
                  Back
                </button>
                <button 
                  disabled={utr.length < 5}
                  onClick={handleDepositSubmit}
                  className="flex-[2] bg-green-500 text-black font-bold py-4 rounded-xl disabled:opacity-50"
                >
                  Submit Payment
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSegment === 'WITHDRAW' && (
        <div className="bg-[#151516] border border-[#2a2a2d] rounded-3xl p-5 shadow-lg">
          {withdrawStep === 1 && (
            <div className="space-y-6">
              <div className="bg-[#1e1e21] p-4 rounded-xl flex items-center justify-between border border-[#2a2a2d]">
                <div className="flex items-center gap-3">
                  <Wallet className="text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Available Balance</p>
                    <p className="text-white font-bold">🪙 {wallet.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-zinc-400 mb-2 block">Withdraw Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-yellow-500">🪙</span>
                  <input 
                    type="number" 
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-[#1e1e21] border border-[#2a2a2d] rounded-xl h-14 pl-12 pr-4 text-white text-lg font-mono focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-zinc-400 mb-2 block">Your UPI ID</label>
                <input 
                  type="text" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@ybl"
                  className="w-full bg-[#1e1e21] border border-[#2a2a2d] rounded-xl h-14 px-4 text-white font-mono focus:outline-none focus:border-yellow-500"
                />
              </div>

              <button 
                disabled={!withdrawAmount || Number(withdrawAmount) < 100 || !upiId}
                onClick={handleWithdrawSubmit}
                className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors"
              >
                Withdraw Now
              </button>
            </div>
          )}

          {withdrawStep === 2 && (
            <div className="space-y-6 text-center py-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-2">
                <AlertCircle className="text-yellow-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Important Notice</h3>
              <p className="text-lg text-yellow-500 bg-yellow-500/10 px-4 py-3 rounded-lg border border-yellow-500/20 font-medium">
                Withdrawal lene ke liye DM kare!
              </p>
              
              <button 
                onClick={() => window.open('https://t.me/@MATKAGAMESUPPORT', '_blank')}
                className="w-full bg-[#0088cc] text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-[#0088cc]/20 mt-4 flex items-center justify-center gap-2"
              >
                Let's Contact for Withdrawal <ArrowRight size={20} />
              </button>

              <button 
                onClick={() => {
                  setWithdrawStep(1);
                  setWithdrawAmount('');
                  setUpiId('');
                  alert('Request sent to Activity Log. It will complete automatically.');
                }}
                className="mt-4 text-zinc-500 font-medium"
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
