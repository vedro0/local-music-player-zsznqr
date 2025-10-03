
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Slider } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { PlaybackState } from '@/types/music';
import { SongMenu } from '@/components/SongMenu';
import { useAppTheme } from '@/contexts/ThemeContext';

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
  const { colors } = useAppTheme();
  const [showSongMenu, setShowSongMenu] = useState(false);

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const { currentSong, isPlaying, currentTime, duration } = playbackState;

  if (!currentSong) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.noSongText, { color: colors.textSecondary }]}>
          Выберите песню для воспроизведения
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        {/* Song Info with Menu Button */}
        <View style={styles.songInfoContainer}>
          <View style={styles.songInfo}>
            <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
              {currentSong.title}
            </Text>
            <Text style={[styles.songArtist, { color: colors.textSecondary }]} numberOfLines={1}>
              {currentSong.artist}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.menuButton, { backgroundColor: colors.highlight }]}
            onPress={() => setShowSongMenu(true)}
          >
            <IconSymbol name="ellipsis" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
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
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {formatTime(duration)}
          </Text>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              { backgroundColor: onPrevious ? colors.primary : colors.highlight }
            ]}
            onPress={onPrevious}
            disabled={!onPrevious}
          >
            <IconSymbol
              name="backward.fill"
              size={24}
              color={onPrevious ? 'white' : colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: colors.primary }]}
            onPress={onPlayPause}
          >
            <IconSymbol
              name={isPlaying ? 'pause.fill' : 'play.fill'}
              size={32}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              { backgroundColor: onNext ? colors.primary : colors.highlight }
            ]}
            onPress={onNext}
            disabled={!onNext}
          >
            <IconSymbol
              name="forward.fill"
              size={24}
              color={onNext ? 'white' : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Song Menu Modal */}
      <SongMenu
        song={currentSong}
        visible={showSongMenu}
        onClose={() => setShowSongMenu(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
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
  songInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  songInfo: {
    flex: 1,
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
    textAlign: 'center',
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
});
