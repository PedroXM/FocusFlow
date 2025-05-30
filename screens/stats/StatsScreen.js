
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useSubject } from '../../contexts/SubjectContext';

const StatsScreen = () => {
  const { theme } = useTheme();
  const { getSubjectStats, getOverallStats, sessionHistory } = useSubject();

  const subjectStats = getSubjectStats();
  const overallStats = getOverallStats();

  // Função para formatar tempo total
  const formatTotalTime = (minutes) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  // Verificar data para exibir como "Hoje" se for o mesmo dia
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.getDate() === today.getDate() && 
        date.getMonth() === today.getMonth() && 
        date.getFullYear() === today.getFullYear()) {
      return `Hoje, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${date.getDate()}/${date.getMonth() + 1}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Cards de estatísticas resumidas */}
        <View style={styles.statsGrid}>
          <View style={[styles.statsCard, { backgroundColor: theme.card, ...theme.shadow }]}>
            <Text style={[styles.statsLabel, { color: theme.textSecondary }]}>Sessões Hoje</Text>
            <Text style={[styles.statsValue, { color: theme.text }]}>{overallStats.todaySessions}</Text>
            <Ionicons name="today-outline" size={24} color={theme.primary} style={styles.statsIcon} />
          </View>
          
          <View style={[styles.statsCard, { backgroundColor: theme.card, ...theme.shadow }]}>
            <Text style={[styles.statsLabel, { color: theme.textSecondary }]}>Total de Sessões</Text>
            <Text style={[styles.statsValue, { color: theme.text }]}>{overallStats.totalSessions}</Text>
            <Ionicons name="trophy-outline" size={24} color={theme.primary} style={styles.statsIcon} />
          </View>
          
          <View style={[styles.statsCard, { backgroundColor: theme.card, ...theme.shadow }]}>
            <Text style={[styles.statsLabel, { color: theme.textSecondary }]}>Tempo de Foco</Text>
            <Text style={[styles.statsValue, { color: theme.text }]}>
              {formatTotalTime(overallStats.focusMinutes)}
            </Text>
            <Ionicons name="time-outline" size={24} color={theme.primary} style={styles.statsIcon} />
          </View>
          
          <View style={[styles.statsCard, { backgroundColor: theme.card, ...theme.shadow }]}>
            <Text style={[styles.statsLabel, { color: theme.textSecondary }]}>Média por Sessão</Text>
            <Text style={[styles.statsValue, { color: theme.text }]}>
              {overallStats.totalSessions > 0 
                ? formatTotalTime(Math.round(overallStats.focusMinutes / overallStats.totalSessions)) 
                : '0min'}
            </Text>
            <Ionicons name="analytics-outline" size={24} color={theme.primary} style={styles.statsIcon} />
          </View>
        </View>
        
        {/* Estatísticas por matéria */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, ...theme.shadow }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Detalhes por Matéria</Text>
          
          {subjectStats.length > 0 ? (
            subjectStats
              .filter(subject => subject.totalMinutes > 0) // Mostrar apenas matérias com tempo de estudo
              .sort((a, b) => b.totalMinutes - a.totalMinutes) // Ordenar por tempo total
              .map(subject => {
                // Calcular porcentagem do tempo total
                const totalMinutes = subjectStats.reduce((sum, s) => sum + s.totalMinutes, 0) || 1;
                const percentage = Math.round((subject.totalMinutes / totalMinutes) * 100);
                
                return (
                  <View key={subject.id} style={styles.subjectStat}>
                    <View style={styles.subjectInfo}>
                      <View style={[styles.colorIndicator, { backgroundColor: subject.color }]} />
                      <Text style={[styles.subjectName, { color: theme.text }]}>{subject.name}</Text>
                      <Text style={[styles.subjectTime, { color: theme.textSecondary }]}>
                        {formatTotalTime(subject.totalMinutes)}
                      </Text>
                    </View>
                    
                    <View style={[styles.progressContainer, { backgroundColor: theme.border }]}>
                      <View 
                        style={[
                          styles.progressBar, 
                          { 
                            width: `${percentage}%`,
                            backgroundColor: subject.color,
                          }
                        ]} 
                      />
                    </View>
                    
                    <View style={styles.percentageRow}>
                      <Text style={[styles.sessionCountText, { color: theme.textSecondary }]}>
                        {subject.sessionsCount} {subject.sessionsCount === 1 ? 'sessão' : 'sessões'}
                      </Text>
                      <Text style={[styles.percentageText, { color: theme.textSecondary }]}>
                        {percentage}%
                      </Text>
                    </View>
                  </View>
                );
              })
          ) : (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Nenhuma matéria tem tempo de estudo registrado ainda.
            </Text>
          )}
          
          {subjectStats.filter(s => s.totalMinutes > 0).length === 0 && (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Complete sessões de estudo para ver estatísticas detalhadas.
            </Text>
          )}
        </View>
        
        {/* Histórico de sessões recentes */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, ...theme.shadow }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Sessões Recentes</Text>
          
          {sessionHistory.length > 0 ? (
            sessionHistory.slice(0, 10).map(session => (
              <View 
                key={session.id} 
                style={[styles.sessionItem, { borderBottomColor: theme.border }]}
              >
                <View style={styles.sessionLeft}>
                  <View style={[
                    styles.sessionIcon, 
                    { 
                      backgroundColor: session.subjectColor + '20',
                      borderColor: session.subjectColor
                    }
                  ]}>
                    <Ionicons 
                      name={session.mode === 'focus' ? 'timer-outline' : 'cafe-outline'} 
                      size={16} 
                      color={session.subjectColor} 
                    />
                  </View>
                  <View>
                    <Text style={[styles.sessionSubject, { color: theme.text }]}>
                      {session.subjectName}
                    </Text>
                    <Text style={[styles.sessionDate, { color: theme.textSecondary }]}>
                      {formatDate(session.date)} - {session.duration}min
                    </Text>
                  </View>
                </View>
                
                <View style={[
                  styles.sessionBadge, 
                  { 
                    backgroundColor: session.completed 
                      ? theme.success + '20' 
                      : theme.textSecondary + '20'
                  }
                ]}>
                  <Text style={[
                    styles.sessionBadgeText, 
                    { 
                      color: session.completed 
                        ? theme.success 
                        : theme.textSecondary
                    }
                  ]}>
                    {session.completed ? 'Completo' : 'Em andamento'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Nenhuma sessão registrada ainda. Continue estudando!
            </Text>
          )}
        </View>
        
        {/* Motivação e resumo */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, ...theme.shadow }]}>
          <Text style={[styles.statsNote, { color: theme.textSecondary }]}>
            {overallStats.totalSessions > 0 
              ? `Você já completou ${overallStats.totalSessions} ${overallStats.totalSessions === 1 ? 'sessão' : 'sessões'} de estudo, totalizando ${formatTotalTime(overallStats.focusMinutes)}. Continue assim!` 
              : 'Comece a estudar com o timer para registrar suas estatísticas!'}
          </Text>
        </View>
      </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  statsLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    opacity: 0.5,
  },
  sectionCard: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subjectStat: {
    marginBottom: 16,
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  subjectName: {
    flex: 1,
    fontSize: 16,
  },
  subjectTime: {
    fontSize: 14,
  },
  progressContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sessionCountText: {
    fontSize: 12,
  },
  percentageText: {
    fontSize: 12,
    textAlign: 'right',
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sessionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  sessionSubject: {
    fontSize: 16,
    fontWeight: '500',
  },
  sessionDate: {
    fontSize: 12,
  },
  sessionBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  sessionBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
    fontStyle: 'italic',
  },
  statsNote: {
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  }
});

export default StatsScreen;