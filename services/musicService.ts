
import { Audio } from 'expo-av';
import { Song, PlaybackState } from '@/types/music';

class MusicService {
  private sound: Audio.Sound | null = null;
  private currentSong: Song | null = null;
  private playbackState: PlaybackState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    currentSong: null,
  };
  private listeners: ((state: PlaybackState) => void)[] = [];

  constructor() {
    this.setupAudio();
  }

  private async setupAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      console.log('Audio mode set successfully');
    } catch (error) {
      console.error('Failed to set audio mode:', error);
    }
  }

  async loadSong(song: Song) {
    try {
      // Unload previous sound
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      console.log('Loading song:', song.title);
      const { sound } = await Audio.Sound.createAsync(
        { uri: song.uri },
        { shouldPlay: false }
      );

      this.sound = sound;
      this.currentSong = song;

      // Set up playback status update
      this.sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          this.playbackState = {
            isPlaying: status.isPlaying || false,
            currentTime: status.positionMillis || 0,
            duration: status.durationMillis || 0,
            currentSong: this.currentSong,
          };
          this.notifyListeners();
        }
      });

      console.log('Song loaded successfully');
    } catch (error) {
      console.error('Error loading song:', error);
    }
  }

  async play() {
    try {
      if (this.sound) {
        await this.sound.playAsync();
        console.log('Playing song');
      }
    } catch (error) {
      console.error('Error playing song:', error);
    }
  }

  async pause() {
    try {
      if (this.sound) {
        await this.sound.pauseAsync();
        console.log('Paused song');
      }
    } catch (error) {
      console.error('Error pausing song:', error);
    }
  }

  async stop() {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        console.log('Stopped song');
      }
    } catch (error) {
      console.error('Error stopping song:', error);
    }
  }

  async seekTo(position: number) {
    try {
      if (this.sound) {
        await this.sound.setPositionAsync(position);
        console.log('Seeked to position:', position);
      }
    } catch (error) {
      console.error('Error seeking:', error);
    }
  }

  getPlaybackState(): PlaybackState {
    return this.playbackState;
  }

  addListener(listener: (state: PlaybackState) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (state: PlaybackState) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.playbackState));
  }

  async cleanup() {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }
      this.listeners = [];
      console.log('Music service cleaned up');
    } catch (error) {
      console.error('Error cleaning up music service:', error);
    }
  }
}

export const musicService = new MusicService();
