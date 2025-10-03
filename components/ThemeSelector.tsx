
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/IconSymbol';
import { useAppTheme, ThemeMode } from '@/contexts/ThemeContext';

interface ThemeSelectorProps {
  visible: boolean;
  onClose: () => void;
}

interface ThemeOption {
  mode: ThemeMode;
  title: string;
  subtitle: string;
  icon: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ visible, onClose }) => {
  const { colors, isDark, themeMode, setThemeMode } = useAppTheme();

  const themeOptions: ThemeOption[] = [
    {
      mode: 'light',
      title: 'Светлая тема',
      subtitle: 'Всегда использовать светлую тему',
      icon: 'sun.max',
    },
    {
      mode: 'dark',
      title: 'Темная тема',
      subtitle: 'Всегда использовать темную тему',
      icon: 'moon',
    },
    {
      mode: 'system',
      title: 'Системная',
      subtitle: 'Следовать настройкам системы',
      icon: 'gear',
    },
  ];

  const handleThemeSelect = (mode: ThemeMode) => {
    setThemeMode(mode);
    onClose();
  };

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
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                Выбор темы
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Выберите предпочитаемую тему оформления
              </Text>
            </View>

            {/* Theme Options */}
            <View style={styles.optionsContainer}>
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.mode}
                  style={[
                    styles.optionItem,
                    { borderBottomColor: colors.border },
                    themeMode === option.mode && { backgroundColor: colors.highlight },
                  ]}
                  onPress={() => handleThemeSelect(option.mode)}
                >
                  <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
                    <IconSymbol name={option.icon} size={20} color="white" />
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={[styles.optionTitle, { color: colors.text }]}>
                      {option.title}
                    </Text>
                    <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                      {option.subtitle}
                    </Text>
                  </View>
                  {themeMode === option.mode && (
                    <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.highlight }]}
              onPress={onClose}
            >
              <Text style={[styles.closeButtonText, { color: colors.text }]}>
                Готово
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
  },
  header: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
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
