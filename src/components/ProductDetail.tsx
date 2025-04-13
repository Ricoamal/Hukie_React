import { useState } from 'react';
import { X, Heart, ShoppingBag, Star, ChevronRight, Truck, Shield, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';

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

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const { addItem } = useCart();
  const { t } = useLanguage();
  const { showToast, addNotification } = useNotification();

  // Handle add to cart
  const handleAddToCart = () => {
    // Add the product to the cart with the selected quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl
      });
    }

    // Show success message
    setAddedToCart(true);

    // Show toast notification
    showToast(
      'success',
      quantity > 1
        ? `${quantity} ${product.name} added to cart`
        : `${product.name} added to cart`
    );

    // Add to notification center
    addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${quantity} x ${product.name} added to your cart`,
      image: product.imageUrl
    });

    // Don't reset the addedToCart state - keep it true to show the Checkout button
  };

  // Handle checkout
  const handleCheckout = () => {
    // Set a global flag to open the cart after closing the product detail
    // This is a simple way to communicate between components without props
    window.openCartForCheckout = true;

    // Close the product detail modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
          <button
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col md:flex-row">
            {/* Product image */}
            <div className="md:w-1/2 p-4">
              <div className="relative rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
                <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-sm">
                  <Heart size={20} className="text-gray-500" />
                </button>
                {product.ageRestricted && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    18+
                  </div>
                )}
              </div>

              {/* Image thumbnails - would be real in a complete implementation */}
              <div className="flex mt-4 space-x-2">
                <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-teal-500">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">+</span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product details */}
            <div className="md:w-1/2 p-4">
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <Star size={16} className="text-yellow-500 fill-current opacity-50" />
                </div>
                <span className="text-sm text-gray-600 ml-2">{product.rating} (24 reviews)</span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <p className="text-3xl font-bold text-teal-600 mb-4">${product.price.toFixed(2)}</p>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'description'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'shipping'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('shipping')}
                >
                  Shipping
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'reviews'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </div>

              {/* Tab content */}
              <div className="mb-6">
                {activeTab === 'description' && (
                  <div>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-teal-500 mr-2">•</span>
                        <span className="text-gray-600">Premium quality materials</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-teal-500 mr-2">•</span>
                        <span className="text-gray-600">Discreet packaging guaranteed</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-teal-500 mr-2">•</span>
                        <span className="text-gray-600">30-day satisfaction guarantee</span>
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div>
                    <div className="flex items-center mb-3">
                      <Truck size={20} className="text-teal-500 mr-2" />
                      <div>
                        <p className="font-medium text-gray-900">Free Shipping</p>
                        <p className="text-sm text-gray-600">On orders over $50</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-3">
                      <Shield size={20} className="text-teal-500 mr-2" />
                      <div>
                        <p className="font-medium text-gray-900">Discreet Packaging</p>
                        <p className="text-sm text-gray-600">Plain packaging with no branding</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Estimated delivery: 3-5 business days
                    </p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div className="space-y-4">
                      <div className="border-b border-gray-200 pb-4">
                        <div className="flex items-center mb-1">
                          <div className="flex items-center">
                            <Star size={14} className="text-yellow-500 fill-current" />
                            <Star size={14} className="text-yellow-500 fill-current" />
                            <Star size={14} className="text-yellow-500 fill-current" />
                            <Star size={14} className="text-yellow-500 fill-current" />
                            <Star size={14} className="text-yellow-500 fill-current" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 ml-2">Amazing product!</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          This exceeded my expectations. The quality is outstanding and it arrived quickly in discreet packaging.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Jane D. - 2 weeks ago</p>
                      </div>

                      <div>
                        <div className="flex items-center mb-1">
                          <div className="flex items-center">
                            <Star size={14} className="text-yellow-500 fill-current" />
                            <Star size={14} className="text-yellow-500 fill-current" />
                            <Star size={14} className="text-yellow-500 fill-current" />
                            <Star size={14} className="text-yellow-500 fill-current" />
                            <Star size={14} className="text-gray-300" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 ml-2">Good value</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Great product for the price. Would recommend to others.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Michael T. - 1 month ago</p>
                      </div>
                    </div>

                    <button className="text-teal-600 text-sm font-medium flex items-center mt-4">
                      See all 24 reviews
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                )}
              </div>

              {/* Quantity selector */}
              <div className="flex items-center mb-6">
                <span className="text-gray-700 mr-3">{t('quantity')}:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    className="px-3 py-1 text-gray-500 hover:bg-gray-100"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-gray-700">{quantity}</span>
                  <button
                    className="px-3 py-1 text-gray-500 hover:bg-gray-100"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to cart/Checkout button */}
              <button
                className={`w-full py-3 rounded-lg flex items-center justify-center font-medium ${
                  addedToCart
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                } transition-colors`}
                onClick={addedToCart ? handleCheckout : handleAddToCart}
              >
                {addedToCart ? (
                  <>
                    {t('proceedToCheckout')}
                    <ChevronRight size={20} className="ml-2" />
                  </>
                ) : (
                  <>
                    {t('addToCart')}
                    <ShoppingBag size={20} className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Related products */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('relatedProducts')}</h3>
              <div className="flex space-x-2">
                <button className="p-1 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100">
                  <ArrowLeft size={16} />
                </button>
                <button className="p-1 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Sample related products */}
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative">
                    <img
                      src={`https://images.unsplash.com/photo-${1550000000000 + i * 1000}?w=300`}
                      alt="Related product"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 truncate">Related Product {i}</h3>
                    <p className="text-teal-600 font-bold mt-1">${(19.99 + i * 10).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
