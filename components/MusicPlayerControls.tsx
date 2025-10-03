
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Slider } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { PlaybackState } from '@/types/music';

interface MusicPlayerControlsProps {
  playbackState: PlaybackState;
  onPlayPause: () => void;
  onSeek: (position: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

export const MusicPlayerControls: React.FC<MusicPlayerControlsProps> = ({
  playbackState,
  onPlayPause,
  onSeek,
  onPrevious,
  onNext,
}) => {
  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const { currentSong, isPlaying, currentTime, duration } = playbackState;

  if (!currentSong) {
    return (
      <View style={styles.container}>
        <Text style={[commonStyles.textSecondary, styles.noSongText]}>
          Выберите песню для воспроизведения
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Song Info */}
      <View style={styles.songInfo}>
        <Text style={[commonStyles.subtitle, styles.songTitle]} numberOfLines={1}>
          {currentSong.title}
        </Text>
        <Text style={[commonStyles.textSecondary, styles.songArtist]} numberOfLines={1}>
          {currentSong.artist}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={[commonStyles.textSecondary, styles.timeText]}>
          {formatTime(currentTime)}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onSlidingComplete={onSeek}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.highlight}
          thumbTintColor={colors.primary}
        />
        <Text style={[commonStyles.textSecondary, styles.timeText]}>
          {formatTime(duration)}
        </Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[commonStyles.iconButton, styles.controlButton]}
          onPress={onPrevious}
          disabled={!onPrevious}
        >
          <IconSymbol
            name="backward.fill"
            size={24}
            color={onPrevious ? colors.card : colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[commonStyles.playButton, styles.playButton]}
          onPress={onPlayPause}
        >
          <IconSymbol
            name={isPlaying ? 'pause.fill' : 'play.fill'}
            size={32}
            color={colors.card}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[commonStyles.iconButton, styles.controlButton]}
          onPress={onNext}
          disabled={!onNext}
        >
          <IconSymbol
            name="forward.fill"
            size={24}
            color={onNext ? colors.card : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 6,
  },
  noSongText: {
    textAlign: 'center',
    fontSize: 16,
    padding: 20,
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  songTitle: {
    textAlign: 'center',
    marginBottom: 4,
  },
  songArtist: {
    textAlign: 'center',
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  slider: {
    flex: 1,
    marginHorizontal: 12,
    height: 40,
  },
  timeText: {
    fontSize: 12,
    minWidth: 40,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    marginHorizontal: 20,
    backgroundColor: colors.textSecondary,
  },
  playButton: {
    marginHorizontal: 20,
  },
});
