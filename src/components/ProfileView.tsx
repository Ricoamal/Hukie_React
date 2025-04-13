import { useState } from 'react';
import { X, MapPin, Calendar, Briefcase, GraduationCap, Heart, MessageCircle, Video, Flag, Share, ChevronLeft, ChevronRight, User, Users, Image } from 'lucide-react';

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

interface ProfileViewProps {
  user: UserData;
  onClose: () => void;
  onMessage: () => void;
  onVideoCall: () => void;
}

export default function ProfileView({ user, onClose, onMessage, onVideoCall }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'photos' | 'interests'>('about');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Generate multiple images for the user
  const userPhotos = [
    user.image,
    `/onboarding_${user.id % 3 + 1}.png`,
    '/logo.png'
  ];

  // Mock user details
  const userDetails = {
    location: 'Nairobi, Kenya',
    occupation: user.gender === 'male' ? 'Software Engineer' : 'Marketing Specialist',
    education: 'University of Nairobi',
    joinDate: 'January 2023',
    interests: ['Photography', 'Hiking', 'Reading', 'Cooking', 'Travel', 'Music', 'Art', 'Fitness'],
    languages: ['English', 'Swahili'],
    about: user.bio + ' I enjoy meeting new people and exploring new places. Always up for an adventure!',
    stats: {
      connections: 42,
      mutualFriends: 3,
      photosCount: 8,
      lastActive: '2 hours ago'
    },
    socialMedia: [
      { platform: 'Instagram', username: '@' + user.name.toLowerCase() },
      { platform: 'Twitter', username: '@' + user.name.toLowerCase() }
    ],
    compatibility: '87%',
    verified: true
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % userPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? userPhotos.length - 1 : prev - 1));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl overflow-hidden max-w-md w-full max-h-[90vh] flex flex-col animate-fade-in shadow-2xl border border-gray-100">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-r from-teal-300 via-teal-500 to-teal-300 opacity-30 animate-pulse pointer-events-none"></div>
        {/* Header */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-70 transition-all"
          >
            <X size={20} />
          </button>

          {/* Photo gallery */}
          <div className="relative h-80 bg-gray-200">
            <img
              src={userPhotos[currentPhotoIndex]}
              alt={user.name}
              className="w-full h-full object-cover"
            />

            {userPhotos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Photo indicators */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                  {userPhotos.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentPhotoIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User info */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}, {user.age}</h2>
              <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium">
                Connected
              </span>
            </div>
            <p className="text-gray-600 flex items-center mt-1">
              <MapPin size={16} className="mr-1" /> {userDetails.location} · {user.distance}
            </p>
            <p className="text-gray-600 flex items-center mt-1">
              <Briefcase size={16} className="mr-1" /> {userDetails.occupation}
            </p>
            <p className="text-gray-600 flex items-center mt-1">
              <GraduationCap size={16} className="mr-1" /> {userDetails.education}
            </p>

            {/* Action buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={onMessage}
                className="flex-1 mr-2 bg-teal-500 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-teal-600 transition-colors"
              >
                <MessageCircle size={18} className="mr-2" /> Message
              </button>
              <button
                onClick={onVideoCall}
                className="flex-1 ml-2 bg-teal-100 text-teal-800 py-2 px-4 rounded-lg flex items-center justify-center hover:bg-teal-200 transition-colors"
              >
                <Video size={18} className="mr-2" /> Video Call
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex px-2">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'about'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'photos'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab('interests')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'interests'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Interests
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white to-gray-50">
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <span className="bg-teal-100 text-teal-800 p-1 rounded-full mr-2">
                    <User size={16} />
                  </span>
                  About Me
                  {userDetails.verified && (
                    <span className="ml-2 text-teal-500" title="Verified Profile">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </h3>
                <p className="text-gray-700">{userDetails.about}</p>

                <div className="mt-3 flex items-center">
                  <span className="text-sm bg-teal-50 text-teal-800 px-2 py-1 rounded-full">
                    {userDetails.compatibility} Match
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-2">
                    <Briefcase size={16} />
                  </span>
                  Basic Info
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    <span>Joined {userDetails.joinDate}</span>
                  </div>
                  <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                    <MapPin size={16} className="mr-2 text-gray-500" />
                    <span>Lives in {userDetails.location}</span>
                  </div>
                  <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                    <Briefcase size={16} className="mr-2 text-gray-500" />
                    <span>{userDetails.occupation}</span>
                  </div>
                  <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                    <GraduationCap size={16} className="mr-2 text-gray-500" />
                    <span>{userDetails.education}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <span className="bg-purple-100 text-purple-800 p-1 rounded-full mr-2">
                    <MessageCircle size={16} />
                  </span>
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userDetails.languages.map((language, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">
                    <Share size={16} />
                  </span>
                  Social Media
                </h3>
                <div className="space-y-2">
                  {userDetails.socialMedia.map((social, index) => (
                    <div key={index} className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                      <span className="font-medium mr-2">{social.platform}:</span>
                      <span className="text-blue-600">{social.username}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="bg-pink-100 text-pink-800 p-1 rounded-full mr-2">
                    <Image size={16} />
                  </span>
                  Photos
                </h3>
                <span className="text-sm text-gray-500">{userDetails.stats.photosCount} photos</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {userPhotos.map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md transform hover:scale-105"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <img
                      src={photo}
                      alt={`${user.name}'s photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'interests' && (
            <div className="space-y-4">
              <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-yellow-100 text-yellow-800 p-1 rounded-full mr-2">
                    <Heart size={16} />
                  </span>
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userDetails.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-sm animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 p-1 rounded-full mr-2">
                    <Users size={16} />
                  </span>
                  Stats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-teal-600">{userDetails.stats.connections}</div>
                    <div className="text-xs text-gray-500">Connections</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-teal-600">{userDetails.stats.mutualFriends}</div>
                    <div className="text-xs text-gray-500">Mutual Friends</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-500 flex items-center">
                  <span className="bg-green-100 w-2 h-2 rounded-full mr-2"></span>
                  Last active {userDetails.stats.lastActive}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-between bg-gray-50">
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <Flag size={20} />
          </button>
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <Share size={20} />
          </button>
          <button className="text-red-500 hover:text-red-600 transition-colors">
            <Heart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
