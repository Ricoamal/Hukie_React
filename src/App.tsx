import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, User, Bell, LogOut, UserCircle, Cog, ShoppingBag } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import SplashScreen from './components/SplashScreen';
import OnboardingScreen from './components/Onboarding';
import UserProfile from './components/UserProfile';
import ChatPage from './components/ChatPage.tsx';
import MyProfile from './components/MyProfile';
import LoginPage from './components/LoginPage';
import Store from './components/Store';
import { CartProvider } from './contexts/CartContext';
import { WalletProvider } from './contexts/WalletContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import NotificationCenter from './components/NotificationCenter';
import ToastContainer from './components/ToastContainer';


// Define user type for the application
interface UserData {
  id: number;
  name: string;
  age: number;
  gender: string;
  image: string;
  location: { latitude: number; longitude: number };
  distance: string;
  bio: string;
}

// Sample user data
const users: UserData[] = [
  {
    id: 1,
    name: 'Mary',
    age: 24,
    gender: 'female',
    image: '/User-Mary.jpg',
    location: { latitude: -1.2921, longitude: 36.8219 }, // Nairobi
    distance: '2 miles away',
    bio: 'Love hiking, photography, and trying new restaurants. Looking for someone to share adventures with! 🌟'
  },
  {
    id: 2,
    name: 'Lyn',
    age: 26,
    gender: 'female',
    image: '/User-Lyn.jpg',
    location: { latitude: -1.2864, longitude: 36.8172 }, // Near Nairobi
    distance: '3 miles away',
    bio: 'Coffee enthusiast and yoga instructor. Always up for interesting conversations and outdoor activities! ☕️'
  },
  {
    id: 3,
    name: 'Wamboi',
    age: 23,
    gender: 'female',
    image: '/User-wamboi.jpg',
    location: { latitude: -1.2975, longitude: 36.8126 }, // Near Nairobi
    distance: '1 mile away',
    bio: 'Art lover and aspiring chef. Looking for someone to share culinary adventures with! 🎨'
  },
  {
    id: 4,
    name: 'Kipchoge',
    age: 30,
    gender: 'male',
    image: '/User-kipchoge.png',
    location: { latitude: -1.2833, longitude: 36.8252 }, // Near Nairobi
    distance: '4 miles away',
    bio: 'Marathon runner and fitness enthusiast. Love exploring new trails and staying active! 🏃‍♂️'
  },
  {
    id: 5,
    name: 'Omondi',
    age: 28,
    gender: 'male',
    image: '/User-omondi.png',
    location: { latitude: -1.3031, longitude: 36.8084 }, // Near Nairobi
    distance: '5 miles away',
    bio: 'Tech entrepreneur and music lover. Always looking for new opportunities and connections! 💻'
  },
  {
    id: 6,
    name: 'Wekesa',
    age: 32,
    gender: 'male',
    image: '/User-wekesa.png',
    location: { latitude: -1.2915, longitude: 36.8344 }, // Near Nairobi
    distance: '3 miles away',
    bio: 'Wildlife photographer and nature enthusiast. Love exploring Kenya\'s beautiful landscapes! 📸'
  }
];

// Settings dropdown component
function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentUser, logout } = useAuth();

  // Default profile picture
  const profilePicture = '/logo.png';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to onboarding screen
      window.location.reload();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    // Set active tab to profile
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('set-active-tab', { detail: 'profile' });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="p-0 rounded-full hover:ring-2 hover:ring-teal-500 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={profilePicture}
          alt="Profile"
          className="h-10 w-10 rounded-full object-cover border-2 border-white"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {currentUser?.displayName || currentUser?.email || 'Guest'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {currentUser?.email || ''}
            </p>
          </div>

          <button
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleProfileClick}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </button>

          <button
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <Cog className="mr-2 h-4 w-4" />
            Settings
          </button>

          <button
            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

interface ViewState {
  latitude: number;
  longitude: number;
  zoom: number;
  transitionDuration?: number;
  transitionEasing?: (t: number) => number;
}

