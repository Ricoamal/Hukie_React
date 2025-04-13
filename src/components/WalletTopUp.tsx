import { useState } from 'react';
import { X, CreditCard, Phone, Check, AlertCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useNotification } from '../contexts/NotificationContext';

interface WalletTopUpProps {
  onClose: () => void;
}

export default function WalletTopUp({ onClose }: WalletTopUpProps) {
  const { addFunds } = useWallet();
  const { showToast, addNotification } = useNotification();
  const [topUpAmount, setTopUpAmount] = useState<number>(50);
  const [paymentMethod, setPaymentMethod] = useState<'select' | 'mpesa' | 'card'>('select');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // M-Pesa specific state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mpesaCode, setMpesaCode] = useState('');
  const [mpesaStep, setMpesaStep] = useState<'phone' | 'code'>('phone');

  // Card specific state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Currency conversion rates (simplified for demo)
  const conversionRates = {
    USD: 1,
    KES: 130.5, // Kenyan Shilling
    TOKENS: 10 // 1 USD = 10 Tokens
  };

  // Convert amount to tokens
  const convertToTokens = (amount: number, fromCurrency: string = 'USD') => {
    const usdValue = amount / (conversionRates[fromCurrency as keyof typeof conversionRates] || 1);
    return usdValue * conversionRates.TOKENS;
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }

    return v;
  };

  // Handle M-Pesa payment
  const handleMpesaPayment = () => {
    if (mpesaStep === 'phone') {
      // Validate phone number
      if (!phoneNumber || phoneNumber.length < 10) {
        setErrorMessage('Please enter a valid phone number');
        setPaymentStatus('error');
        return;
      }

      setPaymentStatus('processing');

      // Simulate sending M-Pesa prompt
      setTimeout(() => {
        setPaymentStatus('idle');
        setMpesaStep('code');
      }, 2000);

      return;
    }

    // Validate M-Pesa code
    if (!mpesaCode || mpesaCode.length < 6) {
      setErrorMessage('Please enter a valid M-Pesa code');
      setPaymentStatus('error');
      return;
    }

    // Process payment
    processPayment();
  };

  // Handle card payment
  const handleCardPayment = () => {
    // Validate card details
    if (!cardNumber || cardNumber.length < 16) {
      setErrorMessage('Please enter a valid card number');
      setPaymentStatus('error');
      return;
    }

    if (!cardName) {
      setErrorMessage('Please enter the cardholder name');
      setPaymentStatus('error');
      return;
    }

    if (!expiryDate || expiryDate.length < 5) {
      setErrorMessage('Please enter a valid expiry date');
      setPaymentStatus('error');
      return;
    }

    if (!cvv || cvv.length < 3) {
      setErrorMessage('Please enter a valid CVV');
      setPaymentStatus('error');
      return;
    }

    // Process payment
    processPayment();
  };

  // Process payment (common for both methods)
  const processPayment = () => {
    setPaymentStatus('processing');

    // Simulate payment processing
    setTimeout(() => {
      // 90% chance of success for demo purposes
      const isSuccess = Math.random() < 0.9;

      if (isSuccess) {
        const tokenAmount = convertToTokens(topUpAmount, paymentMethod === 'mpesa' ? 'KES' : 'USD');
        addFunds(tokenAmount);
        setPaymentStatus('success');

        // Show toast notification
        showToast('success', `${tokenAmount.toFixed(0)} tokens added to your wallet`);

        // Add to notification center
        addNotification({
          type: 'success',
          title: 'Wallet Top-up Successful',
          message: `You've added ${tokenAmount.toFixed(0)} tokens to your wallet using ${paymentMethod === 'mpesa' ? 'M-Pesa' : 'card'}.`,
        });
      } else {
        setPaymentStatus('error');
        setErrorMessage('Transaction failed. Please try again.');

        // Show toast notification for error
        showToast('error', 'Payment failed. Please try again.');
      }
    }, 2000);
  };

  // Reset to payment method selection
  const resetPaymentMethod = () => {
    setPaymentMethod('select');
    setPaymentStatus('idle');
    setMpesaStep('phone');
    setPhoneNumber('');
    setMpesaCode('');
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            {(paymentMethod !== 'select' && paymentStatus === 'idle') && (
              <button
                className="mr-2 p-1 rounded-full hover:bg-gray-100"
                onClick={resetPaymentMethod}
              >
                <ArrowLeft size={20} className="text-gray-500" />
              </button>
            )}
            <h3 className="text-xl font-bold text-gray-900">Top Up Wallet</h3>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* Payment Method Selection */}
        {paymentMethod === 'select' && paymentStatus === 'idle' && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Amount
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[10, 20, 50, 100, 200, 500].map(amount => (
                  <button
                    key={amount}
                    className={`py-2 rounded-lg border ${
                      topUpAmount === amount
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setTopUpAmount(amount)}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount in USD:</span>
                  <span className="font-medium text-gray-900">${topUpAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">You will receive:</span>
                  <span className="font-medium text-teal-600">
                    {convertToTokens(topUpAmount)} Tokens
                  </span>
                </div>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Payment Method
              </label>

              <div className="space-y-3">
                <button
                  className="w-full p-4 border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50"
                  onClick={() => setPaymentMethod('mpesa')}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <Phone size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">M-Pesa</p>
                      <p className="text-xs text-gray-500">Pay with M-Pesa mobile money</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>

                <button
                  className="w-full p-4 border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50"
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <CreditCard size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Credit/Debit Card</p>
                      <p className="text-xs text-gray-500">Pay with Visa, Mastercard, etc.</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* M-Pesa Payment */}
        {paymentMethod === 'mpesa' && paymentStatus === 'idle' && (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Phone size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">M-Pesa Payment</p>
                <p className="text-xs text-gray-500">
                  Amount: KES {(topUpAmount * conversionRates.KES).toFixed(2)}
                </p>
              </div>
            </div>

            {mpesaStep === 'phone' ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 07XXXXXXXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={12}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You will receive a payment prompt on this number
                  </p>
                </div>

                <button
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center"
                  onClick={handleMpesaPayment}
                >
                  Send M-Pesa Prompt
                </button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter M-Pesa Transaction Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. QWE123XYZ"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 uppercase"
                    value={mpesaCode}
                    onChange={(e) => setMpesaCode(e.target.value.replace(/[^A-Z0-9]/gi, '').toUpperCase())}
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the transaction code you received from M-Pesa
                  </p>
                </div>

                <button
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center"
                  onClick={handleMpesaPayment}
                >
                  Verify Payment
                </button>
              </>
            )}
          </div>
        )}

        {/* Card Payment */}
        {paymentMethod === 'card' && paymentStatus === 'idle' && (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <CreditCard size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Card Payment</p>
                <p className="text-xs text-gray-500">
                  Amount: ${topUpAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                  />
                </div>

                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center"
                onClick={handleCardPayment}
              >
                Pay ${topUpAmount.toFixed(2)}
              </button>
            </div>
          </div>
        )}

        {/* Processing Payment */}
        {paymentStatus === 'processing' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait while we process your payment...</p>
          </div>
        )}

        {/* Payment Success */}
        {paymentStatus === 'success' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">
              You've successfully added {convertToTokens(topUpAmount)} tokens to your wallet.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
              <h4 className="font-medium text-gray-900 mb-2">Transaction Receipt</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span>
                    {paymentMethod === 'mpesa'
                      ? `KES ${(topUpAmount * conversionRates.KES).toFixed(2)}`
                      : `$${topUpAmount.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span>{paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tokens Added:</span>
                  <span className="font-medium text-teal-600">{convertToTokens(topUpAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span>{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                </div>
              </div>
            </div>

            <button
              className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        )}

        {/* Payment Error */}
        {paymentStatus === 'error' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h3>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <div className="flex space-x-3">
              <button
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                onClick={resetPaymentMethod}
              >
                Change Method
              </button>
              <button
                className="flex-1 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                onClick={() => setPaymentStatus('idle')}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
