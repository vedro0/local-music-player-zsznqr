
import { useState, useEffect, useCallback } from 'react';
import { Song, TopSongsData } from '@/types/music';
import { songStatsService } from '@/services/songStatsService';

export const useTopSongs = (songs: Song[]) => {
  const [topSongs, setTopSongs] = useState<TopSongsData>({
    recentlyAdded: [],
    mostPlayed: [],
  });
  const [loading, setLoading] = useState(false);

  const loadTopSongs = useCallback(async () => {
    if (songs.length === 0) return;
    
    setLoading(true);
    try {
      const topSongsData = await songStatsService.getTopSongs(songs);
      setTopSongs(topSongsData);
      console.log('Top songs loaded:', {
        recentlyAdded: topSongsData.recentlyAdded.length,
        mostPlayed: topSongsData.mostPlayed.length,
      });
    } catch (error) {
      console.error('Error loading top songs:', error);
    } finally {
      setLoading(false);
    }
  }, [songs]);

  const refreshTopSongs = useCallback(async () => {
    await loadTopSongs();
  }, [loadTopSongs]);

  useEffect(() => {
    loadTopSongs();
  }, [loadTopSongs]);

  return {
    topSongs,
    loading,
    refreshTopSongs,
  };
};
