
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Share,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/IconSymbol';
import { Song } from '@/types/music';
import { useAppTheme } from '@/contexts/ThemeContext';

interface SongMenuProps {
  song: Song | null;
  visible: boolean;
  onClose: () => void;
}

interface MenuOption {
  id: string;
  title: string;
  icon: string;
  action: (song: Song) => void;
}

export const SongMenu: React.FC<SongMenuProps> = ({ song, visible, onClose }) => {
  const { colors, isDark } = useAppTheme();

  const menuOptions: MenuOption[] = [
    {
      id: 'add-to-playlist',
      title: 'Добавить в плейлист',
      icon: 'plus.circle',
      action: (song) => {
        Alert.alert('Плейлист', `Добавить "${song.title}" в плейлист`);
        onClose();
      },
    },
    {
      id: 'view-artist',
      title: 'Показать исполнителя',
      icon: 'person.circle',
      action: (song) => {
        Alert.alert('Исполнитель', `Показать все песни: ${song.artist}`);
        onClose();
      },
    },
    {
      id: 'view-album',
      title: 'Показать альбом',
      icon: 'opticaldisc',
      action: (song) => {
        Alert.alert('Альбом', `Показать альбом: ${song.album || 'Неизвестный альбом'}`);
        onClose();
      },
    },
    {
      id: 'share',
      title: 'Поделиться',
      icon: 'square.and.arrow.up',
      action: async (song) => {
        try {
          await Share.share({
            message: `Слушаю: ${song.title} - ${song.artist}`,
            title: 'Поделиться песней',
          });
        } catch (error) {
          console.log('Error sharing:', error);
        }
        onClose();
      },
    },
    {
      id: 'info',
      title: 'Информация о файле',
      icon: 'info.circle',
      action: (song) => {
        const duration = Math.floor(song.duration / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        Alert.alert(
          'Информация о файле',
          `Название: ${song.title}\nИсполнитель: ${song.artist}\nАльбом: ${song.album || 'Неизвестно'}\nДлительность: ${minutes}:${seconds.toString().padStart(2, '0')}`
        );
        onClose();
      },
    },
  ];

  if (!song) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <BlurView
          intensity={isDark ? 50 : 80}
          tint={isDark ? 'dark' : 'light'}
          style={styles.blurContainer}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.menuContainer, { backgroundColor: colors.card }]}
            onPress={() => {}} // Prevent closing when tapping inside menu
          >
            {/* Song Info Header */}
            <View style={styles.songHeader}>
              <View style={[styles.albumArt, { backgroundColor: colors.highlight }]}>
                <IconSymbol name="music.note" size={24} color={colors.textSecondary} />
              </View>
              <View style={styles.songInfo}>
                <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
                  {song.title}
                </Text>
                <Text style={[styles.songArtist, { color: colors.textSecondary }]} numberOfLines={1}>
                  {song.artist}
                </Text>
              </View>
            </View>

            {/* Menu Options */}
            <View style={styles.optionsContainer}>
              {menuOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.optionItem, { borderBottomColor: colors.border }]}
                  onPress={() => option.action(song)}
                >
                  <IconSymbol name={option.icon} size={20} color={colors.primary} />
                  <Text style={[styles.optionText, { color: colors.text }]}>
                    {option.title}
                  </Text>
                  <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.highlight }]}
              onPress={onClose}
            >
              <Text style={[styles.closeButtonText, { color: colors.text }]}>
                Закрыть
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </BlurView>
      </TouchableOpacity>
    </Modal>
  );
};

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  blurContainer: {
    width: screenWidth - 40,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuContainer: {
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  songHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 14,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  closeButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
