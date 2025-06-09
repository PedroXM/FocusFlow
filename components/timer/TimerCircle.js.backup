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
  color,
  // 🍅 NOVAS PROPS POMODORO
  isPomodoro = false,
  pomodoroStatus = null
}) => {
  const { theme } = useTheme();
  
  // Calcular propriedades do círculo SVG
  const size = 220;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // 🍅 OBTER TEXTO DO MODO BASEADO NO TIPO
  const getModeText = () => {
    if (isPomodoro) {
      switch (mode) {
        case 'focus':
          return 'FOCO 🍅';
        case 'break':
          return 'PAUSA ☕';
        case 'longBreak':
          return 'PAUSA LONGA 🛋️';
        default:
          return 'POMODORO';
      }
    } else {
      return mode === 'focus' ? 'FOCO' : 'DESCANSO';
    }
  };

  // 🍅 OBTER ÍCONE DO BOTÃO BASEADO NO MODO POMODORO
  const getToggleIcon = () => {
    if (isPomodoro && isRunning) {
      // No Pomodoro, quando está rodando, não mostra pause (pois não pode pausar)
      return 'stop';
    }
    return isRunning ? 'pause' : 'play';
  };

  // 🍅 OBTER COR BASEADA NO PROGRESSO (para efeito visual)
  const getProgressColor = () => {
    if (isPomodoro) {
      // Gradiente de cor baseado no progresso para criar urgência
      if (progress > 0.8) return '#FF6B6B'; // Vermelho quando quase acabando
      if (progress > 0.6) return '#FFE66D'; // Amarelo no meio
      return color; // Cor original no início
    }
    return color;
  };

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
            stroke={getProgressColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90, ${size/2}, ${size/2})`}
          />
          
          {/* 🍅 CÍRCULO ADICIONAL PARA POMODORO (efeito visual) */}
          {isPomodoro && progress > 0.9 && (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius - 5}
              stroke="#FF6B6B"
              strokeWidth={2}
              strokeDasharray="5,5"
              fill="none"
              opacity={0.6}
              transform={`rotate(-90, ${size/2}, ${size/2})`}
            />
          )}
        </Svg>
        
        {/* Tempo no centro */}
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, { color: theme.text }]}>{time}</Text>
          <Text style={[styles.modeText, { color: theme.textSecondary }]}>
            {getModeText()}
          </Text>
          
          {/* 🍅 INDICADOR POMODORO ADICIONAL */}
          {isPomodoro && pomodoroStatus && mode === 'focus' && (
            <Text style={[styles.pomodoroIndicator, { color: color }]}>
              {pomodoroStatus.currentPomodoro}/4
            </Text>
          )}
          
          {/* 🍅 AVISO DE PROGRESSO CRÍTICO */}
          {isPomodoro && progress > 0.9 && isRunning && (
            <Text style={[styles.urgentText, { color: '#FF6B6B' }]}>
              QUASE LÁ! 🔥
            </Text>
          )}
        </View>
      </View>
      
      {/* Controles do timer */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[
            styles.controlButton, 
            { 
              backgroundColor: color || theme.primary,
              // 🍅 Estilo diferente para Pomodoro quando rodando
              opacity: isPomodoro && isRunning ? 0.8 : 1
            }
          ]}
          onPress={onToggle}
        >
          <Ionicons 
            name={getToggleIcon()} 
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

      {/* 🍅 DICA POMODORO */}
      {isPomodoro && isRunning && (
        <View style={styles.pomodoroHint}>
          <Text style={[styles.hintText, { color: theme.textSecondary }]}>
            {mode === 'focus' 
              ? '🍅 Mantenha o foco! Elimine distrações.' 
              : '☕ Relaxe e recarregue as energias.'}
          </Text>
        </View>
      )}
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
    fontWeight: '600',
  },
  // 🍅 NOVOS ESTILOS POMODORO
  pomodoroIndicator: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: 'bold',
  },
  urgentText: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pomodoroHint: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  hintText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
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