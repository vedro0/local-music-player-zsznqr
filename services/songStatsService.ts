
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song, SongStats } from '@/types/music';

const SONG_STATS_KEY = 'song_stats';
const RECENTLY_ADDED_LIMIT = 10;
const MOST_PLAYED_LIMIT = 10;

class SongStatsService {
  private stats: Record<string, SongStats> = {};
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    try {
      const stored = await AsyncStorage.getItem(SONG_STATS_KEY);
      if (stored) {
        this.stats = JSON.parse(stored);
      }
      this.initialized = true;
      console.log('Song stats service initialized');
    } catch (error) {
      console.error('Error initializing song stats service:', error);
    }
  }

  async addSong(song: Song) {
    await this.initialize();
    
    if (!this.stats[song.id]) {
      this.stats[song.id] = {
        playCount: 0,
        dateAdded: Date.now(),
      };
      await this.saveStats();
      console.log('Added new song to stats:', song.title);
    }
  }

  async incrementPlayCount(songId: string) {
    await this.initialize();
    
    if (this.stats[songId]) {
      this.stats[songId].playCount += 1;
      this.stats[songId].lastPlayed = Date.now();
      await this.saveStats();
      console.log('Incremented play count for song:', songId);
    }
  }

  async getTopSongs(songs: Song[]) {
    await this.initialize();
    
    // Ensure all songs have stats
    for (const song of songs) {
      await this.addSong(song);
    }

    // Add stats to songs
    const songsWithStats = songs.map(song => ({
      ...song,
      playCount: this.stats[song.id]?.playCount || 0,
      dateAdded: this.stats[song.id]?.dateAdded || Date.now(),
      lastPlayed: this.stats[song.id]?.lastPlayed,
    }));

    // Get recently added songs (sorted by date added, descending)
    const recentlyAdded = [...songsWithStats]
      .sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0))
      .slice(0, RECENTLY_ADDED_LIMIT);

    // Get most played songs (sorted by play count, descending)
    const mostPlayed = [...songsWithStats]
      .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
      .slice(0, MOST_PLAYED_LIMIT);

    return {
      recentlyAdded,
      mostPlayed,
    };
  }

  async getSongStats(songId: string): Promise<SongStats | null> {
    await this.initialize();
    return this.stats[songId] || null;
  }

  private async saveStats() {
    try {
      await AsyncStorage.setItem(SONG_STATS_KEY, JSON.stringify(this.stats));
    } catch (error) {
      console.error('Error saving song stats:', error);
    }
  }

  async clearStats() {
    this.stats = {};
    await AsyncStorage.removeItem(SONG_STATS_KEY);
    console.log('Song stats cleared');
  }
}

export const songStatsService = new SongStatsService();
