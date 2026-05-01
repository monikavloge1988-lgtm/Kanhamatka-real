import { User, Wallet, History, Headset, ChevronRight, Settings, ShieldCheck } from 'lucide-react';
import { TabType } from '../types';

interface TabAccountProps {
  wallet: number;
  setActiveTab: (tab: TabType) => void;
}

export function TabAccount({ wallet, setActiveTab }: TabAccountProps) {
  return (
    <div className="p-4 pb-24">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[#1a1a1c] to-[#0c0c0e] border border-[#2a2a2d] rounded-3xl p-6 mb-6 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#facc15] opacity-5 rounded-full blur-3xl"></div>
        <div className="w-16 h-16 bg-[#2a2a2d] rounded-full flex items-center justify-center border-2 border-[#1c1c1e] shadow-lg shrink-0">
          <User size={32} className="text-zinc-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-1">Player User</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#1c1c1e] text-zinc-400 px-2 py-1 rounded-md font-mono border border-[#2a2a2d]">ID: 84938492</span>
            <span className="text-xs bg-green-500/20 border border-green-500/30 text-green-400 px-2 py-1 rounded-md flex items-center gap-1">
              <ShieldCheck size={12} /> Verified
            </span>
          </div>
        </div>
      </div>

      {/* Balance Summary */}
      <div className="bg-[#151516] border border-[#2a2a2d] rounded-3xl p-5 mb-6 shadow-lg">
        <p className="text-sm text-zinc-500 mb-2 font-semibold tracking-wider uppercase">Total Balance</p>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">🪙</span>
          <span className="text-3xl font-bold text-white">{wallet.toLocaleString()}</span>
        </div>
        <div className="flex gap-3">
          <button 
            className="flex-1 py-2.5 bg-[#14532d]/40 border border-[#166534] text-[#4ade80] rounded-xl font-bold hover:bg-[#14532d]/80 transition-colors"
            onClick={() => setActiveTab('WALLET')}
          >
            Deposit
          </button>
          <button 
            className="flex-1 py-2.5 bg-[#7f1d1d]/40 border border-[#991b1b] text-[#f87171] rounded-xl font-bold hover:bg-[#7f1d1d]/80 transition-colors"
            onClick={() => setActiveTab('WALLET')}
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Menu Options */}
      <div className="bg-[#151516] border border-[#2a2a2d] rounded-3xl overflow-hidden shadow-lg">
        <MenuOption 
          icon={<Wallet className="text-[#facc15]" size={20} />}
          title="Wallet Details"
          onClick={() => setActiveTab('WALLET')}
        />
        <MenuOption 
          icon={<History className="text-blue-400" size={20} />}
          title="Transaction History"
          onClick={() => setActiveTab('ACTIVITY')}
        />
        <MenuOption 
          icon={<Headset className="text-green-400" size={20} />}
          title="Customer Support"
          onClick={() => window.open('https://t.me/@MATKAGAMESUPPORT', '_blank')}
        />
        <MenuOption 
          icon={<Settings className="text-zinc-400" size={20} />}
          title="Settings"
          onClick={() => alert('Settings coming soon')}
          hasBorder={false}
        />
      </div>
    </div>
  );
}

function MenuOption({ icon, title, onClick, hasBorder = true }: { icon: React.ReactNode, title: string, onClick: () => void, hasBorder?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-5 hover:bg-[#1c1c1e] transition-colors ${hasBorder ? 'border-b border-[#2a2a2d]' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#1e1e21] flex items-center justify-center">
          {icon}
        </div>
        <span className="text-white font-medium">{title}</span>
      </div>
      <ChevronRight size={20} className="text-zinc-600" />
    </button>
  );
}
