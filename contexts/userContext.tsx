import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getUser, storeUser } from '@/utils/storage';

import { User } from '@/utils/storage';

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  initializeUser: () => Promise<void>;
  updateAppUser: (user: User) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const initializeUser = async () => {
    try {
      const newUser = {
        cards: [],
      };
      setUser(newUser);
      storeUser(newUser);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserInfo = async () => {
    try {
      const storedUser = await getUser();
      if (storedUser) {
        console.log('Stored user found:', storedUser);
        setUser(storedUser);
      } else {
        console.log('No stored user found initializing user');
        await initializeUser();
      }
    } catch (error) {
      console.error('Error getting user info:', error);
    }
  };

  const updateAppUser = async (updatedUser: any) => {
    try {
      await storeUser(updatedUser);
      setUser(updatedUser);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        initializeUser,
        updateAppUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
