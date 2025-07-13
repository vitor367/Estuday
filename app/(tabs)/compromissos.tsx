import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Filter, Calendar as CalendarIcon, FileText, Clock } from 'lucide-react-native';
import { useEstuday, Compromisso } from '@/contexts/StudayContext';
import { CompromissoCard } from '@/components/CompromissoCard/CompromissoCard';
import { CompromissoModal } from '@/components/CompromissoModal/CompromissoModal';
import { isFutureDate } from '@/utils/dateUtils';

type FilterType = 'todos' | 'pendentes' | 'concluidos' | 'hoje';
type TabType = 'compromissos' | 'anotacoes';

export default function CompromissosScreen() {
  const { state, updateCompromisso, deleteCompromisso, deleteAnotacao } = useEstuday();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCompromisso, setEditingCompromisso] = useState<Compromisso | null>(null);
  const [filter, setFilter] = useState<FilterType>('pendentes');
  const [activeTab, setActiveTab] = useState<TabType>('compromissos');

  const filteredCompromissos = useMemo(() => {
    let filtered = state.compromissos;

    switch (filter) {
      case 'pendentes':
        filtered = filtered.filter(c => isFutureDate(c.data) && !c.concluido);
        break;
      case 'concluidos':
        filtered = filtered.filter(c => c.concluido);
        break;
      case 'hoje':
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(c => c.data === today);
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.data + 'T' + a.hora);
      const dateB = new Date(b.data + 'T' + b.hora);
      return dateA.getTime() - dateB.getTime();
    });
  }, [state.compromissos, filter]);

  const filteredAnotacoes = useMemo(() => {
    return state.anotacoes.sort((a, b) => {
      return new Date(b.data).getTime() - new Date(a.data).getTime();
    });
  }, [state.anotacoes]);

  const handleAddCompromisso = () => {
    setEditingCompromisso(null);
    setModalVisible(true);
  };

  const handleEditCompromisso = (compromisso: Compromisso) => {
    setEditingCompromisso(compromisso);
    setModalVisible(true);
  };

  const handleDeleteCompromisso = (compromisso: Compromisso) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir "${compromisso.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteCompromisso(compromisso.id),
        },
      ]
    );
  };

  const handleDeleteAnotacao = (id: string, texto: string) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir esta anotação?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteAnotacao(id),
        },
      ]
    );
  };

  const handleToggleComplete = (compromisso: Compromisso) => {
    updateCompromisso({
      ...compromisso,
      concluido: !compromisso.concluido,
    });
  };

  const handleModalSave = () => {
    setEditingCompromisso(null);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingCompromisso(null);
  };

  const filterButtons = [
    { key: 'pendentes', label: 'Pendentes' },
    { key: 'hoje', label: 'Hoje' },
    { key: 'concluidos', label: 'Concluídos' },
    { key: 'todos', label: 'Todos' },
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <CalendarIcon size={24} color="#3B82F6" />
          <Text style={styles.headerTitle}>Compromissos</Text>
        </View>
        {activeTab === 'compromissos' && (
          <TouchableOpacity onPress={handleAddCompromisso} style={styles.addButton}>
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Abas */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'compromissos' && styles.activeTab]}
          onPress={() => setActiveTab('compromissos')}
        >
          <Clock size={16} color={activeTab === 'compromissos' ? '#3B82F6' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'compromissos' && styles.activeTabText]}>
            Compromissos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'anotacoes' && styles.activeTab]}
          onPress={() => setActiveTab('anotacoes')}
        >
          <FileText size={16} color={activeTab === 'anotacoes' ? '#3B82F6' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'anotacoes' && styles.activeTabText]}>
            Anotações
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtros - apenas para compromissos */}
      {activeTab === 'compromissos' && (
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          >
            {filterButtons.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => setFilter(item.key)}
                style={[
                  styles.filterButton,
                  filter === item.key && styles.filterButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filter === item.key && styles.filterButtonTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Conteúdo */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'compromissos' ? (
          // Lista de compromissos
          filteredCompromissos.length > 0 ? (
            filteredCompromissos.map((compromisso) => (
              <CompromissoCard
                key={compromisso.id}
                compromisso={compromisso}
                onEdit={() => handleEditCompromisso(compromisso)}
                onDelete={() => handleDeleteCompromisso(compromisso)}
                onToggleComplete={() => handleToggleComplete(compromisso)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <CalendarIcon size={64} color="#CBD5E1" />
              <Text style={styles.emptyText}>
                {filter === 'pendentes' && 'Nenhum compromisso pendente'}
                {filter === 'hoje' && 'Nenhum compromisso para hoje'}
                {filter === 'concluidos' && 'Nenhum compromisso concluído'}
                {filter === 'todos' && 'Nenhum compromisso cadastrado'}
              </Text>
              <TouchableOpacity onPress={handleAddCompromisso} style={styles.emptyButton}>
                <Text style={styles.emptyButtonText}>Adicionar compromisso</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          // Lista de anotações
          filteredAnotacoes.length > 0 ? (
            filteredAnotacoes.map((anotacao) => (
              <View key={anotacao.id} style={styles.anotacaoCard}>
                <View style={styles.anotacaoHeader}>
                  <Text style={styles.anotacaoData}>
                    {new Date(anotacao.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteAnotacao(anotacao.id, anotacao.texto)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.anotacaoTexto}>{anotacao.texto}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <FileText size={64} color="#CBD5E1" />
              <Text style={styles.emptyText}>Nenhuma anotação encontrada</Text>
              <Text style={styles.emptySubtext}>
                Adicione anotações através do calendário
              </Text>
            </View>
          )
        )}
      </ScrollView>

      {/* Modal de compromisso */}
      <CompromissoModal
        visible={modalVisible}
        compromisso={editingCompromisso}
        onClose={handleCloseModal}
        onSave={handleModalSave}
      />
    </SafeAreaView>
  );
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 250,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 250,
  },
  emptyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  anotacaoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  anotacaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  anotacaoData: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  anotacaoTexto: {
    fontSize: 16,
    color: '#1E293B',
    lineHeight: 20,
  },
});