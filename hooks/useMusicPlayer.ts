
import { useState, useEffect, useCallback } from 'react';
import { musicService } from '@/services/musicService';
import { Song, PlaybackState } from '@/types/music';

export const useMusicPlayer = () => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>(
    musicService.getPlaybackState()
  );

  useEffect(() => {
    const handleStateChange = (state: PlaybackState) => {
      setPlaybackState(state);
    };

    musicService.addListener(handleStateChange);

    return () => {
      musicService.removeListener(handleStateChange);
    };
  }, []);

  const loadSong = useCallback(async (song: Song) => {
    await musicService.loadSong(song);
  }, []);

  const play = useCallback(async () => {
    await musicService.play();
  }, []);

  const pause = useCallback(async () => {
    await musicService.pause();
  }, []);

  const stop = useCallback(async () => {
    await musicService.stop();
  }, []);

  const seekTo = useCallback(async (position: number) => {
    await musicService.seekTo(position);
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (playbackState.isPlaying) {
      await pause();
    } else {
      await play();
    }
  }, [playbackState.isPlaying, play, pause]);

  return {
    playbackState,
    loadSong,
    play,
    pause,
    stop,
    seekTo,
    togglePlayPause,
  };
};
