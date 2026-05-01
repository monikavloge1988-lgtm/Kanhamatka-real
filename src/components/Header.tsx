import { LogOut } from 'lucide-react';

interface HeaderProps {
  wallet: number;
}

export function Header({ wallet }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-4 border-b border-[#1c1c1e] bg-[#09090b] relative z-20">
      <h1 className="text-[1.35rem] font-bold text-[#facc15] tracking-tight mt-1">GoldSpinner</h1>
      <div className="flex items-center gap-3 bg-[#151516] px-4 py-2 rounded-xl border border-[#2a2a2d]">
        <div className="flex items-center gap-1.5">
          <span className="text-[#facc15] text-[1.1rem]">🪙</span>
          <span className="text-white font-bold text-[1.1rem] leading-none">{wallet.toLocaleString()}</span>
        </div>
      </div>
    </header>
  );
}
