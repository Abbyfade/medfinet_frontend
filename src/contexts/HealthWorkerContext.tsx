import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getCurrentHealthWorker, 
  saveHealthWorker, 
  clearCurrentHealthWorker,
  StoredHealthWorker 
} from '../utils/localStorage';

interface HealthWorker {
  id: string;
  name: string;
  facility_name: string;
  email: string;
  walletAddress: string;
  clinic: string;
  licenseNumber: string;
  verified: boolean;
  role: 'nurse' | 'doctor' | 'administrator';
}

interface HealthWorkerContextType {
  healthWorker: HealthWorker | null;
  login: (worker: HealthWorker) => void;
  logout: () => void;
  updateHealthWorker: (updates: Partial<HealthWorker>) => void;
  isAuthenticated: boolean;
}

const HealthWorkerContext = createContext<HealthWorkerContextType>({
  healthWorker: null,
  login: () => {},
  logout: () => {},
  updateHealthWorker: () => {},
  isAuthenticated: false,
});

export const useHealthWorker = () => {
  const context = useContext(HealthWorkerContext);
  if (!context) {
    throw new Error('useHealthWorker must be used within a HealthWorkerProvider');
  }
  return context;
};

interface HealthWorkerProviderProps {
  children: ReactNode;
}

export const HealthWorkerProvider = ({ children }: HealthWorkerProviderProps) => {
  const [healthWorker, setHealthWorker] = useState<HealthWorker | null>(null);

  useEffect(() => {
    // Load current health worker from localStorage
    const storedHealthWorker = getCurrentHealthWorker();
    if (storedHealthWorker) {
      setHealthWorker(storedHealthWorker);
    }
  }, []);

  const login = (worker: HealthWorker) => {
    const storedWorker: StoredHealthWorker = {
      ...worker,
      createdAt: new Date().toISOString(),
    };
    
    saveHealthWorker(storedWorker);
    setHealthWorker(worker);
  };

  const logout = () => {
    clearCurrentHealthWorker();
    setHealthWorker(null);
    // Also clear wallet connection
    localStorage.removeItem('connectedWallet');
  };

  const updateHealthWorker = (updates: Partial<HealthWorker>) => {
    if (healthWorker) {
      const updatedWorker = { ...healthWorker, ...updates };
      const storedWorker = getCurrentHealthWorker();
      if (storedWorker) {
        const updatedStoredWorker: StoredHealthWorker = {
          ...storedWorker,
          ...updates,
        };
        saveHealthWorker(updatedStoredWorker);
      }
      setHealthWorker(updatedWorker);
    }
  };

  const isAuthenticated = healthWorker !== null && healthWorker.verified;

  return (
    <HealthWorkerContext.Provider value={{ 
      healthWorker, 
      login, 
      logout, 
      updateHealthWorker, 
      isAuthenticated 
    }}>
      {children}
    </HealthWorkerContext.Provider>
  );
};

export default HealthWorkerContext;