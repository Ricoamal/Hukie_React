import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { User, MapPin, Calendar, Briefcase, GraduationCap, Heart, MessageCircle, Video, Flag, Share, ChevronLeft, ChevronRight, Users, Image, Settings, Edit, Camera, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function MyProfile() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'about' | 'photos' | 'settings'>('about');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePicture, setProfilePicture] = useState('/logo.png');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [autoSave, setAutoSave] = useState(true);
  const bioTextareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-save timer
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mock user profile data
  const [userProfile, setUserProfile] = useState({
    name: currentUser?.displayName || 'User',
    age: 28,
    gender: 'male',
    image: profilePicture, // Use the state variable
    location: { latitude: -1.2921, longitude: 36.8219 },
    distance: 'Nairobi, Kenya',
    bio: 'Hi there! This is my profile on Hukie.',
    occupation: 'Professional',
    education: 'University Graduate',
    joinDate: 'January 2023',
    interests: ['Dating', 'Friendship', 'Networking', 'Travel', 'Music', 'Art', 'Fitness'],
    languages: ['English', 'Swahili'],
    photos: [
      profilePicture, // Use the state variable
      '/onboarding_1.png',
      '/onboarding_2.png',
    ],
    stats: {
      connections: 12,
      mutualFriends: 5,
      photosCount: 3,
      lastActive: 'Now'
    },
    socialMedia: [
      { platform: 'Instagram', username: '@hukie_user' },
      { platform: 'Twitter', username: '@hukie_user' }
    ],
    verified: true
  });
  
  // Initialize bio state from userProfile
  useEffect(() => {
    setBio(userProfile.bio);
  }, [userProfile.bio]);

  // Handle profile picture upload
  const handleProfilePictureUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingPhoto(true);
      
      // Create a FileReader to read the image
      const reader = new FileReader();
      reader.onload = (e) => {
        // Set the profile picture to the data URL
        if (e.target?.result) {
          const newProfilePic = e.target.result as string;
          setProfilePicture(newProfilePic);
          
          // Update the userProfile state
          setUserProfile(prev => ({
            ...prev,
            image: newProfilePic,
            photos: [newProfilePic, ...prev.photos.slice(1)]
          }));
          
          setUploadingPhoto(false);
          setSaveStatus('saved');
          
          // Reset save status after 3 seconds
          setTimeout(() => setSaveStatus('idle'), 3000);
          
          // In a real app, you would upload the file to a server here
          console.log('Profile picture updated');
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle bio edit
  const handleEditBio = () => {
    setEditingBio(true);
    // Focus the textarea after it renders
    setTimeout(() => {
      if (bioTextareaRef.current) {
        bioTextareaRef.current.focus();
      }
    }, 0);
  };
  
  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
    
    // If auto-save is enabled, set up a timer to save after typing stops
    if (autoSave) {
      setSaveStatus('saving');
      
      // Clear any existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // Set a new timer
      autoSaveTimerRef.current = setTimeout(() => {
        handleSaveBio();
      }, 1000); // Save 1 second after typing stops
    }
  };
  
  const handleSaveBio = () => {
    setSaveStatus('saving');
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Update the userProfile state
      setUserProfile(prev => ({
        ...prev,
        bio: bio
      }));
      
      setEditingBio(false);
      setSaveStatus('saved');
      
      // Reset save status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 500);
  };
  
  const handleCancelBioEdit = () => {
    setBio(userProfile.bio); // Reset to original
    setEditingBio(false);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % userProfile.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? userProfile.photos.length - 1 : prev - 1));
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will happen automatically via AuthContext
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-lg animate-fade-in">
      {/* Header with profile photo */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-r from-teal-500 to-teal-600"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative">
            <img
              src={userProfile.photos[currentPhotoIndex]}
              alt={userProfile.name}
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
            <button 
              onClick={handleProfilePictureUpload}
              className="absolute bottom-0 right-0 bg-teal-500 text-white p-1 rounded-full hover:bg-teal-600 transition-colors"
            >
              {uploadingPhoto ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Camera size={16} />
              )}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="pt-16 px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center">
          {userProfile.name}
          {userProfile.verified && (
            <span className="ml-2 text-teal-500" title="Verified Profile">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </h1>
        <p className="text-gray-600">{currentUser?.email}</p>
        <p className="text-gray-600 flex items-center justify-center mt-1">
          <MapPin size={16} className="mr-1" /> {userProfile.distance}
        </p>

        <div className="flex justify-center mt-4 space-x-2">
          <button className="bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-teal-600 transition-colors">
            <Edit size={16} className="mr-2" /> Edit Profile
          </button>
          <button 
            onClick={handleLogout}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
          >
            <LogOut size={16} className="mr-2" /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mt-6">
        <nav className="flex justify-center">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'about'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'photos'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Photos
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'settings'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div className="p-6 bg-gradient-to-b from-white to-gray-50">
        {activeTab === 'about' && (
          <div className="space-y-4">
            <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <span className="bg-teal-100 text-teal-800 p-1 rounded-full mr-2">
                  <User size={16} />
                </span>
                About Me
              </h3>
              
              {editingBio ? (
                <div className="space-y-2">
                  <textarea
                    ref={bioTextareaRef}
                    value={bio}
                    onChange={handleBioChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={handleSaveBio}
                        disabled={saveStatus === 'saving'}
                        className="px-3 py-1 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {saveStatus === 'saving' ? (
                          <>
                            <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Saving...
                          </>
                        ) : 'Save'}
                      </button>
                      <button 
                        onClick={handleCancelBioEdit}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                    
                    <div className="flex items-center">
                      <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={autoSave} 
                          onChange={() => setAutoSave(!autoSave)}
                          className="mr-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                        />
                        Auto-save
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700">{userProfile.bio}</p>
                  <div className="flex items-center justify-between mt-3">
                    <button 
                      onClick={handleEditBio}
                      className="text-sm text-teal-600 hover:text-teal-700 flex items-center"
                    >
                      <Edit size={14} className="mr-1" /> Edit
                    </button>
                    
                    {saveStatus === 'saved' && (
                      <span className="text-xs text-green-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Saved
                      </span>
                    )}
                  </div>
                </div>
              )}
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
                  <span>Joined {userProfile.joinDate}</span>
                </div>
                <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                  <MapPin size={16} className="mr-2 text-gray-500" />
                  <span>Lives in {userProfile.distance}</span>
                </div>
                <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                  <Briefcase size={16} className="mr-2 text-gray-500" />
                  <span>{userProfile.occupation}</span>
                </div>
                <div className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                  <GraduationCap size={16} className="mr-2 text-gray-500" />
                  <span>{userProfile.education}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <button className="text-sm text-teal-600 hover:text-teal-700 flex items-center">
                  <Edit size={14} className="mr-1" /> Edit
                </button>
                
                {saveStatus === 'saved' && (
                  <span className="text-xs text-green-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="bg-yellow-100 text-yellow-800 p-1 rounded-full mr-2">
                  <Heart size={16} />
                </span>
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-sm animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3">
                <button className="text-sm text-teal-600 hover:text-teal-700 flex items-center">
                  <Edit size={14} className="mr-1" /> Edit
                </button>
                
                {saveStatus === 'saved' && (
                  <span className="text-xs text-green-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved
                  </span>
                )}
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
                  <div className="text-2xl font-bold text-teal-600">{userProfile.stats.connections}</div>
                  <div className="text-xs text-gray-500">Connections</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-teal-600">{userProfile.stats.photosCount}</div>
                  <div className="text-xs text-gray-500">Photos</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-500 flex items-center">
                <span className="bg-green-100 w-2 h-2 rounded-full mr-2"></span>
                Last active {userProfile.stats.lastActive}
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
                My Photos
              </h3>
              <button className="text-sm text-teal-600 hover:text-teal-700 flex items-center">
                <Camera size={16} className="mr-1" /> Add Photos
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {userProfile.photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md transform hover:scale-105 relative group"
                >
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="bg-white text-red-500 p-2 rounded-full">
                      <Flag size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <div
                onClick={handleProfilePictureUpload}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-teal-500 hover:border-teal-500 transition-colors cursor-pointer"
              >
                {uploadingPhoto ? (
                  <div className="h-6 w-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Camera size={24} />
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Settings</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Email</span>
                  <span className="text-gray-500">{currentUser?.email}</span>
                </div>
                
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Password</span>
                  <button className="text-teal-600 hover:text-teal-700 text-sm">Change</button>
                </div>
                
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Location Services</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Privacy Settings</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Profile Visibility</span>
                  <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 p-2">
                    <option>Everyone</option>
                    <option>Connections Only</option>
                    <option>Private</option>
                  </select>
                </div>
                
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Show Distance</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-red-600 mb-3">Danger Zone</h3>
              
              <div className="space-y-3">
                <button className="w-full text-left p-2 hover:bg-red-50 rounded-lg text-red-600 flex items-center justify-between">
                  <span>Deactivate Account</span>
                  <span>→</span>
                </button>
                
                <button className="w-full text-left p-2 hover:bg-red-50 rounded-lg text-red-600 flex items-center justify-between">
                  <span>Delete Account</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
