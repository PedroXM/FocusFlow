import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Switch 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTimer } from '../../contexts/TimerContext';
import { useSubject } from '../../contexts/SubjectContext';
import TimerCircle from '../../components/timer/TimerCircle';
import CelebrationEffect from '../../components/ui/CelebrationEffect';

const HomeScreen = () => {
  const navigation = useNavigation();
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
    addCustomTime,
    showCelebration,
    // 🍅 NOVOS ESTADOS POMODORO
    timerMode,
    isInPomodoroMode,
    toggleTimerMode,
    resetPomodoroSession,
    getPomodoroStatus,
    POMODORO_CONFIG
  } = useTimer();
  
  const { 
    getSelectedSubject, 
    selectSubject, 
    subjects
  } = useSubject();

  // Estados para UI
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);
  const [customTimeName, setCustomTimeName] = useState("");
  const [customTimeValue, setCustomTimeValue] = useState(25);
  const [motivationalPhrase, setMotivationalPhrase] = useState("");
  
  // 🍅 FRASES MOTIVACIONAIS POMODORO
  const pomodoroMotivationalPhrases = [
    "🍅 Foco total no seu Pomodoro!",
    "🍅 25 minutos de concentração máxima!",
    "🍅 Um Pomodoro por vez, um objetivo por vez.",
    "🍅 Elimine distrações, maximize resultados.",
    "🍅 Cada Pomodoro te aproxima do seu objetivo!"
  ];

  const flexibleMotivationalPhrases = [
    "⏰ Foco no processo, não apenas no resultado.",
    "⏰ Pequenos passos consistentes levam a grandes conquistas.",
    "⏰ O tempo é seu recurso mais valioso. Use-o sabiamente.",
    "⏰ Disciplina é escolher entre o que você quer agora e o que você quer mais.",
    "⏰ A produtividade não é sobre fazer mais, é sobre fazer melhor."
  ];
  
  // Selecionar frase baseada no modo
  useEffect(() => {
    const phrases = isInPomodoroMode ? pomodoroMotivationalPhrases : flexibleMotivationalPhrases;
    const randomIndex = Math.floor(Math.random() * phrases.length);
    setMotivationalPhrase(phrases[randomIndex]);
    
    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * phrases.length);
      setMotivationalPhrase(phrases[newIndex]);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isInPomodoroMode]);
  
  // Função para adicionar tempo personalizado
  const handleAddCustomTime = () => {
    if (customTimeValue > 0) {
      const name = customTimeName.trim() || `${customTimeValue}min`;
      addCustomTime(name, customTimeValue);
      setCustomTimeName('');
      setCustomTimeValue(25);
      setShowCustomTimeModal(false);
    }
  };

  // 🍅 OBTER COR DO TIMER BASEADA NO MODO
  const getTimerColor = () => {
    const selectedSubject = getSelectedSubject();
    
    if (isInPomodoroMode) {
      switch (mode) {
        case 'focus':
          return selectedSubject?.color || theme.primary;
        case 'break':
          return theme.secondary;
        case 'longBreak':
          return theme.accent;
        default:
          return theme.primary;
      }
    } else {
      return mode === 'focus' 
        ? selectedSubject?.color || theme.primary 
        : theme.success;
    }
  };

  // 🍅 OBTER TEXTO DO STATUS
  const getStatusText = () => {
    if (isInPomodoroMode) {
      switch (mode) {
        case 'focus':
          const pomodoroStatus = getPomodoroStatus();
          return `🍅 Pomodoro ${pomodoroStatus?.currentPomodoro || 1}/4`;
        case 'break':
          return '☕ Pausa Curta';
        case 'longBreak':
          return '🛋️ Pausa Longa';
        default:
          return '🍅 Modo Pomodoro';
      }
    } else {
      return mode === 'focus' ? '⏰ Hora de Focar' : '☕ Hora de Descansar';
    }
  };

  // 🍅 RENDERIZAR INFORMAÇÕES DO POMODORO
  const renderPomodoroInfo = () => {
    if (!isInPomodoroMode) return null;
    
    const pomodoroStatus = getPomodoroStatus();
    if (!pomodoroStatus) return null;

    return (
      <View style={[styles.pomodoroInfo, { backgroundColor: theme.card, ...theme.shadow }]}>
        <View style={styles.pomodoroRow}>
          <Text style={[styles.pomodoroLabel, { color: theme.textSecondary }]}>
            Ciclo Atual:
          </Text>
          <View style={styles.pomodoroCounter}>
            {[1, 2, 3, 4].map(num => (
              <View
                key={num}
                style={[
                  styles.pomodoroIndicator,
                  {
                    backgroundColor: num <= pomodoroStatus.currentPomodoro 
                      ? theme.primary 
                      : theme.border
                  }
                ]}
              >
                <Text style={[
                  styles.pomodoroNumber,
                  { color: num <= pomodoroStatus.currentPomodoro ? '#FFFFFF' : theme.textSecondary }
                ]}>
                  {num}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.pomodoroRow}>
          <Text style={[styles.pomodoroLabel, { color: theme.textSecondary }]}>
            Total de Pomodoros:
          </Text>
          <Text style={[styles.pomodoroTotal, { color: theme.primary }]}>
            {pomodoroStatus.completedPomodoros} 🍅
          </Text>
        </View>

        <View style={styles.pomodoroRow}>
          <Text style={[styles.pomodoroLabel, { color: theme.textSecondary }]}>
            Próxima pausa:
          </Text>
          <Text style={[styles.pomodoroNext, { color: theme.textSecondary }]}>
            {pomodoroStatus.nextBreakType === 'longa' ? '🛋️ Longa (15min)' : '☕ Curta (5min)'}
          </Text>
        </View>
      </View>
    );
  };

  const selectedSubject = getSelectedSubject();
  const progress = calculateProgress();
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* 🍅 SELETOR DE MODO POMODORO/FLEXÍVEL */}
        <View style={[styles.modeSelector, { backgroundColor: theme.card, ...theme.shadow }]}>
          <View style={styles.modeRow}>
            <View style={styles.modeInfo}>
              <Ionicons 
                name={isInPomodoroMode ? "timer" : "time"} 
                size={24} 
                color={theme.primary} 
              />
              <View style={styles.modeTexts}>
                <Text style={[styles.modeTitle, { color: theme.text }]}>
                  {isInPomodoroMode ? 'Pomodoro Clássico' : 'Modo Flexível'}
                </Text>
                <Text style={[styles.modeDescription, { color: theme.textSecondary }]}>
                  {isInPomodoroMode 
                    ? '25min foco + pausas automáticas' 
                    : 'Tempos personalizáveis'}
                </Text>
              </View>
            </View>
            <Switch
              value={isInPomodoroMode}
              onValueChange={toggleTimerMode}
              trackColor={{ false: '#767577', true: `${theme.primary}80` }}
              thumbColor={isInPomodoroMode ? theme.primary : '#f4f3f4'}
              disabled={isRunning}
            />
          </View>
        </View>

        {/* Estado atual */}
        <View style={[
          styles.statusBanner, 
          { 
            backgroundColor: getTimerColor() + '20',
            borderColor: getTimerColor()
          }
        ]}>
          <Text style={[styles.statusText, { color: getTimerColor() }]}>
            {getStatusText()}
          </Text>
        </View>

        {/* 🍅 INFORMAÇÕES DO POMODORO */}
        {renderPomodoroInfo()}
        
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
                    ...theme.shadow,
                  }
                ]}
              >
                <ScrollView 
                  nestedScrollEnabled={true}
                  style={{ maxHeight: 200 }} 
                  contentContainerStyle={{ paddingBottom: 8 }}
                >
                  {subjects.map(subject => (
                    <TouchableOpacity
                      key={subject.id}
                      style={[
                        styles.dropdownItem,
                        { borderBottomColor: theme.border },
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
                    <Text style={[{ color: theme.primary, marginLeft: 8 }]}>
                      Adicionar nova matéria
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
          </View>
        )}
        
        {/* Seletor de tempos (APENAS modo flexível + foco + parado) */}
        {!isInPomodoroMode && mode === 'focus' && !isRunning && (
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
                      {custom.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {/* Botão para adicionar tempo personalizado */}
            <TouchableOpacity
              style={[styles.addCustomButton, { borderColor: theme.border }]}
              onPress={() => setShowCustomTimeModal(true)}
            >
              <Ionicons name="add" size={16} color={theme.primary} />
              <Text style={[styles.addCustomText, { color: theme.primary }]}>
                Adicionar tempo
              </Text>
            </TouchableOpacity>
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
            color={getTimerColor()}
            // 🍅 NOVAS PROPS PARA POMODORO
            isPomodoro={isInPomodoroMode}
            pomodoroStatus={isInPomodoroMode ? getPomodoroStatus() : null}
          />
        </View>

        {/* 🍅 CONTROLES POMODORO ADICIONAIS */}
        {isInPomodoroMode && (
          <View style={styles.pomodoroControls}>
            <TouchableOpacity
              style={[
                styles.pomodoroControlButton,
                { 
                  backgroundColor: theme.danger + '20',
                  borderColor: theme.danger
                }
              ]}
              onPress={resetPomodoroSession}
              disabled={isRunning}
            >
              <Ionicons name="refresh-circle" size={20} color={theme.danger} />
              <Text style={[styles.controlButtonText, { color: theme.danger }]}>
                Reset Ciclo
              </Text>
            </TouchableOpacity>

            <View style={[styles.pomodoroTip, { backgroundColor: theme.card, ...theme.shadow }]}>
              <Ionicons name="bulb" size={16} color={theme.accent} />
              <Text style={[styles.tipText, { color: theme.textSecondary }]}>
                {isInPomodoroMode && isRunning 
                  ? "Pomodoro não pode ser pausado! Use Reset para recomeçar."
                  : "No Pomodoro clássico: 25min foco → 5min pausa → repeat"}
              </Text>
            </View>
          </View>
        )}
        
        {/* Mensagem de motivação */}
        <View style={[styles.motivationCard, { backgroundColor: theme.card, ...theme.shadow }]}>
          <Text style={[styles.motivationText, { color: theme.textSecondary }]}>
            "{motivationalPhrase}"
          </Text>
        </View>
      </View>
      
      {/* Efeito de celebração */}
      {showCelebration && (
        <CelebrationEffect selectedTime={selectedTime} />
      )}
      
      {/* Modal para adicionar tempo personalizado (apenas modo flexível) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCustomTimeModal && !isInPomodoroMode}
        onRequestClose={() => setShowCustomTimeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card, ...theme.shadow }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Adicionar Tempo Personalizado
            </Text>
            
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              Duração (minutos)
            </Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderColor: theme.border
                }
              ]}
              placeholder="Ex: 20, 40..."
              placeholderTextColor={theme.textSecondary}
              value={String(customTimeValue)}
              onChangeText={(text) => setCustomTimeValue(parseInt(text) || 0)}
              keyboardType="numeric"
            />
            
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              Rótulo (opcional)
            </Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderColor: theme.border
                }
              ]}
              placeholder="Ex: Leitura, Revisão..."
              placeholderTextColor={theme.textSecondary}
              value={customTimeName}
              onChangeText={setCustomTimeName}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { borderColor: theme.border }]}
                onPress={() => setShowCustomTimeModal(false)}
              >
                <Text style={[styles.buttonText, { color: theme.textSecondary }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.modalButton, 
                  { 
                    backgroundColor: theme.primary,
                    borderColor: theme.primary
                  }
                ]}
                onPress={handleAddCustomTime}
                disabled={customTimeValue <= 0}
              >
                <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                  Adicionar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  // 🍅 NOVOS ESTILOS POMODORO
  modeSelector: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modeTexts: {
    marginLeft: 12,
    flex: 1,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  modeDescription: {
    fontSize: 12,
  },
  pomodoroInfo: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  pomodoroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pomodoroLabel: {
    fontSize: 14,
  },
  pomodoroCounter: {
    flexDirection: 'row',
  },
  pomodoroIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  pomodoroNumber: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  pomodoroTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pomodoroNext: {
    fontSize: 14,
  },
  pomodoroControls: {
    width: '100%',
    marginTop: 16,
  },
  pomodoroControlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  controlButtonText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  pomodoroTip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  tipText: {
    marginLeft: 8,
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  // Estilos originais
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
    zIndex: 10,
    position: 'relative',
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
    position: 'absolute',
    top: 75,
    left: 0,
    right: 0,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    zIndex: 1000,
    elevation: 3,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
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
    marginBottom: 10,
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
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  addCustomText: {
    fontSize: 14,
    marginLeft: 4,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;