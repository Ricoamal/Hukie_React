import React, { createContext, useState, useContext, ReactNode } from 'react';

// Transaction interface
interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase';
  amount: number;
  description: string;
  timestamp: Date;
}

// Wallet context interface
interface WalletContextType {
  balance: number;
  currency: string;
  transactions: Transaction[];
  addFunds: (amount: number) => void;
  withdrawFunds: (amount: number) => void;
  makePurchase: (amount: number, description: string) => boolean;
  changeCurrency: (newCurrency: string) => void;
}

// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Provider props
interface WalletProviderProps {
  children: ReactNode;
}

// Provider component
export function WalletProvider({ children }: WalletProviderProps) {
  const [balance, setBalance] = useState(100); // Start with $100 for demo
  const [currency, setCurrency] = useState('USD');
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'deposit',
      amount: 100,
      description: 'Initial deposit',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
    }
  ]);

  // Add funds to wallet
  const addFunds = (amount: number) => {
    if (amount <= 0) return;
    
    setBalance(prevBalance => prevBalance + amount);
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'deposit',
      amount,
      description: 'Deposit',
      timestamp: new Date()
    };
    
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };

  // Withdraw funds from wallet
  const withdrawFunds = (amount: number) => {
    if (amount <= 0 || amount > balance) return;
    
    setBalance(prevBalance => prevBalance - amount);
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'withdrawal',
      amount,
      description: 'Withdrawal',
      timestamp: new Date()
    };
    
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };

  // Make a purchase
  const makePurchase = (amount: number, description: string): boolean => {
    if (amount <= 0 || amount > balance) return false;
    
    setBalance(prevBalance => prevBalance - amount);
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'purchase',
      amount,
      description,
      timestamp: new Date()
    };
    
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    return true;
  };

  // Change currency
  const changeCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    // In a real app, this would convert the balance to the new currency
  };

  const value = {
    balance,
    currency,
    transactions,
    addFunds,
    withdrawFunds,
    makePurchase,
    changeCurrency
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

// Custom hook to use the wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
