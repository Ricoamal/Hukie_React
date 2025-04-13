import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { X, Plus, DollarSign, CreditCard, RefreshCw, ArrowDownCircle, ArrowUpCircle, ShoppingBag } from 'lucide-react';
import WalletTopUp from './WalletTopUp';
import { useNotification } from '../contexts/NotificationContext';

interface WalletProps {
  onClose: () => void;
}

export default function Wallet({ onClose }: WalletProps) {
  const { balance, currency, transactions } = useWallet();
  const { showToast, addNotification } = useNotification();
  const [showTopUp, setShowTopUp] = useState(false);

  // Currency conversion rates (simplified for demo)
  const conversionRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.75,
    KES: 130.5, // Kenyan Shilling
    TOKENS: 10 // 1 USD = 10 Tokens
  };

  // Format currency
  const formatCurrency = (amount: number, currencyCode: string = currency) => {
    if (currencyCode === 'TOKENS') {
      return `${amount.toFixed(0)} Tokens`;
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  };

  // Convert amount to tokens
  const convertToTokens = (amount: number, fromCurrency: string = 'USD') => {
    const usdValue = amount / conversionRates[fromCurrency as keyof typeof conversionRates];
    return usdValue * conversionRates.TOKENS;
  };

  // Handle top up
  const handleTopUp = () => {
    setShowTopUp(true);
  };

  // Get transaction icon based on type
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle size={16} className="text-green-500" />;
      case 'withdrawal':
        return <ArrowUpCircle size={16} className="text-red-500" />;
      case 'purchase':
        return <ShoppingBag size={16} className="text-blue-500" />;
      default:
        return <DollarSign size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Your Wallet</h3>
          <button
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* Balance */}
        <div className="p-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg mx-4 mt-4 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium opacity-90">Current Balance</h4>
            <div className="flex items-center">
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                {currency}
              </span>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{formatCurrency(balance)}</span>
          </div>
          <div className="flex justify-between mt-6">
            <button
              className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center"
              onClick={() => setShowTopUp(true)}
            >
              <Plus size={16} className="mr-1" />
              Top Up
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center">
              <RefreshCw size={16} className="mr-1" />
              Convert
            </button>
          </div>
        </div>

        {/* Transaction history */}
        <div className="flex-1 overflow-y-auto p-4">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Transaction History</h4>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map(transaction => (
                <div key={transaction.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-full mr-3">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className={`font-medium ${
                        transaction.type === 'deposit' ? 'text-green-600' :
                        transaction.type === 'withdrawal' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {transaction.timestamp.toLocaleDateString()} at {transaction.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUp && (
        <WalletTopUp onClose={() => setShowTopUp(false)} />
      )}
    </div>
  );
}
