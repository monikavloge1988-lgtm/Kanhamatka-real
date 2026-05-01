import { useState, FormEvent, ReactNode } from 'react';
import { User, Wallet, History, Headset, ChevronRight, Settings, ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';
import { TabType } from '../types';
import { auth } from '../firebase';
import { updatePassword, signOut, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

interface TabAccountProps {
  wallet: number;
  setActiveTab: (tab: TabType) => void;
}

export function TabAccount({ wallet, setActiveTab }: TabAccountProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const user = auth.currentUser;

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || user.providerData[0]?.providerId === 'google.com') {
      setIsError(true);
      setMessage('Cannot change password for Google-managed accounts.');
      return;
    }
    
    if (!user.email) return;
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setIsError(false);
      setMessage('Password updated successfully!');
      setNewPassword('');
      setCurrentPassword('');
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || 'Failed to update password. Check current password.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (showSettings) {
    return (
      <div className="p-4 pb-24">
        <button onClick={() => setShowSettings(false)} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6">
          <ArrowLeft size={20} /> Back to Profile
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

        <div className="bg-[#151516] border border-[#2a2a2d] rounded-3xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
          
          {message && (
            <div className={`p-3 rounded-xl text-sm mb-4 ${isError ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#1e1e21] border border-[#2a2a2d] rounded-xl h-12 px-4 text-white focus:outline-none focus:border-[#facc15]/50"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#1e1e21] border border-[#2a2a2d] rounded-xl h-12 px-4 text-white focus:outline-none focus:border-[#facc15]/50"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-[#facc15] text-black font-bold py-3 rounded-xl hover:bg-[#eab308] transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>

        <button 
          onClick={handleSignOut}
          className="w-full bg-red-500/10 border border-red-500/20 text-red-500 font-bold py-4 rounded-3xl hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[#1a1a1c] to-[#0c0c0e] border border-[#2a2a2d] rounded-3xl p-6 mb-6 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#facc15] opacity-5 rounded-full blur-3xl"></div>
        <div className="w-16 h-16 bg-[#2a2a2d] rounded-full flex items-center justify-center border-2 border-[#1c1c1e] shadow-lg shrink-0">
          <User size={32} className="text-zinc-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-1 overflow-hidden text-ellipsis whitespace-nowrap">{user?.email || 'Player User'}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#1c1c1e] text-zinc-400 px-2 py-1 rounded-md font-mono border border-[#2a2a2d]">ID: {user?.uid.substring(0,8).toUpperCase() || '84938492'}</span>
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
          onClick={() => setShowSettings(true)}
          hasBorder={false}
        />
      </div>
    </div>
  );
}

function MenuOption({ icon, title, onClick, hasBorder = true }: { icon: ReactNode, title: string, onClick: () => void, hasBorder?: boolean }) {
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
