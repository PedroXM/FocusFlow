

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../contexts/ThemeContext';


const TimerCircle = ({ 
  time, 
  progress, 
  isRunning, 
  mode, 
  onToggle, 
  onReset,
  color 
}) => {
  const { theme } = useTheme();
  
  // Calcular propriedades do círculo SVG
  const size = 220;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        {/* SVG para círculo de progresso */}
        <Svg width={size} height={size}>
          {/* Círculo de fundo */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Círculo de progresso */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color || theme.primary}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90, ${size/2}, ${size/2})`}
          />
        </Svg>
        
        {/* Tempo no centro */}
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, { color: theme.text }]}>{time}</Text>
          <Text style={[styles.modeText, { color: theme.textSecondary }]}>
            {mode === 'focus' ? 'FOCO' : 'DESCANSO'}
          </Text>
        </View>
      </View>
      
      {/* Controles do timer */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: color || theme.primary }]}
          onPress={onToggle}
        >
          <Ionicons 
            name={isRunning ? 'pause' : 'play'} 
            size={28} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, { backgroundColor: theme.textSecondary + '20' }]}
          onPress={onReset}
        >
          <Ionicons 
            name="refresh" 
            size={24} 
            color={theme.textSecondary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  timerContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  modeText: {
    fontSize: 14,
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default TimerCircle;