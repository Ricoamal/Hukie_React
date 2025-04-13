import { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, Users, MoreVertical } from 'lucide-react';

interface VideoCallProps {
  contactName: string;
  contactImage: string;
  onEndCall: () => void;
}

export default function VideoCall({ contactName, contactImage, onEndCall }: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);

  // Simulate call connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Call duration timer
  useEffect(() => {
    if (!isConnecting) {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isConnecting]);

  // Format call duration as mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Remote video (full screen) */}
      <div className="flex-1 relative">
        {isConnecting ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <img 
              src={contactImage} 
              alt={contactName} 
              className="w-24 h-24 rounded-full object-cover mb-4 animate-pulse"
            />
            <h3 className="text-white text-xl font-semibold mb-2">Calling {contactName}...</h3>
            <p className="text-gray-400">Connecting secure video call</p>
          </div>
        ) : (
          <>
            {/* This would be the remote video stream in a real implementation */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black">
              <img 
                src={contactImage} 
                alt={contactName}
                className="w-full h-full object-cover opacity-50"
              />
            </div>
            
            {/* Call info overlay */}
            <div className="absolute top-4 left-4 flex items-center bg-black bg-opacity-50 rounded-full px-3 py-1">
              <span className="text-white text-sm">{formatDuration(callDuration)}</span>
            </div>
            
            {/* Local video (picture-in-picture) */}
            <div className="absolute bottom-24 right-4 w-32 h-48 rounded-lg overflow-hidden border-2 border-white shadow-lg">
              {!isVideoOff ? (
                <div className="w-full h-full bg-gray-800">
                  {/* This would be the local video stream in a real implementation */}
                  <div className="w-full h-full flex items-center justify-center text-white">
                    You
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <VideoOff className="text-white" size={24} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Call controls */}
      <div className="bg-gray-900 p-4">
        <div className="flex justify-center space-x-4 mb-4">
          <button 
            className={`rounded-full p-3 ${isMuted ? 'bg-red-500' : 'bg-gray-700'} text-white`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <button 
            className={`rounded-full p-3 ${isVideoOff ? 'bg-red-500' : 'bg-gray-700'} text-white`}
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </button>
          <button 
            className="rounded-full p-3 bg-red-600 text-white"
            onClick={onEndCall}
          >
            <Phone size={24} className="transform rotate-135" />
          </button>
          <button className="rounded-full p-3 bg-gray-700 text-white">
            <MessageSquare size={24} />
          </button>
          <button className="rounded-full p-3 bg-gray-700 text-white">
            <Users size={24} />
          </button>
          <button className="rounded-full p-3 bg-gray-700 text-white">
            <MoreVertical size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
