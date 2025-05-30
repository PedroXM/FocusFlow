
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SubjectContext = createContext();

export const SubjectProvider = ({ children }) => {
  // Estado para as matérias
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Matemática", color: "#FF6347", selected: true, totalMinutes: 0 },
    { id: 2, name: "Programação", color: "#4A90E2", selected: false, totalMinutes: 0 },
    { id: 3, name: "Física", color: "#50C878", selected: false, totalMinutes: 0 },
    { id: 4, name: "Inglês", color: "#FFD700", selected: false, totalMinutes: 0 }
  ]);

  // Estado para o histórico de sessões
  const [sessionHistory, setSessionHistory] = useState([]);

  // Carregar dados salvos
  useEffect(() => {
    loadSubjectsData();
  }, []);

  // Função para carregar os dados salvos
  const loadSubjectsData = async () => {
    try {
      const savedSubjects = await AsyncStorage.getItem('subjects');
      const savedHistory = await AsyncStorage.getItem('sessionHistory');
      
      if (savedSubjects) {
        setSubjects(JSON.parse(savedSubjects));
      }
      
      if (savedHistory) {
        setSessionHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Erro ao carregar dados das matérias:', error);
    }
  };

  // Função para salvar os dados
  const saveSubjectsData = async () => {
    try {
      await AsyncStorage.setItem('subjects', JSON.stringify(subjects));
      await AsyncStorage.setItem('sessionHistory', JSON.stringify(sessionHistory));
    } catch (error) {
      console.error('Erro ao salvar dados das matérias:', error);
    }
  };

  // Selecionar uma matéria
  const selectSubject = (id) => {
    const updatedSubjects = subjects.map(subject => ({
      ...subject,
      selected: subject.id === id
    }));
    
    setSubjects(updatedSubjects);
    saveSubjectsData();
  };

  // Adicionar nova matéria
  const addSubject = (name, color) => {
    const newId = subjects.length > 0 
      ? Math.max(...subjects.map(s => s.id)) + 1 
      : 1;
      
    const newSubject = {
      id: newId,
      name,
      color,
      selected: false,
      totalMinutes: 0
    };

    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    saveSubjectsData();
    
    return newId;
  };

  // Editar matéria existente
  const editSubject = (id, name, color) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === id ? { ...subject, name, color } : subject
    );
    
    setSubjects(updatedSubjects);
    saveSubjectsData();
  };

  // Remover matéria
  const removeSubject = (id) => {
    // Verificar se a matéria a ser removida está selecionada
    const isSelectedSubject = subjects.find(s => s.id === id)?.selected;
    
    // Filtrar a matéria a ser removida
    const updatedSubjects = subjects.filter(subject => subject.id !== id);
    
    // Se a matéria removida estava selecionada, selecionar a primeira matéria
    if (isSelectedSubject && updatedSubjects.length > 0) {
      updatedSubjects[0].selected = true;
    }
    
    setSubjects(updatedSubjects);
    saveSubjectsData();
  };

  // Adicionar uma sessão ao histórico - CORRIGIDO
  const addSession = (subjectId, duration, mode, completed = true) => {
    // Apenas registrar sessões de foco concluídas nas estatísticas
    if (mode !== 'focus' || !completed) return;
    
    // Encontrar a matéria
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    // Validar a duração (ignorar sessões com menos de 1 minuto)
    const validDuration = Math.max(duration, 1);
    
    // Criar nova sessão
    const newSession = {
      id: sessionHistory.length > 0 ? Math.max(...sessionHistory.map(s => s.id)) + 1 : 1,
      subjectId,
      subjectName: subject.name,
      subjectColor: subject.color,
      duration: validDuration,
      mode: 'focus',
      date: new Date(),
      completed: true
    };
    
    // Atualizar histórico
    const updatedHistory = [newSession, ...sessionHistory];
    setSessionHistory(updatedHistory);
    
    // Atualizar minutos totais da matéria
    const updatedSubjects = subjects.map(s => 
      s.id === subjectId 
        ? { ...s, totalMinutes: s.totalMinutes + validDuration } 
        : s
    );
    
    setSubjects(updatedSubjects);
    saveSubjectsData();
    
    console.log(`Sessão adicionada: ${subject.name}, ${validDuration} minutos`);
  };

  // Obter a matéria selecionada
  const getSelectedSubject = () => {
    return subjects.find(s => s.selected) || (subjects.length > 0 ? subjects[0] : null);
  };

  // Obter estatísticas por matéria
  const getSubjectStats = () => {
    return subjects.map(subject => {
      const sessionsCount = sessionHistory.filter(
        s => s.subjectId === subject.id && s.completed && s.mode === 'focus'
      ).length;
      
      return {
        ...subject,
        sessionsCount
      };
    });
  };

  // Obter estatísticas gerais
  const getOverallStats = () => {
    const focusMinutes = sessionHistory
      .filter(s => s.completed && s.mode === 'focus')
      .reduce((total, session) => total + session.duration, 0);
      
    const breakMinutes = 0; // Não estamos mais registrando sessões de pausa
      
    const totalSessions = sessionHistory
      .filter(s => s.completed && s.mode === 'focus')
      .length;
      
    const todaySessions = sessionHistory
      .filter(s => {
        const today = new Date();
        const sessionDate = new Date(s.date);
        return s.completed && 
               s.mode === 'focus' &&
               sessionDate.getDate() === today.getDate() &&
               sessionDate.getMonth() === today.getMonth() &&
               sessionDate.getFullYear() === today.getFullYear();
      })
      .length;
      
    return {
      focusMinutes,
      breakMinutes,
      totalSessions,
      todaySessions
    };
  };

  return (
    <SubjectContext.Provider
      value={{
        subjects,
        sessionHistory,
        selectSubject,
        addSubject,
        editSubject,
        removeSubject,
        addSession,
        getSelectedSubject,
        getSubjectStats,
        getOverallStats
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubject = () => {
  const context = useContext(SubjectContext);
  if (!context) {
    throw new Error('useSubject deve ser usado dentro de um SubjectProvider');
  }
  return context;
};

export default SubjectContext;