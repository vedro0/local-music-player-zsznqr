
export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  uri: string;
  artwork?: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentSong: Song | null;
}
