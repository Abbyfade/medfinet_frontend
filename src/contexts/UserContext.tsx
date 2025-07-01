import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { 
  getCurrentUser, 
  saveUser, 
  clearCurrentUser, 
  initializeSampleData,
  StoredUser 
} from '../utils/localStorage';

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initializeSampleData();

    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser({
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        role: storedUser.role,
        avatar: storedUser.avatar,
        wallet_address: storedUser.walletAddress, // ✅ Add this
      });
    }
  }, []);


  const login = (userData: User) => {
  const storedUser: StoredUser = {
    ...userData,
    createdAt: new Date().toISOString(),
  };

  saveUser(storedUser);
  setUser(userData);
};


  const logout = () => {
    clearCurrentUser();
    setUser(null);
    // Also clear wallet connection
    localStorage.removeItem('connectedWallet');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      const storedUser = getCurrentUser();
      if (storedUser) {
        const updatedStoredUser: StoredUser = {
          ...storedUser,
          ...updates,
        };
        saveUser(updatedStoredUser);
      }
      setUser(updatedUser);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;