function App() {
  const { currentUser } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true); // Show onboarding after splash screen
  const [showLogin, setShowLogin] = useState(false); // Show login screen
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [viewState, setViewState] = useState<ViewState>({
    latitude: -1.2921, // Nairobi, Kenya
    longitude: 36.8219,
    zoom: 13
  });

  // Listen for custom event to switch tabs
  useEffect(() => {
    const handleSetActiveTab = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('set-active-tab', handleSetActiveTab as EventListener);
    return () => {
      window.removeEventListener('set-active-tab', handleSetActiveTab as EventListener);
    };
  }, []);

  const handleMarkerClick = (_e: any, user: UserData) => {
    setSelectedUser(user);
    // Animate to the clicked user's location with a slightly closer zoom
    setViewState({
      longitude: user.location.longitude,
      latitude: user.location.latitude,
      zoom: 15, // Zoom in closer to the selected user
      transitionDuration: 1000 as const, // Smooth animation duration in milliseconds
      transitionEasing: (t: number) => t * (2 - t) // Ease-out animation
    });
  };

  // Check if user is logged in
  useEffect(() => {
    if (currentUser) {
      // If user is logged in, skip splash and onboarding
      setShowSplash(false);
      setShowOnboarding(false);
    }
  }, [currentUser]);

  // Add a transition effect when logging in from onboarding
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (!showOnboarding && !showSplash) {
      // Add a slight delay before fading in the main content
      setTimeout(() => {
        setFadeIn(true);
      }, 100);
    }
  }, [showOnboarding, showSplash]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-500 to-teal-700 bg-fixed">
        <OnboardingScreen
          onComplete={() => {
            setShowOnboarding(false);
            setShowLogin(true);
          }}
        />
      </div>
    );
  }

  if (showLogin) {
    return <LoginPage onComplete={() => setShowLogin(false)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'discover':
        return (
          <div className="flex-1 relative" style={{ height: '80vh', width: '100%', position: 'relative', border: '1px solid #ddd' }}>
            <Map
              {...viewState}
              onMove={evt => setViewState(evt.viewState)}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken="pk.eyJ1Ijoid2lueTIwMjQiLCJhIjoiY205OGFxbzZnMDB5MDJtczVhaWd6ejRxNiJ9.wu5sAkNplBoYvRFpw3J0AA"
              style={{ width: '100%', height: '100%', position: 'absolute' }}
              attributionControl={false}
              logoPosition="bottom-right"
            >
              {/* Navigation control */}
              <NavigationControl position="top-right" showCompass={false} />
              {users.map(user => (
                <Marker
                  key={user.id}
                  latitude={user.location.latitude}
                  longitude={user.location.longitude}
                  onClick={e => handleMarkerClick(e, user)}
                >
                  <div className="relative cursor-pointer">
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        user.gender === 'female' ? 'bg-green-500' : 'bg-red-800'
                      }`}
                    />
                  </div>
                </Marker>
              ))}

              {selectedUser && (
                <Popup
                  latitude={selectedUser.location.latitude}
                  longitude={selectedUser.location.longitude}
                  onClose={() => setSelectedUser(null)}
                  closeButton={false}
                  closeOnClick={false}
                  anchor="bottom"
                  className="fancy-popup"
                  maxWidth="300px"
                >
                  <UserProfile
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                  />
                </Popup>
              )}
            </Map>
          </div>
        );
      case 'messages':
        return (
          <div className="flex-1 overflow-hidden h-full">
            <ChatPage />
          </div>
        );
      case 'shop':
        return (
          <div className="flex-1 overflow-hidden h-full">
            <CartProvider>
              <WalletProvider>
                <Store />
              </WalletProvider>
            </CartProvider>
          </div>
        );
      case 'profile':
        return (
          <div className="flex-1 overflow-auto p-4">
            <MyProfile />
          </div>
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Coming soon!</p>
          </div>
        );
    }
  };

  return (
    <LanguageProvider>
      <NotificationProvider>
        <div className={`h-screen bg-gray-50 flex flex-col overflow-hidden transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
          {/* Top Navigation */}
          <div className="bg-white shadow-sm">
            <div className="max-w-lg mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src="/logo.png" alt="Hukie Logo" className="h-8 w-8" />
                  <span className="ml-2 text-2xl font-bold text-teal-900">Hukie</span>
                </div>
                <div className="flex items-center space-x-4">
                  <LanguageSwitcher />
                  <NotificationCenter />
                  <SettingsDropdown />
                </div>
              </div>
            </div>
          </div>

          {/* Toast Container */}
          <ToastContainer />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            <button
              onClick={() => setActiveTab('discover')}
              className={`p-4 flex flex-col items-center ${
                activeTab === 'discover' ? 'text-teal-500' : 'text-gray-500'
              }`}
            >
              <Heart className="h-6 w-6" />
              <span className="text-xs mt-1">Discover</span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`p-4 flex flex-col items-center ${
                activeTab === 'messages' ? 'text-teal-500' : 'text-gray-500'
              }`}
            >
              <MessageCircle className="h-6 w-6" />
              <span className="text-xs mt-1">Messages</span>
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`p-4 flex flex-col items-center ${
                activeTab === 'shop' ? 'text-teal-500' : 'text-gray-500'
              }`}
            >
              <ShoppingBag className="h-6 w-6" />
              <span className="text-xs mt-1">Shop</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-4 flex flex-col items-center ${
                activeTab === 'profile' ? 'text-teal-500' : 'text-gray-500'
              }`}
            >
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </NotificationProvider>
    </LanguageProvider>
  );
}

export default App;

















