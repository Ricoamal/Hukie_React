import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'sw';

// Define translations
export const translations = {
  en: {
    // General
    appName: 'Hukie',
    loading: 'Loading...',
    
    // Navigation
    discover: 'Discover',
    messages: 'Messages',
    shop: 'Shop',
    profile: 'Profile',
    
    // Shop
    yourCart: 'Your Cart',
    items: 'items',
    emptyCart: 'Your cart is empty',
    addProducts: 'Add some products to your cart',
    continueShopping: 'Continue Shopping',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    total: 'Total',
    checkout: 'Checkout',
    walletBalance: 'Wallet Balance',
    insufficientBalance: 'Insufficient balance. Please top up your wallet.',
    
    // Product
    addToCart: 'Add to Cart',
    addedToCart: 'Added to Cart',
    proceedToCheckout: 'Proceed to Checkout',
    quantity: 'Quantity',
    description: 'Description',
    reviews: 'Reviews',
    relatedProducts: 'You might also like',
    
    // Checkout
    deliveryOptions: 'Delivery Options',
    standardDelivery: 'Standard Delivery',
    expressDelivery: 'Express Delivery',
    storePickup: 'Store Pickup',
    free: 'Free',
    standardDeliveryDesc: 'Delivery within 3-5 business days',
    expressDeliveryDesc: 'Delivery within 1-2 business days',
    storePickupDesc: 'Pickup at your nearest Hukie store',
    deliveryAddress: 'Delivery Address',
    enterAddress: 'Enter your delivery address',
    orderSummary: 'Order Summary',
    completePurchase: 'Complete Purchase',
    processingPayment: 'Processing Payment',
    pleaseWait: 'Please wait while we process your payment...',
    paymentSuccessful: 'Payment Successful!',
    orderPlaced: 'Your order has been placed successfully.',
    deliveryInfo: 'Delivery Information',
    pickupReady: 'Ready for pickup at your nearest Hukie store within 24 hours.',
    deliveredVia: 'Your order will be delivered via',
    businessDays: 'business days',
    redirecting: 'Redirecting you back...',
    paymentFailed: 'Payment Failed',
    tryAgain: 'Try Again',
    cancel: 'Cancel',
    
    // Wallet
    topUpWallet: 'Top Up Wallet',
    selectAmount: 'Select Amount',
    selectPaymentMethod: 'Select Payment Method',
    mpesa: 'M-Pesa',
    card: 'Credit/Debit Card',
    mpesaDesc: 'Pay with M-Pesa mobile money',
    cardDesc: 'Pay with Visa, Mastercard, etc.',
    
    // Gift
    sendAsGift: 'Send as Gift',
    chooseContact: 'Choose a contact to send this gift to:',
    giftSummary: 'Gift Summary',
    sendGift: 'Send Gift',
    selectContact: 'Please select a contact to send the gift to',
    processingGift: 'Processing Gift',
    giftSent: 'Gift Sent Successfully!',
    giftTo: 'Your gift has been sent to',
    giftFailed: 'Gift Failed',
  },
  sw: {
    // General
    appName: 'Hukie',
    loading: 'Inapakia...',
    
    // Navigation
    discover: 'Gundua',
    messages: 'Ujumbe',
    shop: 'Duka',
    profile: 'Wasifu',
    
    // Shop
    yourCart: 'Kikapu Chako',
    items: 'bidhaa',
    emptyCart: 'Kikapu chako ni tupu',
    addProducts: 'Ongeza bidhaa kwenye kikapu chako',
    continueShopping: 'Endelea Kununua',
    subtotal: 'Jumla ndogo',
    shipping: 'Usafirishaji',
    total: 'Jumla',
    checkout: 'Lipa',
    walletBalance: 'Salio la Pochi',
    insufficientBalance: 'Salio halijatosheleza. Tafadhali ongeza pesa kwenye pochi yako.',
    
    // Product
    addToCart: 'Ongeza kwenye Kikapu',
    addedToCart: 'Imeongezwa kwenye Kikapu',
    proceedToCheckout: 'Endelea kwa Malipo',
    quantity: 'Idadi',
    description: 'Maelezo',
    reviews: 'Maoni',
    relatedProducts: 'Unaweza pia kupenda',
    
    // Checkout
    deliveryOptions: 'Chaguo za Usafirishaji',
    standardDelivery: 'Usafirishaji wa Kawaida',
    expressDelivery: 'Usafirishaji wa Haraka',
    storePickup: 'Chukua Dukani',
    free: 'Bure',
    standardDeliveryDesc: 'Usafirishaji kwa siku 3-5 za kazi',
    expressDeliveryDesc: 'Usafirishaji kwa siku 1-2 za kazi',
    storePickupDesc: 'Chukua katika duka la Hukie karibu nawe',
    deliveryAddress: 'Anwani ya Usafirishaji',
    enterAddress: 'Ingiza anwani yako ya usafirishaji',
    orderSummary: 'Muhtasari wa Agizo',
    completePurchase: 'Kamilisha Ununuzi',
    processingPayment: 'Malipo Yanachakatwa',
    pleaseWait: 'Tafadhali subiri tunapochakata malipo yako...',
    paymentSuccessful: 'Malipo Yamefaulu!',
    orderPlaced: 'Agizo lako limewekwa kwa mafanikio.',
    deliveryInfo: 'Maelezo ya Usafirishaji',
    pickupReady: 'Tayari kwa kuchukua katika duka la Hukie karibu nawe ndani ya masaa 24.',
    deliveredVia: 'Agizo lako litasafirishwa kupitia',
    businessDays: 'siku za kazi',
    redirecting: 'Unaelekezwa nyuma...',
    paymentFailed: 'Malipo Yameshindwa',
    tryAgain: 'Jaribu Tena',
    cancel: 'Ghairi',
    
    // Wallet
    topUpWallet: 'Ongeza Pesa kwenye Pochi',
    selectAmount: 'Chagua Kiasi',
    selectPaymentMethod: 'Chagua Njia ya Malipo',
    mpesa: 'M-Pesa',
    card: 'Kadi ya Mkopo/Debit',
    mpesaDesc: 'Lipa na M-Pesa pesa za simu',
    cardDesc: 'Lipa na Visa, Mastercard, n.k.',
    
    // Gift
    sendAsGift: 'Tuma kama Zawadi',
    chooseContact: 'Chagua anwani ya kutuma zawadi hii:',
    giftSummary: 'Muhtasari wa Zawadi',
    sendGift: 'Tuma Zawadi',
    selectContact: 'Tafadhali chagua anwani ya kutuma zawadi',
    processingGift: 'Zawadi Inachakatwa',
    giftSent: 'Zawadi Imetumwa kwa Mafanikio!',
    giftTo: 'Zawadi yako imetumwa kwa',
    giftFailed: 'Zawadi Imeshindwa',
  }
};

// Define context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider props
interface LanguageProviderProps {
  children: ReactNode;
}

// Provider component
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  // Translation function
  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
