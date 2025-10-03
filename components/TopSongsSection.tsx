
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { SongItem } from '@/components/SongItem';
import { Song } from '@/types/music';
import { useAppTheme } from '@/contexts/ThemeContext';

interface TopSongsSectionProps {
  title: string;
  subtitle: string;
  icon: string;
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onSongPress: (song: Song) => void;
  onViewAll?: () => void;
}

export const TopSongsSection: React.FC<TopSongsSectionProps> = ({
  title,
  subtitle,
  icon,
  songs,
  currentSong,
  isPlaying,
  onSongPress,
  onViewAll,
}) => {
  const { colors } = useAppTheme();

  if (songs.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
            <IconSymbol name={icon} size={20} color="white" />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
          </View>
        </View>
        {onViewAll && songs.length > 3 && (
          <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>Все</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Songs List */}
      <View style={styles.songsList}>
        {songs.slice(0, 5).map((song, index) => (
          <View key={song.id} style={styles.songItemContainer}>
            <View style={styles.rankContainer}>
              <Text style={[styles.rankNumber, { color: colors.primary }]}>
                {index + 1}
              </Text>
            </View>
            <View style={styles.songItemWrapper}>
              <SongItem
                song={song}
                isPlaying={currentSong?.id === song.id && isPlaying}
                onPress={() => onSongPress(song)}
              />
            </View>
            <View style={styles.statsContainer}>
              {song.playCount !== undefined && song.playCount > 0 && (
                <View style={styles.statItem}>
                  <IconSymbol name="play.fill" size={12} color={colors.textSecondary} />
                  <Text style={[styles.statText, { color: colors.textSecondary }]}>
                    {song.playCount}
                  </Text>
                </View>
              )}
              {song.dateAdded && (
                <View style={styles.statItem}>
                  <IconSymbol name="clock" size={12} color={colors.textSecondary} />
                  <Text style={[styles.statText, { color: colors.textSecondary }]}>
                    {formatRelativeTime(song.dateAdded)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return `${days}д`;
  } else if (hours > 0) {
    return `${hours}ч`;
  } else if (minutes > 0) {
    return `${minutes}м`;
  } else {
    return 'сейчас';
  }
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  songsList: {
    gap: 8,
  },
  songItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  rankContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  songItemWrapper: {
    flex: 1,
    marginHorizontal: 0,
  },
  statsContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
    gap: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
