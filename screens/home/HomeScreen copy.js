
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTimer } from '../../contexts/TimerContext';
import { useSubject } from '../../contexts/SubjectContext';
import TimerCircle from '../../components/timer/TimerCircle';
import CelebrationEffect from '../../components/ui/CelebrationEffect';

const HomeScreen = () => {
  const { theme } = useTheme();
  const { 
    isRunning, 
    mode, 
    remainingTime, 
    selectedTime,
    toggleTimer, 
    resetTimer, 
    formatTime,
    calculateProgress,
    presetTimes,
    customTimes,
    selectPresetTime,
    selectCustomTime,
    showCelebration
  } = useTimer();
  const { 
    getSelectedSubject, 
    selectSubject, 
    subjects
  } = useSubject();

  // Estado para o dropdown de matérias
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  
  // Frases motivacionais
  const motivationalPhrases = [
    "Foco no processo, não apenas no resultado.",
    "Pequenos passos consistentes levam a grandes conquistas.",
    "O tempo é seu recurso mais valioso. Use-o sabiamente.",
    "Disciplina é escolher entre o que você quer agora e o que você quer mais.",
    "A produtividade não é sobre fazer mais, é sobre fazer melhor."
  ];
  
  const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
  const motivationalPhrase = motivationalPhrases[randomIndex];
  
  const selectedSubject = getSelectedSubject();
  const progress = calculateProgress();
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Estado atual */}
        <View style={[
          styles.statusBanner, 
          { 
            backgroundColor: mode === 'focus' ? theme.primary + '20' : theme.success + '20',
            borderColor: mode === 'focus' ? theme.primary : theme.success
          }
        ]}>
          <Text style={[
            styles.statusText, 
            { color: mode === 'focus' ? theme.primary : theme.success }
          ]}>
            {mode === 'focus' ? 'Hora de Focar' : 'Hora de Descansar'}
          </Text>
        </View>
        
        {/* Seletor de matéria (somente no modo de foco) */}
        {mode === 'focus' && (
          <View style={styles.subjectContainer}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              Matéria:
            </Text>
            
            <TouchableOpacity
              style={[
                styles.subjectSelector,
                { 
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  ...theme.shadow
                }
              ]}
              onPress={() => setShowSubjectDropdown(!showSubjectDropdown)}
            >
              <View style={styles.selectedSubject}>
                <View 
                  style={[
                    styles.colorIndicator, 
                    { backgroundColor: selectedSubject?.color || theme.primary }
                  ]} 
                />
                <Text style={[styles.subjectName, { color: theme.text }]}>
                  {selectedSubject?.name || 'Selecione uma matéria'}
                </Text>
              </View>
              <Ionicons 
                name={showSubjectDropdown ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={theme.textSecondary} 
              />
            </TouchableOpacity>
            
            {/* Dropdown de matérias */}
           {showSubjectDropdown && (
  <View 
    style={[
      styles.dropdown, 
      { 
        backgroundColor: theme.card,
        borderColor: theme.border,
        ...theme.shadow
      }
    ]}
  >
    <ScrollView style={{ maxHeight: 200 }}>
      {subjects.map(subject => (
        <TouchableOpacity
          key={subject.id}
          style={[
            styles.dropdownItem,
            subject.selected && { backgroundColor: theme.primary + '20' }
          ]}
          onPress={() => {
            selectSubject(subject.id);
            setShowSubjectDropdown(false);
          }}
        >
          <View 
            style={[
              styles.colorIndicator, 
              { backgroundColor: subject.color }
            ]} 
          />
          <Text style={[styles.subjectName, { color: theme.text }]}>
            {subject.name}
          </Text>
          {subject.selected && (
            <Ionicons name="checkmark" size={20} color={theme.primary} />
          )}
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity
        style={[
          styles.dropdownItem,
          { backgroundColor: theme.primary + '10' }
        ]}
        onPress={() => {
          setShowSubjectDropdown(false);
          navigation.navigate('Configurações');
        }}
      >
        <Ionicons name="add-circle-outline" size={20} color={theme.primary} />
        <Text style={[styles.addSubjectText, { color: theme.primary }]}>
          Adicionar nova matéria
        </Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
)}
          </View>
        )}
        
        {/* Seletor de tempos (somente no modo de foco e quando não estiver rodando) */}
        {mode === 'focus' && !isRunning && (
          <View style={styles.timeSelectorsContainer}>
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
                      ...theme.shadow
                    }
                  ]}
                  onPress={() => selectPresetTime(preset.id)}
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
                        ...theme.shadow
                      }
                    ]}
                    onPress={() => selectCustomTime(custom.id)}
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
          </View>
        )}
        
        {/* Timer circular */}
        <View style={styles.timerSection}>
          <TimerCircle 
            time={formatTime(remainingTime)}
            progress={progress}
            isRunning={isRunning}
            mode={mode}
            onToggle={toggleTimer}
            onReset={resetTimer}
            color={mode === 'focus' 
              ? selectedSubject?.color || theme.primary 
              : theme.success}
          />
        </View>
        
        {/* Mensagem de motivação */}
        <View style={[styles.motivationCard, { backgroundColor: theme.card, ...theme.shadow }]}>
          <Text style={[styles.motivationText, { color: theme.textSecondary }]}>
            "{motivationalPhrase}"
          </Text>
        </View>
      </View>
      
      {/* Efeito de celebração (ao completar uma sessão) */}
      {showCelebration && (
        <CelebrationEffect selectedTime={selectedTime} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  statusBanner: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 20,
    alignItems: 'center',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  subjectContainer: {
    width: '100%',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  subjectSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedSubject: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  subjectName: {
    fontSize: 16,
  },
  dropdown: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 5,
    maxHeight: 200,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  timeSelectorsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  timePresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  customTimes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timePreset: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  presetText: {
    fontWeight: '500',
  },
  timerSection: {
    marginVertical: 20,
  },
  motivationCard: {
    width: '100%',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  motivationText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  }
});

export default HomeScreen;