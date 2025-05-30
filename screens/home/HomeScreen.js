
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput 
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
    showCelebration
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
  
  // Frases motivacionais
  const motivationalPhrases = [
    "Foco no processo, não apenas no resultado.",
    "Pequenos passos consistentes levam a grandes conquistas.",
    "O tempo é seu recurso mais valioso. Use-o sabiamente.",
    "Disciplina é escolher entre o que você quer agora e o que você quer mais.",
    "A produtividade não é sobre fazer mais, é sobre fazer melhor."
  ];
  
  // Selecionar frase aleatória ao iniciar
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
    setMotivationalPhrase(motivationalPhrases[randomIndex]);
    
    // Trocar frase a cada 30 segundos
    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * motivationalPhrases.length);
      setMotivationalPhrase(motivationalPhrases[newIndex]);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Função para adicionar tempo personalizado
  const handleAddCustomTime = () => {
    if (customTimeValue > 0) {
      // Se não houver nome, usar o valor como nome
      const name = customTimeName.trim() || `${customTimeValue}min`;
      addCustomTime(name, customTimeValue);
      setCustomTimeName('');
      setCustomTimeValue(25);
      setShowCustomTimeModal(false);
    }
  };
  
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
            
            {/* Dropdown de matérias com rolagem CORRIGIDO */}
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
      
      {/* Modal para adicionar tempo personalizado - CORRIGIDO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCustomTimeModal}
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
  addSubjectText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
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