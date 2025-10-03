
export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  uri: string;
  artwork?: string;
  playCount?: number;
  dateAdded?: number; // timestamp
  lastPlayed?: number; // timestamp
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentSong: Song | null;
}

export interface SongStats {
  playCount: number;
  dateAdded: number;
  lastPlayed?: number;
}

export interface TopSongsData {
  recentlyAdded: Song[];
  mostPlayed: Song[];
}
