import { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2, CreditCard, ChevronRight, Gift, User, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWallet } from '../contexts/WalletContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';

// Contact interface for sending gifts
interface Contact {
  id: number;
  name: string;
  image: string;
}

interface CartProps {
  onClose: () => void;
}

export default function Cart({ onClose }: CartProps) {
  const { items: cartItems, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const { balance, makePurchase } = useWallet();
  const { t } = useLanguage();
  const { showToast, addNotification } = useNotification();

  const [showCheckout, setShowCheckout] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express' | 'pickup'>('standard');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Sample contacts from the app (would come from a context or API in a real app)
  const contacts: Contact[] = [
    {
      id: 1,
      name: 'Mary',
      image: '/User-Mary.jpg'
    },
    {
      id: 3,
      name: 'Wamboi',
      image: '/User-wamboi.jpg'
    },
    {
      id: 4,
      name: 'Kipchoge',
      image: '/User-kipchoge.png'
    },
    {
      id: 5,
      name: 'Omondi',
      image: '/User-omondi.png'
    },
    {
      id: 6,
      name: 'Wekesa',
      image: '/User-wekesa.png'
    }
  ];

  // Calculate shipping based on delivery option
  const getShippingCost = () => {
    switch (deliveryOption) {
      case 'express':
        return 9.99;
      case 'pickup':
        return 0;
      case 'standard':
      default:
        return 4.99;
    }
  };

  const shipping = getShippingCost();
  const total = subtotal + shipping;

  // Check if user has enough balance
  const hasEnoughBalance = balance >= total;

  // Handle checkout
  const handleCheckout = (isGift: boolean = false) => {
    // Validate delivery address if not pickup
    if (deliveryOption !== 'pickup' && !deliveryAddress.trim()) {
      setCheckoutStatus('error');
      setErrorMessage('Please enter a delivery address.');
      return;
    }

    setCheckoutStatus('processing');

    // Simulate processing delay
    setTimeout(() => {
      if (hasEnoughBalance) {
        // Process the purchase
        let description = isGift
          ? `Gift to ${selectedContact?.name}`
          : `Purchase of ${cartItems.length} items`;

        // Add delivery info to description
        description += ` (${deliveryOption} delivery)`;

        const success = makePurchase(total, description);

        if (success) {
          setCheckoutStatus('success');

          // Add notification
          addNotification({
            type: 'success',
            title: isGift ? 'Gift Sent' : 'Order Placed',
            message: isGift
              ? `Your gift to ${selectedContact?.name} has been sent successfully.`
              : `Your order has been placed successfully. ${deliveryOption === 'pickup' ? 'Ready for pickup soon.' : 'Will be delivered soon.'}`
          });

          // Clear cart after successful purchase
          setTimeout(() => {
            clearCart();
            // Close checkout modal after a delay
            setTimeout(() => {
              setShowCheckout(false);
              setShowGiftModal(false);
              onClose();

              // Show toast notification after modal closes
              showToast(
                'success',
                isGift
                  ? `Gift sent to ${selectedContact?.name}`
                  : 'Order placed successfully'
              );
            }, 2000);
          }, 1000);
        } else {
          setCheckoutStatus('error');
          setErrorMessage('Transaction failed. Please try again.');

          // Show toast notification for error
          showToast('error', 'Payment failed. Please try again.');
        }
      } else {
        setCheckoutStatus('error');
        setErrorMessage('Insufficient balance. Please top up your wallet.');

        // Show toast notification for insufficient balance
        showToast('warning', 'Insufficient balance. Please top up your wallet.');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center">
            <ShoppingBag size={20} className="text-teal-600 mr-2" />
            <h3 className="text-xl font-bold text-gray-900">{t('yourCart')}</h3>
            <span className="ml-2 bg-teal-100 text-teal-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {cartItems.length} {t('items')}
            </span>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex border-b border-gray-200 pb-4">
                  <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <button
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => {
                          removeItem(item.id);
                          showToast('info', `${item.name} removed from cart`);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-teal-600 font-medium">${item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <button
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="mx-2 text-gray-700">{item.quantity}</span>
                      <button
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <ShoppingBag size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">{t('emptyCart')}</p>
              <p className="text-sm mt-1">{t('addProducts')}</p>
              <button
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                onClick={onClose}
              >
                {t('continueShopping')}
              </button>
            </div>
          )}
        </div>

        {/* Cart summary */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>{t('subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('shipping')}</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>{t('total')}</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Wallet balance */}
              <div className="flex justify-between text-sm bg-gray-50 p-2 rounded mt-2">
                <span className="text-gray-600">{t('walletBalance')}:</span>
                <span className={`font-medium ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`}>
                  {balance.toFixed(0)} Tokens
                </span>
              </div>
            </div>

            <div className="flex space-x-2 mb-3">
              <button
                className="flex-1 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center font-medium"
                onClick={() => setShowCheckout(true)}
                disabled={!hasEnoughBalance}
              >
                {t('checkout')}
                <CreditCard size={20} className="ml-2" />
              </button>

              <button
                className="py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center font-medium"
                onClick={() => setShowGiftModal(true)}
                disabled={!hasEnoughBalance}
              >
                <Gift size={20} />
              </button>
            </div>

            {!hasEnoughBalance && (
              <div className="text-red-600 text-sm flex items-center mb-3">
                <AlertCircle size={16} className="mr-1" />
                {t('insufficientBalance')}
              </div>
            )}

            <button
              className="w-full py-2 text-teal-600 hover:text-teal-700 flex items-center justify-center font-medium"
              onClick={onClose}
            >
              {t('continueShopping')}
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {checkoutStatus === 'idle' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Checkout</h3>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowCheckout(false)}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="space-y-4 mb-4">
                    {/* Delivery Options */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Delivery Options</h4>
                      <div className="space-y-2">
                        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="deliveryOption"
                            checked={deliveryOption === 'standard'}
                            onChange={() => setDeliveryOption('standard')}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-900">Standard Delivery</span>
                              <span className="text-gray-900">${4.99.toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-gray-500">Delivery within 3-5 business days</p>
                          </div>
                        </label>

                        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="deliveryOption"
                            checked={deliveryOption === 'express'}
                            onChange={() => setDeliveryOption('express')}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-900">Express Delivery</span>
                              <span className="text-gray-900">${9.99.toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-gray-500">Delivery within 1-2 business days</p>
                          </div>
                        </label>

                        <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="deliveryOption"
                            checked={deliveryOption === 'pickup'}
                            onChange={() => setDeliveryOption('pickup')}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-900">Store Pickup</span>
                              <span className="text-gray-900">Free</span>
                            </div>
                            <p className="text-sm text-gray-500">Pickup at your nearest Hukie store</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Delivery Address (hide for pickup) */}
                    {deliveryOption !== 'pickup' && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                        <textarea
                          placeholder="Enter your delivery address"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                          rows={3}
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                      <div className="space-y-2">
                        {cartItems.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} x{item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                          </div>
                          <div className="flex justify-between font-medium text-gray-900 mt-2">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-800 mb-4">
                    <p>This is a demo. Payment will be processed using your wallet balance.</p>
                  </div>

                  <div className="flex justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-700">Wallet Balance:</span>
                    <span className="font-medium text-green-600">{balance.toFixed(0)} Tokens</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                    onClick={() => setShowCheckout(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                    onClick={() => handleCheckout()}
                  >
                    Complete Purchase
                  </button>
                </div>
              </>
            )}

            {checkoutStatus === 'processing' && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
                <p className="text-gray-600">Please wait while we process your payment...</p>
              </div>
            )}

            {checkoutStatus === 'success' && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>

                <div className="bg-gray-50 p-3 rounded-lg mb-4 mx-auto max-w-xs">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Delivery Information</h4>
                  <p className="text-sm text-gray-600">
                    {deliveryOption === 'pickup' ? (
                      'Ready for pickup at your nearest Hukie store within 24 hours.'
                    ) : (
                      <>Your order will be delivered via {deliveryOption === 'express' ? 'express' : 'standard'} shipping.<br/>{deliveryOption === 'express' ? '1-2' : '3-5'} business days.</>
                    )}
                  </p>
                </div>

                <p className="text-sm text-gray-500">Redirecting you back...</p>
              </div>
            )}

            {checkoutStatus === 'error' && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h3>
                <p className="text-gray-600 mb-6">{errorMessage}</p>
                <div className="flex space-x-3">
                  <button
                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                    onClick={() => setShowCheckout(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                    onClick={() => setCheckoutStatus('idle')}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {checkoutStatus === 'idle' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Send as Gift</h3>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowGiftModal(false)}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">Choose a contact to send this gift to:</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {contacts.map(contact => (
                      <button
                        key={contact.id}
                        className={`p-3 rounded-lg border flex items-center ${selectedContact?.id === contact.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:bg-gray-50'}`}
                        onClick={() => setSelectedContact(contact)}
                      >
                        <img
                          src={contact.image}
                          alt={contact.name}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/logo.png';
                          }}
                        />
                        <span className="font-medium text-gray-900">{contact.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Gift Summary</h4>
                    <div className="space-y-2">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping</span>
                          <span>${shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium text-gray-900 mt-2">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                    onClick={() => setShowGiftModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center justify-center"
                    onClick={() => handleCheckout(true)}
                    disabled={!selectedContact}
                  >
                    <Gift size={18} className="mr-2" />
                    Send Gift
                  </button>
                </div>

                {!selectedContact && (
                  <p className="text-sm text-red-600 mt-3 text-center">Please select a contact to send the gift to</p>
                )}
              </>
            )}

            {checkoutStatus === 'processing' && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Gift</h3>
                <p className="text-gray-600">Please wait while we process your gift...</p>
              </div>
            )}

            {checkoutStatus === 'success' && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gift Sent Successfully!</h3>
                <p className="text-gray-600 mb-4">Your gift has been sent to {selectedContact?.name}.</p>
                <p className="text-sm text-gray-500">Redirecting you back...</p>
              </div>
            )}

            {checkoutStatus === 'error' && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gift Failed</h3>
                <p className="text-gray-600 mb-6">{errorMessage}</p>
                <div className="flex space-x-3">
                  <button
                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                    onClick={() => setShowGiftModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                    onClick={() => setCheckoutStatus('idle')}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
