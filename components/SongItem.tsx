
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { Song } from '@/types/music';
import { useAppTheme } from '@/contexts/ThemeContext';

interface SongItemProps {
  song: Song;
  isPlaying: boolean;
  onPress: () => void;
  showRank?: boolean;
  rank?: number;
  compact?: boolean;
}

export const SongItem: React.FC<SongItemProps> = ({ 
  song, 
  isPlaying, 
  onPress, 
  showRank = false, 
  rank, 
  compact = false 
}) => {
  const { colors } = useAppTheme();

  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        compact && styles.compactContainer,
        { backgroundColor: colors.card, borderColor: colors.border },
        isPlaying && { backgroundColor: colors.highlight }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Rank Number */}
      {showRank && rank !== undefined && (
        <View style={styles.rankContainer}>
          <Text style={[styles.rankNumber, { color: colors.primary }]}>
            {rank}
          </Text>
        </View>
      )}

      {/* Album Art / Music Icon */}
      <View style={[
        styles.albumArt, 
        compact && styles.compactAlbumArt,
        { backgroundColor: colors.primary }
      ]}>
        <IconSymbol
          name={isPlaying ? 'waveform' : 'music.note'}
          size={compact ? 16 : 20}
          color="white"
        />
      </View>

      {/* Song Info */}
      <View style={styles.songInfo}>
        <Text
          style={[
            styles.title, 
            compact && styles.compactTitle,
            { color: colors.text }
          ]}
          numberOfLines={1}
        >
          {song.title}
        </Text>
        <Text
          style={[
            styles.artist, 
            compact && styles.compactArtist,
            { color: colors.textSecondary }
          ]}
          numberOfLines={1}
        >
          {song.artist}
          {song.album && ` • ${song.album}`}
        </Text>
      </View>

      {/* Duration and Play Status */}
      <View style={styles.rightSection}>
        <Text style={[
          styles.duration, 
          compact && styles.compactDuration,
          { color: colors.textSecondary }
        ]}>
          {formatDuration(song.duration)}
        </Text>
        {isPlaying && (
          <View style={styles.playingIndicator}>
            <IconSymbol 
              name="speaker.wave.2" 
              size={compact ? 14 : 16} 
              color={colors.primary} 
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  compactContainer: {
    padding: 12,
    marginHorizontal: 0,
    marginVertical: 2,
  },
  rankContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  albumArt: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  compactAlbumArt: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  songInfo: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  compactTitle: {
    fontSize: 15,
  },
  artist: {
    fontSize: 14,
  },
  compactArtist: {
    fontSize: 13,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  duration: {
    fontSize: 12,
    marginBottom: 4,
  },
  compactDuration: {
    fontSize: 11,
  },
  playingIndicator: {
    marginTop: 2,
  },
});
