
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function ProfileScreen() {
  const profileOptions = [
    {
      id: 'library',
      title: 'Моя библиотека',
      description: 'Управление музыкальной коллекцией',
      icon: 'music.note.list',
      color: colors.primary,
    },
    {
      id: 'playlists',
      title: 'Плейлисты',
      description: 'Создание и редактирование плейлистов',
      icon: 'music.note',
      color: colors.secondary,
    },
    {
      id: 'equalizer',
      title: 'Эквалайзер',
      description: 'Настройка звука',
      icon: 'slider.horizontal.3',
      color: colors.accent,
    },
    {
      id: 'settings',
      title: 'Настройки',
      description: 'Общие настройки приложения',
      icon: 'gear',
      color: colors.textSecondary,
    },
    {
      id: 'about',
      title: 'О приложении',
      description: 'Информация о версии и разработчике',
      icon: 'info.circle',
      color: colors.primary,
    },
  ];

  const handleOptionPress = (optionId: string) => {
    switch (optionId) {
      case 'library':
        Alert.alert('Библиотека', 'Функция управления библиотекой будет добавлена позже');
        break;
      case 'playlists':
        Alert.alert('Плейлисты', 'Функция плейлистов будет добавлена позже');
        break;
      case 'equalizer':
        Alert.alert('Эквалайзер', 'Функция эквалайзера будет добавлена позже');
        break;
      case 'settings':
        Alert.alert('Настройки', 'Настройки будут добавлены позже');
        break;
      case 'about':
        Alert.alert(
          'О приложении',
          'Музыкальный плеер для локальных файлов\nВерсия 1.0.0\n\nСоздано с помощью React Native и Expo'
        );
        break;
      default:
        console.log('Unknown option:', optionId);
    }
  };

  return (
    <SafeAreaView style={[commonStyles.container, styles.container]}>
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
        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.fill" size={48} color={colors.card} />
          </View>
          <Text style={[commonStyles.title, styles.userName]}>Пользователь</Text>
          <Text style={[commonStyles.textSecondary, styles.userEmail]}>
            user@example.com
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[commonStyles.title, styles.statNumber]}>42</Text>
            <Text style={[commonStyles.textSecondary, styles.statLabel]}>Песен</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[commonStyles.title, styles.statNumber]}>3</Text>
            <Text style={[commonStyles.textSecondary, styles.statLabel]}>Плейлистов</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[commonStyles.title, styles.statNumber]}>12</Text>
            <Text style={[commonStyles.textSecondary, styles.statLabel]}>Исполнителей</Text>
          </View>
        </View>

        {/* Options Section */}
        <View style={styles.optionsSection}>
          <Text style={[commonStyles.title, styles.sectionTitle]}>Настройки</Text>
          
          {profileOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={() => handleOptionPress(option.id)}
            >
              <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                <IconSymbol name={option.icon as any} size={24} color={colors.card} />
              </View>
              <View style={styles.optionContent}>
                <Text style={[commonStyles.subtitle, styles.optionTitle]}>
                  {option.title}
                </Text>
                <Text style={[commonStyles.textSecondary, styles.optionDescription]}>
                  {option.description}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra space for floating tab bar
  },
  userSection: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    margin: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  optionsSection: {
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
  },
});
