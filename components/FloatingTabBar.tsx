
import React from 'react';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 32,
  borderRadius = 25,
  bottomMargin = 34,
}: FloatingTabBarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  
  const animatedIndex = useSharedValue(0);

  // Find current tab index
  const currentIndex = tabs.findIndex(tab => {
    if (tab.route === '/(tabs)/(home)/') {
      return pathname.startsWith('/(tabs)/(home)') || pathname === '/';
    }
    return pathname.includes(tab.name);
  });

  React.useEffect(() => {
    animatedIndex.value = withSpring(currentIndex >= 0 ? currentIndex : 0);
  }, [currentIndex]);

  const handleTabPress = (route: string) => {
    console.log('Navigating to:', route);
    router.push(route as any);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animatedIndex.value,
      tabs.map((_, index) => index),
      tabs.map((_, index) => (containerWidth / tabs.length) * index)
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <SafeAreaView style={[styles.safeArea, { bottom: bottomMargin }]} edges={['bottom']}>
      <View style={[styles.container, { width: containerWidth, borderRadius }]}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={80} style={[styles.blurContainer, { borderRadius }]}>
            <Animated.View
              style={[
                styles.activeIndicator,
                {
                  width: containerWidth / tabs.length,
                  borderRadius: borderRadius - 4,
                  backgroundColor: colors.primary,
                },
                animatedStyle,
              ]}
            />
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.name}
                style={styles.tabButton}
                onPress={() => handleTabPress(tab.route)}
              >
                <IconSymbol
                  name={tab.icon as any}
                  size={24}
                  color={currentIndex === index ? colors.card : colors.text}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: currentIndex === index ? colors.card : colors.text,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </BlurView>
        ) : (
          <View style={[styles.androidContainer, { borderRadius, backgroundColor: colors.card }]}>
            <Animated.View
              style={[
                styles.activeIndicator,
                {
                  width: containerWidth / tabs.length,
                  borderRadius: borderRadius - 4,
                  backgroundColor: colors.primary,
                },
                animatedStyle,
              ]}
            />
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.name}
                style={styles.tabButton}
                onPress={() => handleTabPress(tab.route)}
              >
                <IconSymbol
                  name={tab.icon as any}
                  size={24}
                  color={currentIndex === index ? colors.card : colors.text}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: currentIndex === index ? colors.card : colors.text,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  container: {
    height: 70,
    overflow: 'hidden',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  blurContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  androidContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.highlight,
  },
  activeIndicator: {
    position: 'absolute',
    height: 54,
    top: 8,
    left: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
