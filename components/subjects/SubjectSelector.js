import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const SubjectSelector = ({ 
  subjects, 
  selectedSubject, 
  onSelectSubject,
  onAddSubject 
}) => {
  const { theme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
        Matéria:
      </Text>
      
      <TouchableOpacity
        style={[
          styles.selector,
          { 
            backgroundColor: theme.card,
            borderColor: theme.border,
            ...theme.shadow
          }
        ]}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <View style={styles.selectedItem}>
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
          name={showDropdown ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={theme.textSecondary} 
        />
      </TouchableOpacity>
      
      {/* Dropdown */}
      {showDropdown && (
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
          <ScrollView style={{ maxHeight: 150 }}>
            {subjects.map(subject => (
              <TouchableOpacity
                key={subject.id}
                style={[
                  styles.dropdownItem,
                  { borderBottomColor: theme.border },
                  subject.id === selectedSubject?.id && { backgroundColor: theme.primary + '20' }
                ]}
                onPress={() => {
                  onSelectSubject(subject.id);
                  setShowDropdown(false);
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
                {subject.id === selectedSubject?.id && (
                  <Ionicons name="checkmark" size={20} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Botão para adicionar nova matéria */}
          <TouchableOpacity
            style={[
              styles.dropdownItem,
              { borderBottomColor: theme.border }
            ]}
            onPress={() => {
              setShowDropdown(false);
              onAddSubject && onAddSubject();
            }}
          >
            <Ionicons name="add-circle-outline" size={20} color={theme.primary} />
            <Text style={[styles.addText, { color: theme.primary }]}>
              Adicionar nova matéria
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedItem: {
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
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  addText: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default SubjectSelector;
