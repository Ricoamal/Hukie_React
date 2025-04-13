import { useState } from 'react';
import { Heart, X, MessageCircle, Video, User, MapPin } from 'lucide-react';
import ImageSlider from './ImageSlider';
import FullscreenImageViewer from './FullscreenImageViewer';
import VideoCall from './VideoCall';
import ProfileView from './ProfileView';
import ChatPage from './ChatPage';

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

interface UserProfileProps {
  user: UserData;
  onClose: () => void;
}

export default function UserProfile({ user, onClose }: UserProfileProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'info' | 'chat'>('photos');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Generate multiple images for each user based on their name
  const getUserImages = () => {
    const baseImage = user.image;
    const userName = user.name.toLowerCase();

    // Create an array of images for each user
    switch(userName) {
      case 'mary':
        return [
          baseImage,
          '/onboarding_1.png',
          '/logo.png'
        ];
      case 'lyn':
        return [
          baseImage,
          '/onboarding_2.png',
          '/logo.png'
        ];
      case 'wamboi':
        return [
          baseImage,
          '/onboarding_3.png',
          '/logo.png'
        ];
      case 'kipchoge':
        return [
          baseImage,
          '/onboarding_1.png',
          '/logo.png'
        ];
      case 'omondi':
        return [
          baseImage,
          '/onboarding_2.png',
          '/logo.png'
        ];
      case 'wekesa':
        return [
          baseImage,
          '/onboarding_3.png',
          '/logo.png'
        ];
      default:
        return [
          baseImage,
          '/logo.png',
          '/launch-icon.png'
        ];
    }
  };

  const userImages = getUserImages();

  const handleConnect = () => {
    setIsPending(true);
    // Simulate connection request being accepted after 2 seconds
    setTimeout(() => {
      setIsPending(false);
      setIsConnected(true);
    }, 2000);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-sm animate-fade-in">
        {/* Image slider */}
        <ImageSlider
          images={userImages}
          onFullscreen={() => setShowFullscreen(true)}
        />

        {/* User info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{user.name}, {user.age}</h3>
              <p className="text-gray-600 flex items-center text-sm">
                <MapPin size={14} className="mr-1" /> {user.distance}
              </p>
            </div>

            {/* Connection status */}
            {!isConnected && !isPending ? (
              <button
                onClick={handleConnect}
                className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-teal-600 transition-colors flex items-center"
              >
                <Heart size={14} className="mr-1" /> Connect
              </button>
            ) : isPending ? (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Pending
              </span>
            ) : (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Heart size={14} className="mr-1 fill-green-800" /> Connected
              </span>
            )}
          </div>

          {/* Tabs for connected users */}
          {isConnected && (
            <div className="border-b border-gray-200 mb-3">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`mr-6 py-2 border-b-2 text-sm font-medium ${
                    activeTab === 'photos'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Photos
                </button>
                <button
                  onClick={() => setActiveTab('info')}
                  className={`mr-6 py-2 border-b-2 text-sm font-medium ${
                    activeTab === 'info'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Info
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`py-2 border-b-2 text-sm font-medium ${
                    activeTab === 'chat'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Chat
                </button>
              </nav>
            </div>
          )}

          {/* Tab content */}
          {activeTab === 'photos' || !isConnected ? (
            <p className="text-gray-700 text-sm">{user.bio}</p>
          ) : activeTab === 'info' ? (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Gender:</span> {user.gender}</p>
              <p><span className="font-medium">Location:</span> {user.distance} away</p>
              <p><span className="font-medium">Interests:</span> Photography, Hiking, Travel</p>
              <p><span className="font-medium">About:</span> {user.bio}</p>
            </div>
          ) : (
            <div className="h-32 bg-gray-50 rounded p-2 flex flex-col">
              <div className="flex-1 overflow-y-auto mb-2">
                <p className="text-center text-gray-500 text-xs my-4">Start a conversation with {user.name}</p>
              </div>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 border rounded-l-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button className="bg-teal-500 text-white px-3 py-1 rounded-r-lg text-sm">
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-4 pb-4 pt-2 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Close
          </button>

          {isConnected && (
            <div className="flex space-x-2">
              <button
                className="bg-teal-100 text-teal-800 p-2 rounded-full hover:bg-teal-200 transition-colors"
                onClick={() => setShowChat(true)}
              >
                <MessageCircle size={20} />
              </button>
              <button
                className="bg-teal-100 text-teal-800 p-2 rounded-full hover:bg-teal-200 transition-colors"
                onClick={() => setShowVideoCall(true)}
              >
                <Video size={20} />
              </button>
              <button
                className="bg-teal-100 text-teal-800 p-2 rounded-full hover:bg-teal-200 transition-colors"
                onClick={() => setShowFullProfile(true)}
              >
                <User size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen image viewer */}
      {showFullscreen && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setShowFullscreen(false)}
        >
          <FullscreenImageViewer
            images={userImages}
            initialIndex={0}
            onClose={() => setShowFullscreen(false)}
          />
        </div>
      )}

      {/* Video call overlay */}
      {showVideoCall && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setShowVideoCall(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <VideoCall
              contactName={user.name}
              contactImage={user.image}
              onEndCall={() => setShowVideoCall(false)}
            />
          </div>
        </div>
      )}

      {/* Full profile view */}
      {showFullProfile && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setShowFullProfile(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ProfileView
              user={user}
              onClose={() => setShowFullProfile(false)}
              onMessage={() => {
                setShowFullProfile(false);
                setShowChat(true);
              }}
              onVideoCall={() => {
                setShowFullProfile(false);
                setShowVideoCall(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Chat overlay */}
      {showChat && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowChat(false)}
        >
          <div
            className="bg-white rounded-xl overflow-hidden w-full max-w-4xl h-[80vh] animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Messages</h2>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="h-[calc(80vh-4rem)]">
              <ChatPage />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
