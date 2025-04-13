import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the User type
interface User {
  id: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext) as AuthContextType;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user database - this is a mutable object that will store our users
let MOCK_USERS: Record<string, { email: string; password: string }> = {
  'user1@example.com': { email: 'user1@example.com', password: 'password123' },
  'test@test.com': { email: 'test@test.com', password: 'test123' },
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if there's a user in localStorage or sessionStorage on initial load
  useEffect(() => {
    const storedUserLocal = localStorage.getItem('currentUser');
    const storedUserSession = sessionStorage.getItem('currentUser');

    if (storedUserLocal) {
      setCurrentUser(JSON.parse(storedUserLocal));
    } else if (storedUserSession) {
      setCurrentUser(JSON.parse(storedUserSession));
    }

    setLoading(false);
  }, []);

  async function signup(email: string, password: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    if (MOCK_USERS[email]) {
      throw new Error('Email already in use');
    }

    // Add user to mock database
    MOCK_USERS[email] = { email, password };

    // Create user object
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 15),
      email,
      displayName: email.split('@')[0]
    };

    // Set current user
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    return Promise.resolve();
  }

  async function login(email: string, password: string, rememberMe: boolean = false) {
    console.log('Login attempt:', { email, password, rememberMe });
    console.log('Available users:', MOCK_USERS);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user exists and password matches
    const user = MOCK_USERS[email];
    if (!user) {
      console.error('User not found:', email);
      throw new Error('User not found. Please check your email.');
    }

    if (user.password !== password) {
      console.error('Password mismatch for:', email);
      throw new Error('Incorrect password. Please try again.');
    }

    console.log('Login successful for:', email);

    // Create user object
    const loggedInUser: User = {
      id: Math.random().toString(36).substring(2, 15),
      email,
      displayName: email.split('@')[0]
    };

    // Set current user
    setCurrentUser(loggedInUser);

    // Store user in localStorage if rememberMe is true, otherwise in sessionStorage
    if (rememberMe) {
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
    } else {
      sessionStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      // Remove from localStorage if it exists there
      localStorage.removeItem('currentUser');
    }

    return Promise.resolve();
  }

  async function resetPassword(email: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user exists
    const user = MOCK_USERS[email];
    if (!user) {
      throw new Error('No account found with this email address.');
    }

    // In a real app, this would send a password reset email
    console.log('Password reset requested for:', email);

    return Promise.resolve();
  }

  async function logout() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Clear current user
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');

    return Promise.resolve();
  }

  const value = {
    currentUser,
    loading,
    signup,
    login,
    resetPassword,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
