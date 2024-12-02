import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAnimatedStyle } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTabBar } from '@/contexts/TabBarProvider';
import TabsHandler from './TabsHandler';

const wWidth = Dimensions.get('window').width;
const NAVIGATION_BOTTOM_TABS_HEIGHT = 60;

interface TabsUIProps {
  tabs: Array<{
    name: string;
    route: string;
    icon: React.ComponentProps<typeof FontAwesome>['name'];
  }>;
  hidden?: boolean;
}

const TabsUI: React.FC<TabsUIProps> = ({ tabs, hidden = false }) => {
  const tabWidth = useMemo(() => wWidth / 5, [5]);

  const { opacity } = useTabBar();

  // Animated style for opacity
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value, // Bind the opacity value from sharedValue
    };
  });

  if (hidden) {
    return null;
  }
  return (
    <Animated.View
      style={[
        {
          height: NAVIGATION_BOTTOM_TABS_HEIGHT,
          width: wWidth,
          position: 'absolute',
          bottom: 30,
          alignItems: 'center',
          justifyContent: 'center',
        },
        animatedStyle,
      ]}
    >
      {/* Outer wrapper for shadow */}
      <View style={styles.shadowWrapper}>
        <BlurView
          intensity={50}
          tint='systemMaterialLight'
          style={[
            {
              overflow: 'hidden',
              width: wWidth * 0.7,
              borderRadius: 8,
            },
          ]}
        >
          <TabsHandler tabs={tabs} tabWidth={tabWidth} />
        </BlurView>
      </View>
    </Animated.View>
  );
};

export default TabsUI;

const styles = StyleSheet.create({
  shadowWrapper: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
});
