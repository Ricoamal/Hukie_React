import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Phone, Video, MoreVertical, Send, Smile, Paperclip, Mic, Archive, Trash2, X, ChevronLeft, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  senderId: number;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  attachments?: string[];
}

interface ChatContact {
  id: number;
  name: string;
  image: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  online: boolean;
  hasStatus: boolean;
  statusSeen: boolean;
}

export default function ChatPage() {
  // Add CSS to ensure the chat container takes full height
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .chat-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .messages-container {
        flex: 1;
        overflow-y: auto;
        max-height: calc(100vh - 180px);
        background-color: #f0f9ff;
        background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%230d9488' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
      }
      .input-container {
        position: sticky;
        bottom: 0;
        background: white;
        z-index: 10;
        padding: 12px 16px;
        border-top: 1px solid #e0e0e0;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
      }
      .avatar-strip {
        display: flex;
        overflow-x: auto;
        padding: 12px 8px;
        background: #0d9488;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        scrollbar-width: none;
      }
      .avatar-strip::-webkit-scrollbar {
        display: none;
      }
      .avatar-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 15px;
        min-width: 60px;
      }
      .avatar-item span {
        color: rgba(255, 255, 255, 0.9);
        margin-top: 4px;
        font-weight: 500;
      }
      .status-ring {
        padding: 2px;
        border-radius: 50%;
        background: linear-gradient(to right, #14b8a6, #0d9488);
        border: 2px solid rgba(255, 255, 255, 0.3);
      }
      .status-ring.seen {
        background: rgba(255, 255, 255, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.2);
      }
      .chat-header {
        background-color: #0d9488;
        color: white;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      .chat-header-with-strip {
        border-bottom: none;
      }
      .chat-bubble {
        position: relative;
        border-radius: 7.5px;
        max-width: 75%;
        padding: 8px 12px;
        margin-bottom: 8px;
      }
      .chat-bubble.sent {
        background-color: #d1fae5;
        border-top-right-radius: 0;
        margin-left: auto;
        border: 1px solid rgba(20, 184, 166, 0.1);
      }
      .chat-bubble.received {
        background-color: white;
        border-top-left-radius: 0;
      }
      .chat-bubble::after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border: 6px solid transparent;
        top: 0;
      }
      .chat-bubble.sent::after {
        border-left-color: #d1fae5;
        border-top-color: #d1fae5;
        right: -6px;
      }
      .chat-bubble.received::after {
        border-right-color: white;
        border-top-color: white;
        left: -6px;
      }
      .swipe-actions {
        display: flex;
        position: absolute;
        right: 0;
        height: 100%;
        transform: translateX(100%);
        transition: transform 0.2s ease;
      }
      .swipe-action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 70px;
        height: 100%;
        color: white;
      }
      @media (max-width: 768px) {
        .chat-container {
          height: 100%;
          position: relative;
          z-index: 5;
        }
        .messages-container {
          max-height: calc(100vh - 200px);
        }
        .chat-page-container {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [activeChat, setActiveChat] = useState<number | null>(1); // Set default chat to first contact
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(!isMobileView);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showOptionsFor, setShowOptionsFor] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample chat contacts for the messaging feature
  const contacts: ChatContact[] = [
    {
      id: 1,
      name: 'Mary',
      image: '/User-Mary.jpg',
      lastMessage: 'Hey, how are you doing?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      unreadCount: 2,
      online: true,
      hasStatus: true,
      statusSeen: false
    },
    {
      id: 3,
      name: 'Wamboi',
      image: '/User-wamboi.jpg',
      lastMessage: 'Looking forward to our coffee date!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      unreadCount: 0,
      online: true,
      hasStatus: true,
      statusSeen: true
    },
    {
      id: 4,
      name: 'Kipchoge',
      image: '/User-kipchoge.png',
      lastMessage: 'Let me know when you want to go for a run',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      unreadCount: 0,
      online: false,
      hasStatus: false,
      statusSeen: false
    },
    {
      id: 5,
      name: 'Omondi',
      image: '/User-omondi.png',
      lastMessage: 'Did you see the game last night?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      unreadCount: 1,
      online: true,
      hasStatus: true,
      statusSeen: false
    },
    {
      id: 6,
      name: 'Wekesa',
      image: '/User-wekesa.png',
      lastMessage: 'Thanks for the information!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unreadCount: 0,
      online: false,
      hasStatus: true,
      statusSeen: true
    }
  ];

  // Sample messages for each chat
  const [chatMessages, setChatMessages] = useState<Record<number, Message[]>>({
    1: [
      {
        id: '1',
        senderId: 1,
        text: 'Hi there! How are you?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'read'
      },
      {
        id: '2',
        senderId: 0, // Current user
        text: 'I\'m good, thanks! How about you?',
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        status: 'read'
      },
      {
        id: '3',
        senderId: 1,
        text: 'Doing great! I was wondering if you\'d like to grab coffee sometime this week?',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        status: 'read'
      },
      {
        id: '4',
        senderId: 0,
        text: 'That sounds lovely! How about Wednesday afternoon?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        status: 'read'
      },
      {
        id: '5',
        senderId: 1,
        text: 'Perfect! There\'s a nice café downtown called "Brew Haven". Have you been there?',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        status: 'read'
      },
      {
        id: '6',
        senderId: 1,
        text: 'They have the best pastries too!',
        timestamp: new Date(Date.now() - 1000 * 60 * 9),
        status: 'read'
      },
      {
        id: '7',
        senderId: 0,
        text: 'I haven\'t, but I\'ve heard good things about it. Looking forward to it!',
        timestamp: new Date(Date.now() - 1000 * 60 * 7),
        status: 'delivered'
      },
      {
        id: '8',
        senderId: 1,
        text: 'Great! See you Wednesday at 3pm?',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        status: 'delivered'
      }
    ],
    3: [
      {
        id: '1',
        senderId: 3,
        text: 'Hey! I saw your profile and I love that you\'re into art too!',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        status: 'read'
      },
      {
        id: '2',
        senderId: 0,
        text: 'Thanks! I\'ve been painting for about 5 years now. What kind of art do you do?',
        timestamp: new Date(Date.now() - 1000 * 60 * 115),
        status: 'read'
      },
      {
        id: '3',
        senderId: 3,
        text: 'I mostly do digital art and some watercolor. I\'d love to see your work sometime!',
        timestamp: new Date(Date.now() - 1000 * 60 * 110),
        status: 'read'
      },
      {
        id: '4',
        senderId: 0,
        text: 'I\'d be happy to show you! There\'s an art exhibition this weekend if you\'d like to go?',
        timestamp: new Date(Date.now() - 1000 * 60 * 100),
        status: 'read'
      },
      {
        id: '5',
        senderId: 3,
        text: 'That sounds perfect! Looking forward to our coffee date!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        status: 'delivered'
      }
    ],
    4: [
      {
        id: '1',
        senderId: 4,
        text: 'Hi there! I noticed you mentioned you enjoy running in your profile.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        status: 'read'
      },
      {
        id: '2',
        senderId: 0,
        text: 'Yes, I try to run at least 3 times a week! How about you?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.9),
        status: 'read'
      },
      {
        id: '3',
        senderId: 4,
        text: 'I run almost every day! I\'m training for a half marathon next month.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.8),
        status: 'read'
      },
      {
        id: '4',
        senderId: 0,
        text: 'That\'s impressive! I\'ve always wanted to try a half marathon.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.7),
        status: 'read'
      },
      {
        id: '5',
        senderId: 4,
        text: 'We should train together sometime! It\'s always more fun with a partner.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.5),
        status: 'read'
      },
      {
        id: '6',
        senderId: 0,
        text: 'I\'d like that! When and where do you usually run?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        status: 'read'
      },
      {
        id: '7',
        senderId: 4,
        text: 'I usually run at Karura Forest in the mornings around 6am. How about you?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5),
        status: 'read'
      },
      {
        id: '8',
        senderId: 0,
        text: 'I\'m more of an evening runner, but I could adjust for a morning run!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.2),
        status: 'read'
      },
      {
        id: '9',
        senderId: 4,
        text: 'Let me know when you want to go for a run',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        status: 'delivered'
      }
    ]
  });

  // Scroll to bottom of messages when active chat changes or new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat, chatMessages]);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (mobile) {
        // On mobile, if we have an active chat, show the chat view instead of sidebar
        if (activeChat) {
          setShowSidebar(false);
        }
      } else {
        // On desktop, always show the sidebar
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount
    return () => window.removeEventListener('resize', handleResize);
  }, [activeChat]);

  // Set initial state for mobile view
  useEffect(() => {
    if (isMobileView && activeChat) {
      setShowSidebar(false);
    }
  }, []);

  // Toggle message selection
  const toggleMessageSelection = (messageId: string) => {
    if (selectedMessages.includes(messageId)) {
      setSelectedMessages(selectedMessages.filter(id => id !== messageId));
      if (selectedMessages.length === 1) {
        setIsSelectionMode(false);
      }
    } else {
      setSelectedMessages([...selectedMessages, messageId]);
    }
  };

  // Delete selected messages
  const deleteSelectedMessages = useCallback(() => {
    if (activeChat && selectedMessages.length > 0) {
      const updatedMessages = { ...chatMessages };
      updatedMessages[activeChat] = updatedMessages[activeChat].filter(
        msg => !selectedMessages.includes(msg.id)
      );
      setChatMessages(updatedMessages);
      setSelectedMessages([]);
      setIsSelectionMode(false);
    }
  }, [activeChat, selectedMessages, chatMessages]);

  // Archive chat
  const archiveChat = (contactId: number) => {
    // In a real app, this would mark the conversation as archived in the database
    // For this demo, we'll just remove it from the active chat
    setActiveChat(null);
    setShowOptionsFor(null);
    // Show a toast or notification that the chat was archived
    alert(`Chat with ${contacts.find(c => c.id === contactId)?.name} archived`);
  };

  // Clear chat history
  const clearChatHistory = (contactId: number) => {
    if (window.confirm('Are you sure you want to clear this chat history? This action cannot be undone.')) {
      const updatedMessages = { ...chatMessages };
      updatedMessages[contactId] = [];
      setChatMessages(updatedMessages);
      setShowOptionsFor(null);
    }
  };

  // Delete chat
  const deleteChat = (contactId: number) => {
    if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      // In a real app, this would delete the conversation from the database
      setActiveChat(null);
      setShowOptionsFor(null);
      // Show a toast or notification that the chat was deleted
      alert(`Chat with ${contacts.find(c => c.id === contactId)?.name} deleted`);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !activeChat) return;

    // Add new message to the chat
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 0, // Current user
      text: message,
      timestamp: new Date(),
      status: 'sent'
    };

    const updatedMessages = { ...chatMessages };
    updatedMessages[activeChat] = [...(updatedMessages[activeChat] || []), newMessage];
    setChatMessages(updatedMessages);

    // Clear input
    setMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 relative chat-page-container">
      {/* Contacts sidebar */}
      {(showSidebar || !activeChat) && (
        <div className={`${isMobileView ? 'w-full absolute inset-0 h-full' : 'w-2/5 relative'} border-r border-gray-200 bg-white z-20`}>
          {/* Chat header */}
          <div className="chat-header p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Chats</h2>
            <div className="flex space-x-2">
              <button className="text-white p-1">
                <Search size={20} />
              </button>
              <button className="text-white p-1">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Status/Story strip */}
          <div className="avatar-strip">
            {/* Your status */}
            <div className="avatar-item">
              <div className="relative mb-1">
                <img
                  src="/logo.png"
                  alt="Your Status"
                  className="w-14 h-14 rounded-full object-cover border-2 border-white"
                />
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-teal-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
              <span className="text-xs text-gray-600 truncate">Your status</span>
            </div>

            {/* Contact statuses */}
            {contacts.filter(c => c.hasStatus).map(contact => (
              <div key={`status-${contact.id}`} className="avatar-item">
                <div className={`status-ring ${contact.statusSeen ? 'seen' : ''} mb-1`}>
                  <img
                    src={contact.image || '/logo.png'}
                    alt={contact.name}
                    className="w-14 h-14 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/logo.png';
                    }}
                  />
                </div>
                <span className="text-xs text-gray-600 truncate">{contact.name}</span>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="px-3 py-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search or start new chat"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 text-gray-500" size={18} />
            </div>
          </div>

          {/* Chat list */}
          <div className="overflow-y-auto h-[calc(100%-12rem)]">
            {filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  className={`relative flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    activeChat === contact.id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => {
                    setActiveChat(contact.id);
                    if (isMobileView) {
                      setShowSidebar(false);
                    }
                  }}
                >
                  <div className="relative">
                    <img
                      src={contact.image || '/logo.png'}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/logo.png';
                      }}
                    />
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                      <span className={`text-xs ${contact.unreadCount > 0 ? 'text-teal-500 font-semibold' : 'text-gray-500'}`}>
                        {formatTime(contact.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                      <div className="flex items-center">
                        {contact.unreadCount > 0 && (
                          <div className="bg-teal-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ml-2">
                            {contact.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Swipe actions - these would need JavaScript to work fully */}
                  <div className="swipe-actions">
                    <button className="swipe-action-btn bg-blue-500">
                      <Archive size={20} />
                    </button>
                    <button className="swipe-action-btn bg-red-500">
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Contact options dropdown */}
                  {showOptionsFor === contact.id && (
                    <div className="absolute right-4 top-12 bg-white shadow-lg rounded-lg py-1 z-30 w-48 border border-gray-200">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          archiveChat(contact.id);
                        }}
                      >
                        <Archive size={16} className="mr-2" /> Archive chat
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearChatHistory(contact.id);
                        }}
                      >
                        <X size={16} className="mr-2" /> Clear history
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(contact.id);
                        }}
                      >
                        <Trash2 size={16} className="mr-2" /> Delete chat
                      </button>
                    </div>
                  )}

                  <button
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowOptionsFor(showOptionsFor === contact.id ? null : contact.id);
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No conversations found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 flex flex-col relative chat-container">
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="chat-header flex items-center justify-between p-3">
                <div className="flex items-center">
                  {isMobileView && (
                    <button
                      className="mr-2 text-white"
                      onClick={() => setShowSidebar(true)}
                    >
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  <img
                    src={contacts.find(c => c.id === activeChat)?.image || '/logo.png'}
                    alt={contacts.find(c => c.id === activeChat)?.name}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/logo.png';
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-white">{contacts.find(c => c.id === activeChat)?.name}</h3>
                    <p className="text-xs text-white opacity-80">
                      {contacts.find(c => c.id === activeChat)?.online ? 'Online' : 'Last seen today at ' + formatTime(new Date())}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="text-white">
                    <Phone size={20} />
                  </button>
                  <button className="text-white">
                    <Video size={20} />
                  </button>
                  <button className="text-white">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 messages-container">
                {chatMessages[activeChat]?.length > 0 ? (
                  chatMessages[activeChat]?.map((msg, index) => {
                    const isCurrentUser = msg.senderId === 0;
                    const showDate = index === 0 ||
                      formatDate(chatMessages[activeChat][index - 1].timestamp) !== formatDate(msg.timestamp);
                    const isSelected = selectedMessages.includes(msg.id);

                    return (
                      <div key={msg.id} className="mb-4">
                        {showDate && (
                          <div className="text-center my-4">
                            <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                              {formatDate(msg.timestamp)}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          onClick={() => isSelectionMode && toggleMessageSelection(msg.id)}
                        >
                          <div className={`flex items-end ${isSelectionMode ? 'cursor-pointer' : ''}`}>
                            {isSelectionMode && (
                              <div className={`mr-2 flex items-center justify-center h-5 w-5 rounded-full border ${isSelected ? 'bg-teal-500 border-teal-500 text-white' : 'border-gray-300 bg-white'}`}>
                                {isSelected && <Check size={12} />}
                              </div>
                            )}
                            <div className={`chat-bubble ${isCurrentUser ? 'sent' : 'received'} ${isSelected ? 'ring-2 ring-teal-500' : ''}`}>
                              <p>{msg.text}</p>
                              <div className="flex justify-end items-center mt-1">
                                <span className="text-xs opacity-70">
                                  {formatTime(msg.timestamp)}
                                </span>
                                {isCurrentUser && (
                                  <span className="ml-1 text-xs">
                                    {msg.status === 'sent' && <Check size={12} className="inline" />}
                                    {msg.status === 'delivered' && <CheckCheck size={12} className="inline" />}
                                    {msg.status === 'read' && (
                                      <CheckCheck size={12} className="inline text-blue-400" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-white rounded-lg p-6 shadow-sm">
                    <p className="font-medium">No messages yet</p>
                    <p className="text-sm mt-2">Start the conversation!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* WhatsApp-like message input */}
              <div className="input-container">
                <div className="flex items-center">
                  <button className="text-gray-500 p-2 rounded-full hover:bg-gray-100">
                    <Smile size={24} />
                  </button>
                  <button className="text-gray-500 p-2 rounded-full hover:bg-gray-100">
                    <Paperclip size={24} />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message"
                    className="flex-1 mx-2 py-3 px-4 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  {message.trim() ? (
                    <button
                      className="bg-teal-600 text-white rounded-full p-2 hover:bg-teal-700 transition-colors shadow-md"
                      onClick={handleSendMessage}
                    >
                      <Send size={20} />
                    </button>
                  ) : (
                    <button className="text-gray-500 p-2 rounded-full hover:bg-gray-100">
                      <Mic size={24} />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
              <img src="/logo.png" alt="Hukie Logo" className="w-20 h-20 mb-6 animate-pulse" />
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Welcome to Hukie Chat</h3>
              <p className="text-gray-500 text-center max-w-md animate-fade-in">
                Select a conversation to start chatting or connect with more people to expand your network.
              </p>
              <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-600">End-to-end encrypted</p>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}

