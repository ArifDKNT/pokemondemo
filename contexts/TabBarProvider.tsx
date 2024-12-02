import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';

interface TabBarContextType {
  isTabBarVisible: boolean;
  opacity: any;
  showTabBar: () => void;
  hideTabBar: () => void;
  showTabBarAnimated: () => void;
  hideTabBarAnimated: () => void;
}

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export const useTabBar = (): TabBarContextType => {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error('useTabBar must be used within a TabBarProvider');
  }
  return context;
};

interface TabBarProviderProps {
  children: ReactNode;
}

export const TabBarProvider: React.FC<TabBarProviderProps> = ({ children }) => {
  const [isTabBarVisible, setTabBarVisible] = useState(true);
  const opacity = useSharedValue(1); // Initialize opacity at 1 (fully visible)

  const hideTabBarAnimated = () => {
    opacity.value = withTiming(0, { duration: 300 }); // Fade out to 0 over 300ms
  };

  const showTabBarAnimated = () => {
    opacity.value = withTiming(1, { duration: 300 }); // Fade in to 1 over 300ms
  };
  const showTabBar = () => setTabBarVisible(true);
  const hideTabBar = () => setTabBarVisible(false);

  return (
    <TabBarContext.Provider
      value={{
        isTabBarVisible,
        opacity,
        showTabBar,
        hideTabBar,
        showTabBarAnimated,
        hideTabBarAnimated,
      }}
    >
      {children}
    </TabBarContext.Provider>
  );
};
