
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { Song } from '@/types/music';
import { colors, commonStyles } from '@/styles/commonStyles';

interface SongItemProps {
  song: Song;
  isPlaying: boolean;
  onPress: () => void;
}

export const SongItem: React.FC<SongItemProps> = ({ song, isPlaying, onPress }) => {
  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <IconSymbol
          name={isPlaying ? 'speaker.wave.2.fill' : 'music.note'}
          size={24}
          color={isPlaying ? colors.primary : colors.textSecondary}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={[commonStyles.subtitle, styles.title]} numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={[commonStyles.textSecondary, styles.artist]} numberOfLines={1}>
          {song.artist}
        </Text>
        {song.album && (
          <Text style={[commonStyles.textSecondary, styles.album]} numberOfLines={1}>
            {song.album}
          </Text>
        )}
      </View>
      
      <View style={styles.rightSection}>
        <Text style={[commonStyles.textSecondary, styles.duration]}>
          {formatDuration(song.duration)}
        </Text>
        {isPlaying && (
          <View style={styles.playingIndicator}>
            <IconSymbol name='play.fill' size={16} color={colors.primary} />
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
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    marginBottom: 2,
  },
  artist: {
    fontSize: 13,
    marginBottom: 2,
  },
  album: {
    fontSize: 12,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  duration: {
    fontSize: 12,
    marginBottom: 4,
  },
  playingIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
