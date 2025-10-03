
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { SongItem } from '@/components/SongItem';
import { MusicPlayerControls } from '@/components/MusicPlayerControls';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { Song } from '@/types/music';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useTheme } from '@react-navigation/native';

// Mock data for demonstration
const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Пример песни 1',
    artist: 'Исполнитель 1',
    album: 'Альбом 1',
    duration: 180000, // 3 minutes
    uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
  {
    id: '2',
    title: 'Пример песни 2',
    artist: 'Исполнитель 2',
    album: 'Альбом 2',
    duration: 240000, // 4 minutes
    uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
  {
    id: '3',
    title: 'Длинное название песни для проверки',
    artist: 'Исполнитель с длинным именем',
    album: 'Альбом с очень длинным названием',
    duration: 210000, // 3.5 minutes
    uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
  {
    id: '4',
    title: 'Классическая музыка',
    artist: 'Композитор',
    album: 'Классика',
    duration: 300000, // 5 minutes
    uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
];

export default function HomeScreen() {
  const theme = useTheme();
  const { playbackState, loadSong, togglePlayPause, seekTo } = useMusicPlayer();
  const [songs] = useState<Song[]>(mockSongs);

  const handleSongPress = async (song: Song) => {
    try {
      console.log('Loading song:', song.title);
      await loadSong(song);
      // Auto-play after loading
      setTimeout(() => {
        togglePlayPause();
      }, 500);
    } catch (error) {
      console.error('Error loading song:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить песню');
    }
  };

  const handleSeek = async (position: number) => {
    try {
      await seekTo(position);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const renderHeaderRight = () => (
    <TouchableOpacity
      onPress={() => Alert.alert('Поиск', 'Функция поиска будет добавлена позже')}
      style={styles.headerButton}
    >
      <IconSymbol name="magnifyingglass" color={colors.primary} size={20} />
    </TouchableOpacity>
  );

  const renderHeaderLeft = () => (
    <TouchableOpacity
      onPress={() => Alert.alert('Настройки', 'Настройки будут добавлены позже')}
      style={styles.headerButton}
    >
      <IconSymbol name="gear" color={colors.primary} size={20} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[commonStyles.container, styles.container]}>
      <Stack.Screen
        options={{
          title: 'Музыкальный плеер',
          headerRight: renderHeaderRight,
          headerLeft: renderHeaderLeft,
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
        {/* Music Player Controls */}
        <MusicPlayerControls
          playbackState={playbackState}
          onPlayPause={togglePlayPause}
          onSeek={handleSeek}
        />

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[commonStyles.title, styles.statNumber]}>{songs.length}</Text>
            <Text style={[commonStyles.textSecondary, styles.statLabel]}>Песен</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[commonStyles.title, styles.statNumber]}>
              {Math.floor(songs.reduce((total, song) => total + song.duration, 0) / 60000)}
            </Text>
            <Text style={[commonStyles.textSecondary, styles.statLabel]}>Минут</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[commonStyles.title, styles.statNumber]}>
              {new Set(songs.map(song => song.artist)).size}
            </Text>
            <Text style={[commonStyles.textSecondary, styles.statLabel]}>Исполнителей</Text>
          </View>
        </View>

        {/* Songs List */}
        <View style={styles.songsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[commonStyles.title, styles.sectionTitle]}>
              Локальные файлы
            </Text>
            <TouchableOpacity
              onPress={() => Alert.alert('Обновить', 'Сканирование файлов будет добавлено позже')}
              style={styles.refreshButton}
            >
              <IconSymbol name="arrow.clockwise" color={colors.primary} size={18} />
            </TouchableOpacity>
          </View>
          
          {songs.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="music.note" color={colors.textSecondary} size={48} />
              <Text style={[commonStyles.text, styles.emptyText]}>
                Музыкальные файлы не найдены
              </Text>
              <Text style={[commonStyles.textSecondary, styles.emptySubtext]}>
                Добавьте музыкальные файлы в приложение
              </Text>
            </View>
          ) : (
            songs.map((song) => (
              <SongItem
                key={song.id}
                song={song}
                isPlaying={playbackState.currentSong?.id === song.id && playbackState.isPlaying}
                onPress={() => handleSongPress(song)}
              />
            ))
          )}
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
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    margin: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  songsSection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.highlight,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
