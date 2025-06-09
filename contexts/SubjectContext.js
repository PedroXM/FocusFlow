import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SubjectContext = createContext();

export const SubjectProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);

  // Carregar dados salvos ao iniciar
  useEffect(() => {
    loadSubjectData();
  }, []);

  // Carregar dados das matérias
  const loadSubjectData = async () => {
    try {
      const savedSubjects = await AsyncStorage.getItem('subjects');
      const savedSessions = await AsyncStorage.getItem('sessionHistory');
      
      if (savedSubjects) {
        setSubjects(JSON.parse(savedSubjects));
      }
      
      if (savedSessions) {
        setSessionHistory(JSON.parse(savedSessions));
      }
    } catch (error) {
      console.error('Erro ao carregar dados das matérias:', error);
    }
  };

  // Salvar dados das matérias
  const saveSubjectData = async () => {
    try {
      await AsyncStorage.setItem('subjects', JSON.stringify(subjects));
      await AsyncStorage.setItem('sessionHistory', JSON.stringify(sessionHistory));
    } catch (error) {
      console.error('Erro ao salvar dados das matérias:', error);
    }
  };

  // Adicionar nova matéria
  const addSubject = (name, color) => {
    const newId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
    
    const newSubject = {
      id: newId,
      name: name.trim(),
      color,
      selected: subjects.length === 0, // Primeira matéria será selecionada automaticamente
      sessions: [],
      totalMinutes: 0
    };

    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    saveSubjectData();
    
    console.log(`Matéria adicionada: ${name}`);
  };

  // Editar matéria existente
  const editSubject = (id, name, color) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === id
        ? { ...subject, name: name.trim(), color }
        : subject
    );
    
    setSubjects(updatedSubjects);
    saveSubjectData();
    
    console.log(`Matéria editada: ${name}`);
  };

  // Remover matéria
  const removeSubject = (id) => {
    // Não permitir remover se for a única matéria
    if (subjects.length <= 1) {
      console.warn('Não é possível remover a única matéria');
      return;
    }

    const subjectToRemove = subjects.find(s => s.id === id);
    const updatedSubjects = subjects.filter(subject => subject.id !== id);
    
    // Se a matéria removida estava selecionada, selecionar a primeira disponível
    if (subjectToRemove?.selected && updatedSubjects.length > 0) {
      updatedSubjects[0].selected = true;
    }
    
    setSubjects(updatedSubjects);
    saveSubjectData();
    
    console.log(`Matéria removida: ${subjectToRemove?.name}`);
  };

  // Selecionar matéria
  const selectSubject = (id) => {
    const updatedSubjects = subjects.map(subject => ({
      ...subject,
      selected: subject.id === id
    }));
    
    setSubjects(updatedSubjects);
    saveSubjectData();
    
    const selectedSubject = updatedSubjects.find(s => s.id === id);
    console.log(`Matéria selecionada: ${selectedSubject?.name}`);
  };

  // Obter matéria selecionada
  const getSelectedSubject = () => {
    return subjects.find(subject => subject.selected) || null;
  };

  // Adicionar sessão de estudo
  const addSession = (subjectId, duration, mode, completed) => {
    const sessionId = Date.now().toString();
    const now = new Date();
    
    const newSession = {
      id: sessionId,
      subjectId,
      subjectName: subjects.find(s => s.id === subjectId)?.name || 'Desconhecida',
      subjectColor: subjects.find(s => s.id === subjectId)?.color || '#FF6347',
      duration,
      mode, // 'focus' ou 'break'
      completed,
      date: now.toISOString(),
      timestamp: now.getTime()
    };

    // Adicionar ao histórico
    const updatedHistory = [newSession, ...sessionHistory];
    setSessionHistory(updatedHistory);

    // Atualizar estatísticas da matéria (apenas para sessões de foco completadas)
    if (mode === 'focus' && completed) {
      const updatedSubjects = subjects.map(subject => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            totalMinutes: subject.totalMinutes + duration,
            sessions: [...(subject.sessions || []), newSession]
          };
        }
        return subject;
      });
      
      setSubjects(updatedSubjects);
    }

    saveSubjectData();
    
    console.log(`Sessão registrada: ${duration}min de ${mode} para ${newSession.subjectName}`);
  };

  // Obter estatísticas por matéria
  const getSubjectStats = () => {
    return subjects.map(subject => {
      const subjectSessions = sessionHistory.filter(
        session => session.subjectId === subject.id && 
                  session.mode === 'focus' && 
                  session.completed
      );
      
      const totalMinutes = subjectSessions.reduce((sum, session) => sum + session.duration, 0);
      
      return {
        id: subject.id,
        name: subject.name,
        color: subject.color,
        totalMinutes,
        sessionsCount: subjectSessions.length,
        sessions: subjectSessions
      };
    });
  };

  // Obter estatísticas gerais
  const getOverallStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const focusSessions = sessionHistory.filter(
      session => session.mode === 'focus' && session.completed
    );
    
    const todaySessions = focusSessions.filter(
      session => new Date(session.date) >= today
    );
    
    const totalMinutes = focusSessions.reduce((sum, session) => sum + session.duration, 0);
    
    return {
      totalSessions: focusSessions.length,
      todaySessions: todaySessions.length,
      focusMinutes: totalMinutes,
      averagePerSession: focusSessions.length > 0 ? Math.round(totalMinutes / focusSessions.length) : 0
    };
  };

  return (
    <SubjectContext.Provider
      value={{
        subjects,
        sessionHistory,
        addSubject,
        editSubject,
        removeSubject,
        selectSubject,
        getSelectedSubject,
        addSession,
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