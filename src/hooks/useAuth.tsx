
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/utils/types';
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('meditation-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation (would be handled by backend)
      if (email && password.length >= 6) {
        // Mock user data - in a real app, this would come from a backend
        const loggedInUser: User = {
          id: '1',
          email: email,
          name: 'Demo User'
        };
        
        setUser(loggedInUser);
        localStorage.setItem('meditation-user', JSON.stringify(loggedInUser));
        toast.success('Successfully logged in');
        return;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation (would be handled by backend)
      if (name && email && password.length >= 6) {
        // Create a new user
        const newUser: User = {
          id: Date.now().toString(),
          email,
          name
        };
        
        setUser(newUser);
        localStorage.setItem('meditation-user', JSON.stringify(newUser));
        toast.success('Account created successfully');
        return;
      }
      throw new Error('Invalid registration data');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('meditation-user');
    setUser(null);
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
