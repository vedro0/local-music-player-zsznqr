
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { SongItem } from '@/components/SongItem';
import { TopSongsSection } from '@/components/TopSongsSection';
import { MusicPlayerControls } from '@/components/MusicPlayerControls';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { Song, TopSongsData } from '@/types/music';
import { useAppTheme } from '@/contexts/ThemeContext';
import { songStatsService } from '@/services/songStatsService';

// Mock data for demonstration - with varied dates and play counts
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
  {
    id: '5',
    title: 'Новая песня',
    artist: 'Новый исполнитель',
    album: 'Новый альбом',
    duration: 195000,
    uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
  {
    id: '6',
    title: 'Популярный хит',
    artist: 'Популярный исполнитель',
    album: 'Хиты',
    duration: 220000,
    uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
];

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { playbackState, loadSong, togglePlayPause, seekTo } = useMusicPlayer();
  const [songs] = useState<Song[]>(mockSongs);
  const [topSongs, setTopSongs] = useState<TopSongsData>({
    recentlyAdded: [],
    mostPlayed: [],
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTopSongs();
  }, [songs]);

  const loadTopSongs = async () => {
    try {
      const topSongsData = await songStatsService.getTopSongs(songs);
      setTopSongs(topSongsData);
      console.log('Top songs loaded:', {
        recentlyAdded: topSongsData.recentlyAdded.length,
        mostPlayed: topSongsData.mostPlayed.length,
      });
    } catch (error) {
      console.error('Error loading top songs:', error);
    }
  };

  const handleSongPress = async (song: Song) => {
    try {
      console.log('Loading song:', song.title);
      await loadSong(song);
      // Auto-play after loading
      setTimeout(() => {
        togglePlayPause();
      }, 500);
      // Refresh top songs after playing to update stats
      setTimeout(() => {
        loadTopSongs();
      }, 1000);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTopSongs();
    setRefreshing(false);
    Alert.alert('Обновлено', 'Статистика песен обновлена');
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
      onPress={() => router.push('/(tabs)/profile')}
      style={styles.headerButton}
    >
      <IconSymbol name="gear" color={colors.primary} size={20} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{songs.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Песен</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {Math.floor(songs.reduce((total, song) => total + song.duration, 0) / 60000)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Минут</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {new Set(songs.map(song => song.artist)).size}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Исполнителей</Text>
          </View>
        </View>

        {/* Top Songs - Recently Added */}
        <TopSongsSection
          title="Недавно добавленные"
          subtitle="Последние добавленные песни"
          icon="clock.badge.plus"
          songs={topSongs.recentlyAdded}
          currentSong={playbackState.currentSong}
          isPlaying={playbackState.isPlaying}
          onSongPress={handleSongPress}
          onViewAll={() => Alert.alert('Все недавние', 'Полный список недавно добавленных песен')}
        />

        {/* Top Songs - Most Played */}
        <TopSongsSection
          title="Самые популярные"
          subtitle="Наиболее прослушиваемые песни"
          icon="chart.bar.fill"
          songs={topSongs.mostPlayed}
          currentSong={playbackState.currentSong}
          isPlaying={playbackState.isPlaying}
          onSongPress={handleSongPress}
          onViewAll={() => Alert.alert('Все популярные', 'Полный список популярных песен')}
        />

        {/* All Songs Section */}
        <View style={styles.songsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Все локальные файлы
            </Text>
            <TouchableOpacity
              onPress={handleRefresh}
              style={[styles.refreshButton, { backgroundColor: colors.highlight }]}
              disabled={refreshing}
            >
              <IconSymbol 
                name={refreshing ? "arrow.clockwise" : "arrow.clockwise"} 
                color={colors.primary} 
                size={18} 
              />
            </TouchableOpacity>
          </View>
          
          {songs.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <IconSymbol name="music.note" color={colors.textSecondary} size={48} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                Музыкальные файлы не найдены
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
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
    flex: 1,
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
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  songsSection: {
    marginTop: 24,
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
    fontWeight: '700',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginHorizontal: 16,
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
