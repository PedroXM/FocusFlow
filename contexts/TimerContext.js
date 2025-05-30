
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TimerContext = createContext();

export const TimerProvider = ({ children, subjectActions }) => {
  // Acesso às funções do SubjectContext
  const { getSelectedSubject, addSession } = subjectActions || {};

  // Estados principais do timer
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' ou 'break'
  const [remainingTime, setRemainingTime] = useState(1500); // 25 minutos em segundos
  const [selectedTime, setSelectedTime] = useState(25); // Tempo selecionado em minutos
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const timerRef = useRef(null);

  // Estados para tempos predefinidos e personalizados
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

  // Carregar dados salvos
  const loadTimerData = async () => {
    try {
      const savedCustomTimes = await AsyncStorage.getItem('customTimes');
      const savedCompletedSessions = await AsyncStorage.getItem('completedSessions');
      
      if (savedCustomTimes) {
        setCustomTimes(JSON.parse(savedCustomTimes));
      }
      
      if (savedCompletedSessions) {
        setCompletedSessions(parseInt(savedCompletedSessions, 10));
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
    } catch (error) {
      console.error('Erro ao salvar dados do timer:', error);
    }
  };

  // Tratar conclusão do timer - CORRIGIDO
  const handleTimerComplete = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);

    if (mode === 'focus') {
      // Concluiu uma sessão de foco
      const newCount = completedSessions + 1;
      setCompletedSessions(newCount);
      setShowCelebration(true);
      
      // Registrar a sessão completada se SubjectContext estiver disponível
      if (getSelectedSubject && addSession) {
        const selectedSubject = getSelectedSubject();
        if (selectedSubject) {
          // Importante: Registrar com o tempo originalmente selecionado
          addSession(selectedSubject.id, selectedTime, 'focus', true);
          console.log(`Timer concluído: ${selectedTime} minutos para ${selectedSubject.name}`);
        }
      }
      
      // Mudar para modo de pausa
      setMode('break');
      // Definir tempo de pausa como 1/5 do tempo de foco, com mínimo de 5 minutos
      const breakTime = Math.max(Math.round(selectedTime / 5), 5);
      setRemainingTime(breakTime * 60);
      
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    } else {
      // Concluiu uma pausa
      setMode('focus');
      setRemainingTime(selectedTime * 60);
    }

    // Salvar dados atualizados
    saveTimerData();
  };

  // Iniciar/pausar o timer
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Resetar o timer
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setRemainingTime(selectedTime * 60);
    
    // Se estiver no modo de pausa, voltar para o modo de foco
    if (mode === 'break') {
      setMode('focus');
    }
  };

  // Selecionar um tempo predefinido
  const selectPresetTime = (id) => {
    if (isRunning) return; // Não permitir mudanças durante o timer

    const updatedPresets = presetTimes.map(preset => ({
      ...preset,
      selected: preset.id === id
    }));

    // Desmarcar tempos personalizados
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

  // Selecionar um tempo personalizado
  const selectCustomTime = (id) => {
    if (isRunning) return; // Não permitir mudanças durante o timer

    const updatedCustom = customTimes.map(custom => ({
      ...custom,
      selected: custom.id === id
    }));

    // Desmarcar tempos predefinidos
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

  // Adicionar tempo personalizado - CORRIGIDO
  const addCustomTime = (name, value) => {
    // Validar entrada
    if (value <= 0) return;
    
    // Se não houver nome, usar o valor como nome
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

    const updatedCustomTimes = [...customTimes, newCustomTime];
    setCustomTimes(updatedCustomTimes);
    saveTimerData();
    
    console.log(`Tempo personalizado adicionado: ${timeName}, ${value} minutos`);
  };

  // Remover tempo personalizado
  const removeCustomTime = (id) => {
    // Verificar se o tempo a ser removido está selecionado
    const isSelectedTime = customTimes.find(t => t.id === id)?.selected;
    
    // Filtrar o tempo a ser removido
    const updatedCustomTimes = customTimes.filter(time => time.id !== id);
    setCustomTimes(updatedCustomTimes);
    
    // Se o tempo removido estava selecionado, selecionar o tempo padrão (25min)
    if (isSelectedTime) {
      selectPresetTime(2); // ID do tempo de 25min
    }
    
    saveTimerData();
  };

  // Formatador de tempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular progresso para visualização
  const calculateProgress = () => {
    const totalTime = mode === 'focus' 
      ? selectedTime * 60 
      : Math.max(Math.round(selectedTime / 5), 5) * 60;
    return 1 - (remainingTime / totalTime);
  };

  return (
    <TimerContext.Provider
      value={{
        isRunning,
        mode,
        remainingTime,
        selectedTime,
        completedSessions,
        showCelebration,
        presetTimes,
        customTimes,
        toggleTimer,
        resetTimer,
        selectPresetTime,
        selectCustomTime,
        addCustomTime,
        removeCustomTime,
        formatTime,
        calculateProgress
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