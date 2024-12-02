import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname, RelativePathString } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const NAVIGATION_BOTTOM_TABS_HEIGHT = 60;

interface TabsHandlerProps {
  tabs: Array<{
    name: string;
    route: RelativePathString;
    icon: React.ComponentProps<typeof FontAwesome>['name'];
  }>;
  tabWidth: number;
}

const TabsHandler: React.FC<TabsHandlerProps> = ({ tabs, tabWidth }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {tabs.map((tab, key) => {
        const active =
          pathname === tab.route || pathname.startsWith(`${tab.route}/`);
        return (
          <TabItem
            key={key}
            active={active}
            tab={tab}
            tabWidth={tabWidth}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
              router.navigate(tab.route);
            }}
          />
        );
      })}
    </View>
  );
};

interface TabItemProps {
  active: boolean;
  tab: {
    name: string;
    route: string;
    icon: React.ComponentProps<typeof FontAwesome>['name'];
  };
  tabWidth: number;
  onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({
  active,
  tab,
  tabWidth,
  onPress,
}) => {
  const fillAnimation = useSharedValue(active ? 1 : 0);

  React.useEffect(() => {
    fillAnimation.value = withTiming(active ? 1 : 0, { duration: 500 });
  }, [active]);

  const animatedFillStyle = useAnimatedStyle(() => {
    return {
      height: `${fillAnimation.value * 100}%`, // This controls the height fill
    };
  });

  return (
    <TouchableOpacity onPress={onPress} style={{ width: tabWidth }}>
      <View style={styles.iconContainer}>
        <View style={styles.iconWrapper}>
          <Animated.View style={[styles.fillBackground, animatedFillStyle]} />
          <FontAwesome
            name={tab.icon}
            size={20}
            color={active ? 'white' : 'black'}
            style={styles.icon}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: NAVIGATION_BOTTOM_TABS_HEIGHT,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: NAVIGATION_BOTTOM_TABS_HEIGHT,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  fillBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000', // Blue water color
    zIndex: 0,
  },
  icon: {
    position: 'absolute',
    zIndex: 1,
  },
});

export default TabsHandler;
