import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TimerContext = createContext();

export const TimerProvider = ({ children, subjectActions }) => {
  // Acesso às funções do SubjectContext
  const { getSelectedSubject, addSession } = subjectActions || {};

  // 🍅 NOVOS ESTADOS PARA POMODORO
  const [timerMode, setTimerMode] = useState('pomodoro'); // 'pomodoro' ou 'flexible'
  const [pomodoroCount, setPomodoroCount] = useState(0); // Contador de pomodoros no ciclo atual
  const [totalPomodoros, setTotalPomodoros] = useState(0); // Total de pomodoros completados
  const [isInPomodoroMode, setIsInPomodoroMode] = useState(true); // Se está seguindo o ciclo pomodoro

  // Estados principais do timer
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus', 'break', 'longBreak'
  const [remainingTime, setRemainingTime] = useState(1500); // 25 minutos em segundos
  const [selectedTime, setSelectedTime] = useState(25); // Tempo selecionado em minutos
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const timerRef = useRef(null);

  // 🍅 CONFIGURAÇÕES POMODORO CLÁSSICO
  const POMODORO_CONFIG = {
    focusTime: 25,        // 25 minutos de foco
    shortBreak: 5,        // 5 minutos de pausa curta
    longBreak: 15,        // 15 minutos de pausa longa
    cycleLength: 4        // A cada 4 pomodoros = pausa longa
  };

  // Estados para tempos predefinidos e personalizados (modo flexível)
  const [presetTimes, setPresetTimes] = useState([
    { id: 1, name: "15min", value: 15, selected: false },
    { id: 2, name: "25min", value: 25, selected: true },
    { id: 3, name: "30min", value: 30, selected: false },
    { id: 4, name: "45min", value: 45, selected: false },
    { id: 5, name: "60min", value: 60, selected: false }
  ]);

  const [customTimes, setCustomTimes] = useState([]);

  // Carregar dados salvos ao iniciar
  useEffect(() => {
    loadTimerData();
  }, []);

  // Efeito para executar o timer
  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, remainingTime]);

  // Salvar dados automaticamente
  useEffect(() => {
    saveTimerData();
  }, [customTimes, completedSessions, totalPomodoros, pomodoroCount, timerMode]);

  // Carregar dados salvos
  const loadTimerData = async () => {
    try {
      const savedCustomTimes = await AsyncStorage.getItem('customTimes');
      const savedCompletedSessions = await AsyncStorage.getItem('completedSessions');
      const savedTotalPomodoros = await AsyncStorage.getItem('totalPomodoros');
      const savedTimerMode = await AsyncStorage.getItem('timerMode');
      
      if (savedCustomTimes) {
        setCustomTimes(JSON.parse(savedCustomTimes));
      }
      
      if (savedCompletedSessions) {
        setCompletedSessions(parseInt(savedCompletedSessions, 10));
      }

      if (savedTotalPomodoros) {
        setTotalPomodoros(parseInt(savedTotalPomodoros, 10));
      }

      if (savedTimerMode) {
        setTimerMode(savedTimerMode);
        setIsInPomodoroMode(savedTimerMode === 'pomodoro');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do timer:', error);
    }
  };

  // Salvar dados do timer
  const saveTimerData = async () => {
    try {
      await AsyncStorage.setItem('customTimes', JSON.stringify(customTimes));
      await AsyncStorage.setItem('completedSessions', String(completedSessions));
      await AsyncStorage.setItem('totalPomodoros', String(totalPomodoros));
      await AsyncStorage.setItem('timerMode', timerMode);
    } catch (error) {
      console.error('Erro ao salvar dados do timer:', error);
    }
  };

  // 🍅 ALTERNAR ENTRE MODO POMODORO E FLEXÍVEL
  const toggleTimerMode = () => {
    const newMode = timerMode === 'pomodoro' ? 'flexible' : 'pomodoro';
    setTimerMode(newMode);
    setIsInPomodoroMode(newMode === 'pomodoro');
    
    // Reset timer quando mudar de modo
    resetTimer();
    
    if (newMode === 'pomodoro') {
      // Configurar para pomodoro clássico
      setSelectedTime(POMODORO_CONFIG.focusTime);
      setRemainingTime(POMODORO_CONFIG.focusTime * 60);
      setMode('focus');
      setPomodoroCount(0);
    } else {
      // Configurar para modo flexível
      const selectedPreset = presetTimes.find(p => p.selected);
      if (selectedPreset) {
        setSelectedTime(selectedPreset.value);
        setRemainingTime(selectedPreset.value * 60);
      }
    }
    
    console.log(`Modo alterado para: ${newMode === 'pomodoro' ? 'Pomodoro Clássico' : 'Flexível'}`);
  };

  // 🍅 CALCULAR PRÓXIMO TEMPO BASEADO NO MODO
  const getNextTimerSettings = () => {
    if (timerMode === 'pomodoro') {
      if (mode === 'focus') {
        // Completou um pomodoro - verificar se é pausa longa ou curta
        const nextCount = pomodoroCount + 1;
        const isLongBreak = nextCount % POMODORO_CONFIG.cycleLength === 0;
        
        return {
          mode: isLongBreak ? 'longBreak' : 'break',
          time: isLongBreak ? POMODORO_CONFIG.longBreak : POMODORO_CONFIG.shortBreak,
          count: nextCount
        };
      } else {
        // Completou uma pausa - voltar para foco
        return {
          mode: 'focus',
          time: POMODORO_CONFIG.focusTime,
          count: pomodoroCount
        };
      }
    } else {
      // Modo flexível - comportamento original
      if (mode === 'focus') {
        const breakTime = Math.max(Math.round(selectedTime / 5), 5);
        return {
          mode: 'break',
          time: breakTime,
          count: pomodoroCount
        };
      } else {
        return {
          mode: 'focus',
          time: selectedTime,
          count: pomodoroCount
        };
      }
    }
  };

  // Tratar conclusão do timer
  const handleTimerComplete = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);

    const nextSettings = getNextTimerSettings();

    if (mode === 'focus') {
      // Concluiu uma sessão de foco
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      setShowCelebration(true);
      
      // 🍅 ATUALIZAR CONTADOR DE POMODOROS
      if (timerMode === 'pomodoro') {
        const newTotalPomodoros = totalPomodoros + 1;
        setTotalPomodoros(newTotalPomodoros);
        setPomodoroCount(nextSettings.count);
        console.log(`🍅 Pomodoro ${nextSettings.count} completado! Total: ${newTotalPomodoros}`);
      }
      
      // Registrar a sessão completada
      if (getSelectedSubject && addSession) {
        const selectedSubject = getSelectedSubject();
        if (selectedSubject) {
          const duration = timerMode === 'pomodoro' ? POMODORO_CONFIG.focusTime : selectedTime;
          addSession(selectedSubject.id, duration, 'focus', true);
          console.log(`Timer concluído: ${duration} minutos para ${selectedSubject.name}`);
        }
      }
      
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }

    // Configurar próximo timer
    setMode(nextSettings.mode);
    setRemainingTime(nextSettings.time * 60);
    
    // Log do status
    if (timerMode === 'pomodoro') {
      const isLongBreak = nextSettings.mode === 'longBreak';
      const statusMsg = nextSettings.mode === 'focus' 
        ? `Iniciando Pomodoro ${nextSettings.count + 1}`
        : `${isLongBreak ? 'Pausa Longa' : 'Pausa Curta'} (${nextSettings.time}min)`;
      console.log(`🍅 ${statusMsg}`);
    }
  };

  // Iniciar/pausar o timer
  const toggleTimer = () => {
    if (timerMode === 'pomodoro' && isRunning) {
      // 🍅 NO POMODORO CLÁSSICO: NÃO PODE PAUSAR!
      console.log('⚠️ Pomodoro não pode ser pausado! Use Reset para recomeçar.');
      return;
    }
    setIsRunning(!isRunning);
  };

  // Resetar o timer
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    
    if (timerMode === 'pomodoro') {
      // Reset do pomodoro - volta para foco
      setMode('focus');
      setRemainingTime(POMODORO_CONFIG.focusTime * 60);
      setSelectedTime(POMODORO_CONFIG.focusTime);
      console.log('🍅 Pomodoro resetado');
    } else {
      // Reset do modo flexível
      setRemainingTime(selectedTime * 60);
      if (mode === 'break') {
        setMode('focus');
      }
    }
  };

  // 🍅 RESET COMPLETO DO CICLO POMODORO
  const resetPomodoroSession = () => {
    setPomodoroCount(0);
    setMode('focus');
    setRemainingTime(POMODORO_CONFIG.focusTime * 60);
    setSelectedTime(POMODORO_CONFIG.focusTime);
    resetTimer();
    console.log('🍅 Sessão Pomodoro resetada - voltando ao início do ciclo');
  };

  // Selecionar um tempo predefinido (apenas modo flexível)
  const selectPresetTime = (id) => {
    if (isRunning || timerMode === 'pomodoro') return;

    const updatedPresets = presetTimes.map(preset => ({
      ...preset,
      selected: preset.id === id
    }));

    const updatedCustom = customTimes.map(custom => ({
      ...custom,
      selected: false
    }));

    const selected = presetTimes.find(preset => preset.id === id);
    setSelectedTime(selected.value);
    setRemainingTime(selected.value * 60);
    setPresetTimes(updatedPresets);
    setCustomTimes(updatedCustom);
  };

  // Selecionar um tempo personalizado (apenas modo flexível)
  const selectCustomTime = (id) => {
    if (isRunning || timerMode === 'pomodoro') return;

    const updatedCustom = customTimes.map(custom => ({
      ...custom,
      selected: custom.id === id
    }));

    const updatedPresets = presetTimes.map(preset => ({
      ...preset,
      selected: false
    }));

    const selected = customTimes.find(custom => custom.id === id);
    setSelectedTime(selected.value);
    setRemainingTime(selected.value * 60);
    setCustomTimes(updatedCustom);
    setPresetTimes(updatedPresets);
  };

  // Adicionar tempo personalizado (apenas modo flexível)
  const addCustomTime = (name, value) => {
    if (value <= 0 || timerMode === 'pomodoro') return;
    
    const timeName = name.trim() || `${value}min`;
    
    const newId = customTimes.length > 0 
      ? Math.max(...customTimes.map(t => t.id)) + 1 
      : 1;
      
    const newCustomTime = {
      id: newId,
      name: timeName,
      value: parseInt(value),
      selected: false
    };

    setCustomTimes(prev => [...prev, newCustomTime]);
    
    console.log(`Tempo personalizado adicionado: ${timeName}, ${value} minutos`);
  };

  // Remover tempo personalizado
  const removeCustomTime = (id) => {
    const isSelectedTime = customTimes.find(t => t.id === id)?.selected;
    
    setCustomTimes(prev => prev.filter(time => time.id !== id));
    
    if (isSelectedTime && timerMode === 'flexible') {
      selectPresetTime(2); // ID do tempo de 25min
    }
  };

  // Formatador de tempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular progresso para visualização
  const calculateProgress = () => {
    let totalTime;
    
    if (timerMode === 'pomodoro') {
      switch (mode) {
        case 'focus':
          totalTime = POMODORO_CONFIG.focusTime * 60;
          break;
        case 'break':
          totalTime = POMODORO_CONFIG.shortBreak * 60;
          break;
        case 'longBreak':
          totalTime = POMODORO_CONFIG.longBreak * 60;
          break;
        default:
          totalTime = POMODORO_CONFIG.focusTime * 60;
      }
    } else {
      totalTime = mode === 'focus' 
        ? selectedTime * 60 
        : Math.max(Math.round(selectedTime / 5), 5) * 60;
    }
    
    return 1 - (remainingTime / totalTime);
  };

  // 🍅 OBTER STATUS DO POMODORO
  const getPomodoroStatus = () => {
    if (timerMode !== 'pomodoro') return null;
    
    const currentInCycle = (pomodoroCount % POMODORO_CONFIG.cycleLength) || POMODORO_CONFIG.cycleLength;
    const isLastInCycle = currentInCycle === POMODORO_CONFIG.cycleLength;
    
    return {
      currentPomodoro: currentInCycle,
      totalInCycle: POMODORO_CONFIG.cycleLength,
      isLastInCycle,
      completedPomodoros: totalPomodoros,
      nextBreakType: isLastInCycle ? 'longa' : 'curta'
    };
  };

  return (
    <TimerContext.Provider
      value={{
        // Estados originais
        isRunning,
        mode,
        remainingTime,
        selectedTime,
        completedSessions,
        showCelebration,
        presetTimes,
        customTimes,
        
        // 🍅 NOVOS ESTADOS POMODORO
        timerMode,
        isInPomodoroMode,
        pomodoroCount,
        totalPomodoros,
        POMODORO_CONFIG,
        
        // Funções originais
        toggleTimer,
        resetTimer,
        selectPresetTime,
        selectCustomTime,
        addCustomTime,
        removeCustomTime,
        formatTime,
        calculateProgress,
        
        // 🍅 NOVAS FUNÇÕES POMODORO
        toggleTimerMode,
        resetPomodoroSession,
        getPomodoroStatus
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer deve ser usado dentro de um TimerProvider');
  }
  return context;
};

export default TimerContext;