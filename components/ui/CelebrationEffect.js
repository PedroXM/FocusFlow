
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const CelebrationEffect = ({ selectedTime, onClose }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.celebrationOverlay}>
      <View style={[
        styles.celebrationCard, 
        { 
          backgroundColor: theme.card,
          ...theme.shadow
        }
      ]}>
        <View style={[
          styles.celebrationIcon, 
          { backgroundColor: theme.primary + '20' }
        ]}>
          <Ionicons 
            name="checkmark-circle" 
            size={40} 
            color={theme.primary} 
          />
        </View>
        <Text style={[styles.celebrationTitle, { color: theme.text }]}>
          Parabéns!
        </Text>
        <Text style={[styles.celebrationText, { color: theme.textSecondary }]}>
          Você completou uma sessão de {selectedTime} minutos.
        </Text>
        
        <View style={styles.celebrationStars}>
          {[...Array(5)].map((_, index) => (
            <Ionicons 
              key={index}
              name="star" 
              size={20} 
              color={theme.accent}
              style={{ marginHorizontal: 4 }}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  celebrationCard: {
    width: '80%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  celebrationIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  celebrationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  celebrationStars: {
    flexDirection: 'row',
    marginTop: 8,
  }
});

export default CelebrationEffect;