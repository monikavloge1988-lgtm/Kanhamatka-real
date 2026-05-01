/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Login } from './Login';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TabHome } from './tabs/TabHome';
import { TabActivity } from './tabs/TabActivity';
import { TabWallet } from './tabs/TabWallet';
import { TabAccount } from './tabs/TabAccount';
import { TabType, Transaction } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('HOME');
  const [wallet, setWallet] = useState(0);
  // We'll manage transactions once auth state resolves
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoaded, setTxLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Check and create user profile if it doesn't exist
        const userRef = doc(db, 'users', currentUser.uid);
        
        let userDocSnap;
        try {
          userDocSnap = await getDoc(userRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            if (data.wallet !== undefined) {
              setWallet(data.wallet);
            }
            if (data.transactions) {
              // Parse dates strings safely
              const parsedTxs = data.transactions.map((t: any) => ({
                ...t,
                date: t.date?.toDate ? t.date.toDate() : new Date(t.date || Date.now())
              }));
              setTransactions(parsedTxs);
            }
          } else {
            // Create user profile if it doesn't exist
            await setDoc(userRef, {
              wallet: 0,
              transactions: [],
              createdAt: serverTimestamp()
            });
          }
        } catch (e) {
          console.error("Error loading transactions from firestore", e);
        }
        setTxLoaded(true);
      } else {
        setUser(null);
        setWallet(0);
        setTransactions([]);
        setTxLoaded(false);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Save transactions to both local storage and Firestore whenever they change
  useEffect(() => {
    if (user && txLoaded) {
      localStorage.setItem(`tx_history_${user.uid}`, JSON.stringify(transactions));
      setDoc(doc(db, 'users', user.uid), {
        transactions
      }, { merge: true });
    }
  }, [transactions, user, txLoaded]);
  const updateWallet = (newWalletOrUpdater: number | ((prev: number) => number)) => {
    setWallet((prev) => {
      const updated = typeof newWalletOrUpdater === 'function' ? newWalletOrUpdater(prev) : newWalletOrUpdater;
      if (user && updated !== prev) {
        setDoc(doc(db, 'users', user.uid), {
          wallet: updated
        }, { merge: true });
      }
      return updated;
    });
  };
  useEffect(() => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setWallet(docSnap.data().wallet || 0);
      }
    });

    return () => unsubscribeUser();
  }, [user]);

  // Handle local pending transactions
  useEffect(() => {
    const pendingTxs = transactions.filter(tx => tx.status === 'PENDING');
    if (pendingTxs.length === 0) return;

    const timeouts = pendingTxs.map(tx => {
      const timeElapsed = Date.now() - tx.date.getTime();
      const timeRemaining = Math.max(0, 60000 - timeElapsed);

      return setTimeout(() => {
        setTransactions(prev => prev.map(t => {
          if (t.id === tx.id && t.status === 'PENDING') {
            // Because we're not actually making backend transaction docs right now due to limit
            // we will just update the user doc if it was a DEPOSIT
            if (t.type === 'DEPOSIT' && user) {
              setWallet(prevWallet => {
                const updatedWallet = prevWallet + t.amount;
                setDoc(doc(db, 'users', user.uid), {
                  wallet: updatedWallet
                }, { merge: true }).catch(console.error);
                return updatedWallet;
              });
            }
            return { ...t, status: 'SUCCESS' };
          }
          return t;
        }));
      }, timeRemaining);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [transactions, wallet, user]);

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
    
    updateWallet(prev => prev - amount);

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

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#facc15] font-bold">Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center sm:py-8">
      <div className="w-full max-w-md bg-[#09090b] min-h-screen sm:min-h-[800px] sm:h-[800px] sm:rounded-[2.5rem] text-white font-sans relative overflow-hidden flex flex-col shadow-2xl sm:border border-[#1a1a1c]">
        <Header wallet={wallet} />
        
        <main className="flex-1 overflow-y-auto no-scrollbar pt-2 relative z-10 pb-20">
          <div style={{ display: activeTab === 'HOME' ? 'block' : 'none' }}>
            <TabHome wallet={wallet} setWallet={updateWallet} />
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

