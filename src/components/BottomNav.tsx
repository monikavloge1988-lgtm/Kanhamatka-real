import { Headset, FileText, Wallet, User } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const handleTabClick = (id: TabType) => {
    if (id === 'SUPPORT') {
      window.open('https://t.me/@MATKAGAMESUPPORT', '_blank');
    } else {
      setActiveTab(id);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full bg-[#151516]/95 backdrop-blur-md border-t border-[#2a2a2d] sm:rounded-b-[2.5rem] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 h-[4.5rem] flex items-center justify-between px-2 pb-2 pt-1">
      <NavItem 
        icon={<Headset size={24} />} 
        label="Support" 
        isActive={activeTab === 'SUPPORT'} 
        onClick={() => handleTabClick('SUPPORT')} 
      />
      <NavItem 
        icon={<FileText size={24} />} 
        label="Activity" 
        isActive={activeTab === 'ACTIVITY'} 
        onClick={() => handleTabClick('ACTIVITY')} 
      />
      
      {/* Center Home Button */}
      <div className="relative flex flex-col items-center justify-start flex-1 h-full cursor-pointer" onClick={() => handleTabClick('HOME')}>
        <div className="absolute -top-8 w-16 h-16 rounded-full bg-gradient-to-b from-[#facc15] to-[#ca8a04] p-1 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
          <div className="w-full h-full bg-[#151516] rounded-full flex items-center justify-center">
            <span className="text-3xl">💎</span>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-[#facc15] absolute bottom-1">Home</span>
      </div>

      <NavItem 
        icon={<Wallet size={24} />} 
        label="Wallet" 
        isActive={activeTab === 'WALLET'} 
        onClick={() => handleTabClick('WALLET')} 
      />
      <NavItem 
        icon={<User size={24} />} 
        label="Account" 
        isActive={activeTab === 'ACCOUNT'} 
        onClick={() => handleTabClick('ACCOUNT')} 
      />
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }) {
  return (
    <div 
      className="flex flex-col items-center justify-center flex-1 gap-1 cursor-pointer"
      onClick={onClick}
    >
      <div className={`${isActive ? 'text-[#facc15]' : 'text-zinc-500'} transition-colors`}>
        {icon}
      </div>
      <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-[#facc15]' : 'text-zinc-500'}`}>
        {label}
      </span>
    </div>
  );
}
