import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Calendar, Clock, CircleCheck as CheckCircle, TrendingUp } from 'lucide-react-native';
import { useEstuday } from '@/contexts/StudayContext';
import { formatDate, isFutureDate, isToday } from '@/utils/dateUtils';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { state } = useEstuday();

  // Estatísticas
  const compromissosHoje = state.compromissos.filter(c => isToday(c.data));
  const compromissosFuturos = state.compromissos.filter(c => isFutureDate(c.data) && !c.concluido);
  const compromissosConcluidos = state.compromissos.filter(c => c.concluido);
  const totalAnotacoes = state.anotacoes.length;

  const proximosCompromissos = compromissosFuturos
    .sort((a, b) => new Date(a.data + 'T' + a.hora).getTime() - new Date(b.data + 'T' + b.hora).getTime())
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá! 👋</Text>
            <Text style={styles.subtitle}>Como vão os estudos hoje?</Text>
          </View>
          <View style={styles.logoContainer}>
            <BookOpen size={32} color="#3B82F6" />
          </View>
        </View>

        {/* Cards de estatísticas */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
            <Calendar size={24} color="#3B82F6" />
            <Text style={styles.statNumber}>{compromissosHoje.length}</Text>
            <Text style={styles.statLabel}>Hoje</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
            <CheckCircle size={24} color="#10B981" />
            <Text style={styles.statNumber}>{compromissosConcluidos.length}</Text>
            <Text style={styles.statLabel}>Concluídos</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
            <Clock size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>{compromissosFuturos.length}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#F3E8FF' }]}>
            <TrendingUp size={24} color="#8B5CF6" />
            <Text style={styles.statNumber}>{totalAnotacoes}</Text>
            <Text style={styles.statLabel}>Anotações</Text>
          </View>
        </View>

        {/* Próximos compromissos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos Compromissos</Text>
            <TouchableOpacity 
              onPress={() => router.push('/compromissos')}
              style={styles.seeAllButton}
            >
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {proximosCompromissos.length > 0 ? (
            proximosCompromissos.map((compromisso) => (
              <TouchableOpacity
                key={compromisso.id}
                style={styles.compromissoItem}
                onPress={() => router.push('/compromissos')}
              >
                <View style={styles.compromissoContent}>
                  <Text style={styles.compromissoTitulo}>{compromisso.titulo}</Text>
                  <Text style={styles.compromissoData}>
                    {new Date(compromisso.data + 'T00:00:00').toLocaleDateString('pt-BR')} às {compromisso.hora}
                  </Text>
                </View>
                <View style={[
                  styles.categoriaIndicator,
                  { backgroundColor: getCategoriaColor(compromisso.categoria) }
                ]} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={48} color="#94A3B8" />
              <Text style={styles.emptyText}>Nenhum compromisso pendente</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/compromissos')}
              >
                <Text style={styles.addButtonText}>Adicionar compromisso</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Ações rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push('/calendar')}
            >
              <Calendar size={24} color="#3B82F6" />
              <Text style={styles.quickActionText}>Calendário</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push('/compromissos')}
            >
              <Clock size={24} color="#10B981" />
              <Text style={styles.quickActionText}>Compromissos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getCategoriaColor(categoria: string): string {
  switch (categoria) {
    case 'aula':
      return '#3B82F6';
    case 'prova':
      return '#EF4444';
    case 'trabalho':
      return '#F97316';
    case 'outro':
      return '#8B5CF6';
    default:
      return '#64748B';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  logoContainer: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  compromissoItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  compromissoContent: {
    flex: 1,
  },
  compromissoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  compromissoData: {
    fontSize: 14,
    color: '#64748B',
  },
  categoriaIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
});