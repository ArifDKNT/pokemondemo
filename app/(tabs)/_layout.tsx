import React from 'react';
import { Tabs } from 'expo-router';
import TabsUI from '@/components/TabsUi';
import { useTabBar } from '@/contexts/TabBarProvider';
import type { RelativePathString } from 'expo-router/build/types';

// Define the tabs with proper types
const tabs: {
  name: string;
  route: RelativePathString;
  icon: 'home' | 'heart';
}[] = [
  { name: 'Feed', route: '/' as RelativePathString, icon: 'home' },
  { name: 'Profile', route: '/profile' as RelativePathString, icon: 'heart' },
];

export default function TabLayout() {
  const { isTabBarVisible } = useTabBar();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: { display: 'none' },
          headerShown: false,
        }}
      >
        <Tabs.Screen name='index' />
        <Tabs.Screen name='profile' />
      </Tabs>
      <TabsUI tabs={tabs} hidden={!isTabBarVisible} />
    </>
  );
}
