
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { useAppTheme } from '@/contexts/ThemeContext';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

export interface TabBarItem {
  name: string;
  title: string;
  icon: string;
  route: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 40,
  borderRadius = 25,
  bottomMargin = 20,
}: FloatingTabBarProps) {
  const { colors, isDark } = useAppTheme();
  const router = useRouter();
  const pathname = usePathname();
  
  const activeIndex = useSharedValue(0);

  // Find current active tab index
  React.useEffect(() => {
    const currentIndex = tabs.findIndex(tab => pathname.includes(tab.route));
    if (currentIndex !== -1) {
      activeIndex.value = withSpring(currentIndex);
    }
  }, [pathname, tabs]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      activeIndex.value,
      [0, tabs.length - 1],
      [0, containerWidth - (containerWidth / tabs.length)]
    );

    return {
      transform: [{ translateX }],
    };
  });

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { marginBottom: bottomMargin }]} edges={['bottom']}>
      <View style={[styles.container, { width: containerWidth }]}>
        <BlurView
          intensity={isDark ? 50 : 80}
          tint={isDark ? 'dark' : 'light'}
          style={[styles.blurContainer, { borderRadius }]}
        >
          <View style={[styles.tabBar, { backgroundColor: colors.card + '90' }]}>
            {/* Animated Background Indicator */}
            <Animated.View
              style={[
                styles.activeIndicator,
                {
                  width: containerWidth / tabs.length,
                  backgroundColor: colors.primary + '20',
                  borderRadius: borderRadius - 4,
                },
                animatedStyle,
              ]}
            />
            
            {/* Tab Items */}
            {tabs.map((tab, index) => {
              const isActive = pathname.includes(tab.route);
              
              return (
                <TouchableOpacity
                  key={tab.name}
                  style={[styles.tabItem, { width: containerWidth / tabs.length }]}
                  onPress={() => handleTabPress(tab.route)}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    name={tab.icon}
                    size={24}
                    color={isActive ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.tabLabel,
                      {
                        color: isActive ? colors.primary : colors.textSecondary,
                        fontWeight: isActive ? '600' : '400',
                      },
                    ]}
                  >
                    {tab.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    alignItems: 'center',
  },
  blurContainer: {
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    height: '80%',
    top: '10%',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
});
