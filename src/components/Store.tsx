import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Filter, ChevronDown, Heart, Star, X, Wallet as WalletIcon } from 'lucide-react';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import Wallet from './Wallet';
import { useCart } from '../contexts/CartContext';
import { useWallet } from '../contexts/WalletContext';
import { useLanguage } from '../contexts/LanguageContext';

// Product interface
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  rating: number;
  ageRestricted: boolean;
}

// Category interface
interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function Store() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  const { itemCount, addItem } = useCart();
  const { balance } = useWallet();
  const { t, language } = useLanguage();

  // Sample categories
  const categories: Category[] = [
    {
      id: '1',
      name: 'Lingerie & Intimates',
      description: 'Elegant and comfortable lingerie for all occasions',
      icon: '👙'
    },
    {
      id: '2',
      name: 'Adult Toys',
      description: 'Quality adult toys for enhanced pleasure',
      icon: '🎮'
    },
    {
      id: '3',
      name: 'Sexual Wellness',
      description: 'Products for sexual health and wellness',
      icon: '💊'
    },
    {
      id: '4',
      name: 'Romantic Gifts',
      description: 'Thoughtful gifts to surprise your partner',
      icon: '🎁'
    }
  ];

  // Sample products
  const products: Product[] = [
    {
      id: '101',
      name: 'Silk Robe Set',
      description: 'Luxurious silk robe set with matching lingerie',
      price: 89.99,
      category: '1',
      imageUrl: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500',
      rating: 4.8,
      ageRestricted: false
    },
    {
      id: '102',
      name: 'Massage Oil Set',
      description: 'Set of 3 scented massage oils for romantic evenings',
      price: 34.99,
      category: '4',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500',
      rating: 4.6,
      ageRestricted: false
    },
    {
      id: '103',
      name: 'Premium Vibrator',
      description: 'High-quality vibrator with multiple settings',
      price: 79.99,
      category: '2',
      imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=500',
      rating: 4.9,
      ageRestricted: true
    },
    {
      id: '104',
      name: 'Organic Lubricant',
      description: 'Natural, organic lubricant for sensitive skin',
      price: 19.99,
      category: '3',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500',
      rating: 4.7,
      ageRestricted: true
    },
    {
      id: '105',
      name: 'Romantic Gift Box',
      description: 'Curated gift box with romantic items for a special night',
      price: 99.99,
      category: '4',
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500',
      rating: 4.9,
      ageRestricted: false
    },
    {
      id: '106',
      name: 'Lace Lingerie Set',
      description: 'Elegant lace lingerie set with adjustable straps',
      price: 59.99,
      category: '1',
      imageUrl: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500',
      rating: 4.5,
      ageRestricted: false
    }
  ];

  // Filter products based on search query and selected category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Handle product click
  const handleProductClick = (product: Product) => {
    if (product.ageRestricted && !isAgeVerified) {
      setShowAgeVerification(true);
    } else {
      setSelectedProduct(product);
    }
  };

  // Handle age verification
  const handleAgeVerification = () => {
    setIsAgeVerified(true);
    setShowAgeVerification(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
      {/* Store header */}
      <div className="bg-white p-4 flex justify-between items-center border-b border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-teal-900">Hukie {t('shop')}</h2>
        <div className="flex space-x-2 items-center">
          <div className="mr-3 bg-teal-50 px-3 py-1 rounded-full flex items-center">
            <WalletIcon size={16} className="text-teal-600 mr-1" />
            <span className="text-sm font-medium text-teal-700">{balance.toFixed(0)}</span>
          </div>

          <button
            className="text-gray-600 p-1 hover:bg-gray-100 rounded-full"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
          </button>

          <button
            className="text-gray-600 p-1 hover:bg-gray-100 rounded-full"
            onClick={() => setShowWallet(true)}
          >
            <WalletIcon size={20} />
          </button>

          <button
            className="text-gray-600 p-1 hover:bg-gray-100 rounded-full relative"
            onClick={() => setShowCart(true)}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder={language === 'en' ? 'Search products...' : 'Tafuta bidhaa...'}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-500" size={18} />
        </div>
      </div>

      {/* Category filters */}
      {showFilters && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === null ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-3 py-1 rounded-full text-sm flex items-center ${
                  selectedCategory === category.id ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product grid */}
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-sm">
                  <Heart size={16} className="text-gray-500" />
                </button>
                {product.ageRestricted && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    18+
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                <div className="flex items-center mt-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                </div>
                <p className="text-teal-600 font-bold mt-2">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
            <ShoppingBag size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Age verification modal */}
      {showAgeVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Age Verification</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAgeVerification(false)}
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              This product is age-restricted. You must be 18 years or older to view this product.
            </p>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => setShowAgeVerification(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                onClick={handleAgeVerification}
              >
                I am 18 or older
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product detail modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            // Check if we should open the cart (for checkout)
            if (window.openCartForCheckout) {
              setShowCart(true);
              window.openCartForCheckout = false;
            }
          }}
        />
      )}

      {/* Cart modal */}
      {showCart && (
        <Cart onClose={() => setShowCart(false)} />
      )}

      {/* Wallet modal */}
      {showWallet && (
        <Wallet onClose={() => setShowWallet(false)} />
      )}
    </div>
  );
}
