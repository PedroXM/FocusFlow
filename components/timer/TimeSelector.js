
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const TimeSelector = ({ 
  presetTimes, 
  customTimes, 
  onSelectPreset, 
  onSelectCustom,
  onAddCustom 
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
        Tempo de Foco:
      </Text>
      
      {/* Tempos predefinidos */}
      <View style={styles.timePresets}>
        {presetTimes.map(preset => (
          <TouchableOpacity
            key={preset.id}
            style={[
              styles.timePreset,
              { 
                backgroundColor: preset.selected 
                  ? theme.primary 
                  : theme.card,
                borderColor: theme.border,
                ...theme.shadow
              }
            ]}
            onPress={() => onSelectPreset(preset.id)}
          >
            <Text 
              style={[
                styles.presetText, 
                { color: preset.selected ? '#FFFFFF' : theme.text }
              ]}
            >
              {preset.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Tempos personalizados */}
      {customTimes.length > 0 && (
        <View style={styles.customTimes}>
          {customTimes.map(custom => (
            <TouchableOpacity
              key={custom.id}
              style={[
                styles.timePreset,
                { 
                  backgroundColor: custom.selected 
                    ? theme.primary 
                    : theme.card,
                  borderColor: theme.border,
                  ...theme.shadow
                }
              ]}
              onPress={() => onSelectCustom(custom.id)}
            >
              <Text 
                style={[
                  styles.presetText, 
                  { color: custom.selected ? '#FFFFFF' : theme.text }
                ]}
              >
                {custom.name} ({custom.value}min)
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* Botão para adicionar tempo personalizado */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={onAddCustom}
      >
        <Ionicons 
          name="add-circle-outline" 
          size={16} 
          color={theme.primary} 
        />
        <Text style={[styles.addButtonText, { color: theme.primary }]}>
          Adicionar tempo personalizado
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  timePresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  customTimes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  timePreset: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  presetText: {
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  addButtonText: {
    marginLeft: 4,
    fontSize: 14,
  },
});

export default TimeSelector;