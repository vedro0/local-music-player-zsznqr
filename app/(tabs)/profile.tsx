
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { ThemeSelector } from '@/components/ThemeSelector';
import { useAppTheme } from '@/contexts/ThemeContext';

interface ProfileOption {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  action: () => void;
}

export default function ProfileScreen() {
  const { colors, themeMode } = useAppTheme();
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const getThemeDisplayName = (mode: string) => {
    switch (mode) {
      case 'light': return 'Светлая';
      case 'dark': return 'Темная';
      case 'system': return 'Системная';
      default: return 'Системная';
    }
  };

  const profileOptions: ProfileOption[] = [
    {
      id: 'theme',
      title: 'Тема оформления',
      subtitle: getThemeDisplayName(themeMode),
      icon: 'paintbrush',
      action: () => setShowThemeSelector(true),
    },
    {
      id: 'music-library',
      title: 'Музыкальная библиотека',
      subtitle: 'Управление локальными файлами',
      icon: 'music.note.list',
      action: () => Alert.alert('Библиотека', 'Настройки библиотеки будут добавлены позже'),
    },
    {
      id: 'audio-quality',
      title: 'Качество звука',
      subtitle: 'Настройки воспроизведения',
      icon: 'waveform',
      action: () => Alert.alert('Качество звука', 'Настройки качества будут добавлены позже'),
    },
    {
      id: 'equalizer',
      title: 'Эквалайзер',
      subtitle: 'Настройка звучания',
      icon: 'slider.horizontal.3',
      action: () => Alert.alert('Эквалайзер', 'Эквалайзер будет добавлен позже'),
    },
    {
      id: 'storage',
      title: 'Хранилище',
      subtitle: 'Управление кэшем и файлами',
      icon: 'internaldrive',
      action: () => Alert.alert('Хранилище', 'Настройки хранилища будут добавлены позже'),
    },
    {
      id: 'about',
      title: 'О приложении',
      subtitle: 'Версия и информация',
      icon: 'info.circle',
      action: () => Alert.alert('О приложении', 'Музыкальный плеер v1.0\nСоздано с помощью React Native'),
    },
  ];

  const handleOptionPress = (optionId: string) => {
    const option = profileOptions.find(opt => opt.id === optionId);
    if (option) {
      option.action();
    }
  };

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen
          options={{
            title: 'Настройки',
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }}
        />
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
            <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
              <IconSymbol name="person.fill" size={32} color="white" />
            </View>
            <Text style={[styles.profileName, { color: colors.text }]}>
              Музыкальный плеер
            </Text>
            <Text style={[styles.profileSubtitle, { color: colors.textSecondary }]}>
              Локальные аудиофайлы
            </Text>
          </View>

          {/* Settings Options */}
          <View style={styles.optionsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Настройки
            </Text>
            
            <View style={[styles.optionsContainer, { backgroundColor: colors.card }]}>
              {profileOptions.map((option, index) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionItem,
                    { borderBottomColor: colors.border },
                    index === profileOptions.length - 1 && styles.lastOptionItem,
                  ]}
                  onPress={() => handleOptionPress(option.id)}
                >
                  <View style={[styles.optionIconContainer, { backgroundColor: colors.highlight }]}>
                    <IconSymbol name={option.icon} size={20} color={colors.primary} />
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={[styles.optionTitle, { color: colors.text }]}>
                      {option.title}
                    </Text>
                    {option.subtitle && (
                      <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                        {option.subtitle}
                      </Text>
                    )}
                  </View>
                  <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* App Info */}
          <View style={styles.appInfoSection}>
            <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
              Версия 1.0.0
            </Text>
            <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
              Создано с помощью React Native
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Theme Selector Modal */}
      <ThemeSelector
        visible={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra space for floating tab bar
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    margin: 16,
    borderRadius: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 16,
  },
  optionsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  optionsContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lastOptionItem: {
    borderBottomWidth: 0,
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
  },
  appInfoSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  appInfoText: {
    fontSize: 12,
    marginBottom: 4,
  },
});
