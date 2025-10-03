
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { ThemeSelector } from '@/components/ThemeSelector';
import { useAppTheme } from '@/contexts/ThemeContext';
import { songStatsService } from '@/services/songStatsService';

interface ProfileOption {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  action: () => void;
}

export default function ProfileScreen() {
  const { colors, mode, setMode } = useAppTheme();
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const getThemeDisplayName = (mode: string) => {
    switch (mode) {
      case 'light':
        return 'Светлая';
      case 'dark':
        return 'Темная';
      case 'system':
        return 'Системная';
      default:
        return 'Системная';
    }
  };

  const handleOptionPress = (optionId: string) => {
    console.log('Profile option pressed:', optionId);
  };

  const handleClearStats = () => {
    Alert.alert(
      'Очистить статистику',
      'Это действие удалит всю статистику прослушивания песен. Продолжить?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            try {
              await songStatsService.clearStats();
              Alert.alert('Готово', 'Статистика песен очищена');
            } catch (error) {
              console.error('Error clearing stats:', error);
              Alert.alert('Ошибка', 'Не удалось очистить статистику');
            }
          },
        },
      ]
    );
  };

  const options: ProfileOption[] = [
    {
      id: 'theme',
      title: 'Тема оформления',
      subtitle: getThemeDisplayName(mode),
      icon: 'paintbrush',
      action: () => setShowThemeSelector(true),
    },
    {
      id: 'storage',
      title: 'Управление хранилищем',
      subtitle: 'Очистка кэша и данных',
      icon: 'internaldrive',
      action: () => handleOptionPress('storage'),
    },
    {
      id: 'equalizer',
      title: 'Эквалайзер',
      subtitle: 'Настройка звука',
      icon: 'slider.horizontal.3',
      action: () => handleOptionPress('equalizer'),
    },
    {
      id: 'import',
      title: 'Импорт музыки',
      subtitle: 'Добавить файлы из хранилища',
      icon: 'square.and.arrow.down',
      action: () => handleOptionPress('import'),
    },
    {
      id: 'export',
      title: 'Экспорт плейлистов',
      subtitle: 'Сохранить плейлисты',
      icon: 'square.and.arrow.up',
      action: () => handleOptionPress('export'),
    },
    {
      id: 'clear-stats',
      title: 'Очистить статистику',
      subtitle: 'Сбросить счетчики прослушиваний',
      icon: 'trash',
      action: handleClearStats,
    },
    {
      id: 'about',
      title: 'О приложении',
      subtitle: 'Версия и информация',
      icon: 'info.circle',
      action: () => handleOptionPress('about'),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Профиль',
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
            Локальные файлы
          </Text>
        </View>

        {/* Options List */}
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                { backgroundColor: colors.card, borderColor: colors.border }
              ]}
              onPress={option.action}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIcon, { backgroundColor: colors.highlight }]}>
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

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
            Версия 1.0.0
          </Text>
          <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
            Музыкальный плеер для локальных файлов
          </Text>
        </View>
      </ScrollView>

      {/* Theme Selector Modal */}
      <ThemeSelector
        visible={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />
    </SafeAreaView>
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
  optionsContainer: {
    marginTop: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 14,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  appInfoText: {
    fontSize: 12,
    marginBottom: 4,
  },
});
