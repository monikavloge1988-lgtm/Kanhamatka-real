/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TabHome } from './tabs/TabHome';
import { TabActivity } from './tabs/TabActivity';
import { TabWallet } from './tabs/TabWallet';
import { TabAccount } from './tabs/TabAccount';
import { TabType, Transaction } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('HOME');
  const [wallet, setWallet] = useState(2050);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Check for pending transactions and update them after 1 minute
  useEffect(() => {
    const pendingTxs = transactions.filter(tx => tx.status === 'PENDING');
    if (pendingTxs.length === 0) return;

    const timeouts = pendingTxs.map(tx => {
      const timeElapsed = Date.now() - tx.date.getTime();
      const timeRemaining = Math.max(0, 60000 - timeElapsed);

      return setTimeout(() => {
        setTransactions(prev => prev.map(t => {
          if (t.id === tx.id && t.status === 'PENDING') {
            // Update wallet on success deposit
            if (t.type === 'DEPOSIT') {
              setWallet(w => w + t.amount);
            }
            return { ...t, status: 'SUCCESS' };
          }
          return t;
        }));
      }, timeRemaining);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [transactions]);

  const handleDeposit = (amount: number, utr: string) => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substring(2, 10).toUpperCase(),
      type: 'DEPOSIT',
      amount,
      status: 'PENDING',
      date: new Date(),
      utr
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleWithdrawRequest = (amount: number, upiId: string) => {
    if (wallet < amount) return false;
    setWallet(w => w - amount); // Deduct immediately
    const newTx: Transaction = {
      id: Math.random().toString(36).substring(2, 10).toUpperCase(),
      type: 'WITHDRAWAL',
      amount,
      status: 'PENDING',
      date: new Date(),
      upiId
    };
    setTransactions(prev => [newTx, ...prev]);
    return true;
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center sm:py-8">
      <div className="w-full max-w-md bg-[#09090b] min-h-screen sm:min-h-[800px] sm:h-[800px] sm:rounded-[2.5rem] text-white font-sans relative overflow-hidden flex flex-col shadow-2xl sm:border border-[#1a1a1c]">
        <Header wallet={wallet} />
        
        <main className="flex-1 overflow-y-auto no-scrollbar pt-2 relative z-10 pb-20">
          <div style={{ display: activeTab === 'HOME' ? 'block' : 'none' }}>
            <TabHome wallet={wallet} setWallet={setWallet} />
          </div>
          <div style={{ display: activeTab === 'ACTIVITY' ? 'block' : 'none' }}>
            <TabActivity transactions={transactions} />
          </div>
          <div style={{ display: activeTab === 'WALLET' ? 'block' : 'none' }}>
            <TabWallet wallet={wallet} onDeposit={handleDeposit} onWithdrawRequest={handleWithdrawRequest} />
          </div>
          <div style={{ display: activeTab === 'ACCOUNT' ? 'block' : 'none' }}>
            <TabAccount wallet={wallet} setActiveTab={setActiveTab} />
          </div>
        </main>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

