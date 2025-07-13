import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, BookOpen, Settings, Info, Trash2, ChartBar as BarChart3 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEstuday } from '@/contexts/StudayContext';

export default function ProfileScreen() {
  const { state, dispatch } = useEstuday();

  const handleClearData = () => {
    Alert.alert(
      'Limpar todos os dados',
      'Esta ação irá remover todos os seus compromissos e anotações. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                '@estuday:compromissos',
                '@estuday:anotacoes',
              ]);
              dispatch({ type: 'LOAD_DATA', payload: { compromissos: [], anotacoes: [] } });
              Alert.alert('Sucesso', 'Todos os dados foram removidos.');
            } catch (error) {
              Alert.alert('Erro', 'Erro ao limpar os dados. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  const stats = {
    totalCompromissos: state.compromissos.length,
    compromissosConcluidos: state.compromissos.filter(c => c.concluido).length,
    totalAnotacoes: state.anotacoes.length,
    taxaConclusao: state.compromissos.length > 0 
      ? Math.round((state.compromissos.filter(c => c.concluido).length / state.compromissos.length) * 100)
      : 0,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <User size={40} color="#3B82F6" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Estudante</Text>
              <Text style={styles.profileSubtitle}>Usuário do Estuday</Text>
            </View>
          </View>
        </View>

        {/* Estatísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <BookOpen size={24} color="#3B82F6" />
              <Text style={styles.statNumber}>{stats.totalCompromissos}</Text>
              <Text style={styles.statLabel}>Total de Compromissos</Text>
            </View>
            
            <View style={styles.statCard}>
              <BarChart3 size={24} color="#10B981" />
              <Text style={styles.statNumber}>{stats.compromissosConcluidos}</Text>
              <Text style={styles.statLabel}>Concluídos</Text>
            </View>
            
            <View style={styles.statCard}>
              <Settings size={24} color="#F59E0B" />
              <Text style={styles.statNumber}>{stats.totalAnotacoes}</Text>
              <Text style={styles.statLabel}>Anotações</Text>
            </View>
            
            <View style={styles.statCard}>
              <BarChart3 size={24} color="#8B5CF6" />
              <Text style={styles.statNumber}>{stats.taxaConclusao}%</Text>
              <Text style={styles.statLabel}>Taxa de Conclusão</Text>
            </View>
          </View>
        </View>

        {/* Sobre o App */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o Estuday</Text>
          
          <View style={styles.infoCard}>
            <Info size={20} color="#3B82F6" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Versão do App</Text>
              <Text style={styles.infoText}>1.0.0</Text>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <BookOpen size={20} color="#10B981" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Sobre o Estuday</Text>
              <Text style={styles.infoText}>
                O Estuday é seu companheiro de estudos, ajudando você a organizar compromissos, 
                fazer anotações e manter o foco nos seus objetivos acadêmicos.
              </Text>
            </View>
          </View>
        </View>

        {/* Configurações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <TouchableOpacity style={styles.dangerCard} onPress={handleClearData}>
            <Trash2 size={20} color="#EF4444" />
            <View style={styles.infoContent}>
              <Text style={styles.dangerTitle}>Limpar todos os dados</Text>
              <Text style={styles.dangerText}>
                Remove todos os compromissos e anotações. Esta ação não pode ser desfeita.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Desenvolvido com ❤️ para estudantes
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
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
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  dangerCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 4,
  },
  dangerText: {
    fontSize: 14,
    color: '#991B1B',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});