import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import TabsUI from '@/components/TabsUi';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTabBar } from '@/contexts/TabBarProvider';

const tabs = [
  { name: 'Feed', route: '/', icon: 'home' },
  { name: 'Profile', route: '/profile', icon: 'save' },
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
