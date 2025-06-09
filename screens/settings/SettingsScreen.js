
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Switch, 
  TouchableOpacity, 
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useSubject } from '../../contexts/SubjectContext';

const SettingsScreen = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { subjects, addSubject, removeSubject, editSubject } = useSubject();
  
  // Estados para o modal de adicionar/editar matéria
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' ou 'edit'
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FF6347');
  
  // Estados para o modal de confirmação
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  
  // Cores disponíveis
  const colors = [
    '#FF6347', '#4A90E2', '#50C878', '#FFD700', 
    '#9370DB', '#FF69B4', '#20B2AA', '#FF7F50'
  ];

  // Abrir modal de adicionar matéria
  const openAddSubjectModal = () => {
    setModalMode('add');
    setSubjectName('');
    setSelectedColor('#FF6347');
    setModalVisible(true);
  };

  // Abrir modal de editar matéria
  const openEditSubjectModal = (subject) => {
    setModalMode('edit');
    setEditingSubject(subject);
    setSubjectName(subject.name);
    setSelectedColor(subject.color);
    setModalVisible(true);
  };

  // Salvar matéria (adicionar ou editar)
  const saveSubject = () => {
    if (!subjectName.trim()) return;
    
    if (modalMode === 'add') {
      addSubject(subjectName, selectedColor);
    } else {
      editSubject(editingSubject.id, subjectName, selectedColor);
    }
    
    setModalVisible(false);
  };

  // Confirmar exclusão de matéria
  const confirmDeleteSubject = (subject) => {
    setSubjectToDelete(subject);
    setConfirmModalVisible(true);
  };

  // Excluir matéria
  const deleteSubject = () => {
    if (subjectToDelete) {
      removeSubject(subjectToDelete.id);
    }
    setConfirmModalVisible(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Configurações gerais */}
        <View style={[styles.section, { backgroundColor: theme.card, ...theme.shadow }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Configurações Gerais</Text>
          
          {/* Tema escuro */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons 
                name={isDarkMode ? 'moon' : 'sunny'} 
                size={24} 
                color={isDarkMode ? theme.primary : theme.accent}
              />
              <Text style={[styles.settingText, { color: theme.text }]}>Tema Escuro</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: `${theme.primary}80` }}
              thumbColor={isDarkMode ? theme.primary : '#f4f3f4'}
            />
          </View>
        </View>
        
        {/* Gerenciamento de matérias */}
        <View style={[styles.section, { backgroundColor: theme.card, ...theme.shadow }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Matérias</Text>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={openAddSubjectModal}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {/* Lista de matérias */}
          {subjects.map(subject => (
            <View 
              key={subject.id} 
              style={[styles.subjectItem, { borderBottomColor: theme.border }]}
            >
              <View style={styles.subjectInfo}>
                <View style={[styles.colorIndicator, { backgroundColor: subject.color }]} />
                <Text style={[styles.subjectName, { color: theme.text }]}>{subject.name}</Text>
              </View>
              
              <View style={styles.subjectActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: theme.border }]}
                  onPress={() => openEditSubjectModal(subject)}
                >
                  <Ionicons name="pencil" size={16} color={theme.text} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: theme.danger + '20' }]}
                  onPress={() => confirmDeleteSubject(subject)}
                >
                  <Ionicons name="trash" size={16} color={theme.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          {subjects.length === 0 && (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Nenhuma matéria cadastrada. Adicione uma matéria para começar.
            </Text>
          )}
        </View>
        
        {/* Sobre o app */}
        <View style={[styles.section, { backgroundColor: theme.card, ...theme.shadow }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Sobre</Text>
          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
            FocusFlow v1.0.0
          </Text>
          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
            Um aplicativo para melhorar sua concentração e produtividade usando o método Pomodoro.
          </Text>
        </View>
      </View>
      
      {/* Modal para adicionar/editar matéria */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card, ...theme.shadow }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {modalMode === 'add' ? 'Adicionar Matéria' : 'Editar Matéria'}
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
              placeholder="Nome da matéria"
              placeholderTextColor={theme.textSecondary}
              value={subjectName}
              onChangeText={setSubjectName}
            />
            
            <Text style={[styles.colorLabel, { color: theme.textSecondary }]}>
              Cor
            </Text>
            
            <View style={styles.colorGrid}>
              {colors.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { 
                      backgroundColor: color,
                      borderWidth: selectedColor === color ? 2 : 0,
                      borderColor: theme.text
                    }
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { borderColor: theme.border }]}
                onPress={() => setModalVisible(false)}
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
                onPress={saveSubject}
              >
                <Text style={styles.buttonText}>
                  {modalMode === 'add' ? 'Adicionar' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Modal de confirmação de exclusão */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.confirmModal, { backgroundColor: theme.card, ...theme.shadow }]}>
            <Text style={[styles.confirmTitle, { color: theme.text }]}>
              Excluir Matéria
            </Text>
            
            <Text style={[styles.confirmText, { color: theme.textSecondary }]}>
              Tem certeza que deseja excluir "{subjectToDelete?.name}"? Esta ação não pode ser desfeita.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { borderColor: theme.border }]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={[styles.buttonText, { color: theme.textSecondary }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.modalButton, 
                  { 
                    backgroundColor: theme.danger,
                    borderColor: theme.danger
                  }
                ]}
                onPress={deleteSubject}
              >
                <Text style={styles.buttonText}>
                  Excluir
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
    padding: 16,
  },
  section: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  subjectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  subjectName: {
    fontSize: 16,
  },
  subjectActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
    fontStyle: 'italic',
  },
  aboutText: {
    marginBottom: 8,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 8,
    padding: 20,
  },
  confirmModal: {
    width: '80%',
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  confirmText: {
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  colorLabel: {
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    margin: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    color: '#FFFFFF',
  },
});

export default SettingsScreen;