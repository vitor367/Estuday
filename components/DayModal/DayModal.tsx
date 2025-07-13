import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { X, Plus, CreditCard as Edit3, Trash2, Clock, Calendar } from 'lucide-react-native';
import { useEstuday, Compromisso, AnotacaoCalendario } from '@/contexts/StudayContext';
import { formatDateBR } from '@/utils/dateUtils';

interface DayModalProps {
  visible: boolean;
  date: string;
  onClose: () => void;
}

export function DayModal({ visible, date, onClose }: DayModalProps) {
  const { getAnotacoesPorData, getCompromissosPorData, addAnotacao, updateAnotacao, deleteAnotacao } = useEstuday();
  const [anotacoes, setAnotacoes] = useState<AnotacaoCalendario[]>([]);
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [novaAnotacao, setNovaAnotacao] = useState('');
  const [editandoAnotacao, setEditandoAnotacao] = useState<string | null>(null);
  const [textoEdicao, setTextoEdicao] = useState('');

  useEffect(() => {
    if (visible && date) {
      setAnotacoes(getAnotacoesPorData(date));
      setCompromissos(getCompromissosPorData(date));
    }
  }, [visible, date]);

  const handleAddAnotacao = async () => {
    if (novaAnotacao.trim()) {
      await addAnotacao({
        data: date,
        texto: novaAnotacao.trim(),
      });
      setNovaAnotacao('');
      setAnotacoes(getAnotacoesPorData(date));
    }
  };

  const handleEditAnotacao = (anotacao: AnotacaoCalendario) => {
    setEditandoAnotacao(anotacao.id);
    setTextoEdicao(anotacao.texto);
  };

  const handleSaveEdit = async () => {
    if (editandoAnotacao && textoEdicao.trim()) {
      const anotacao = anotacoes.find(a => a.id === editandoAnotacao);
      if (anotacao) {
        await updateAnotacao({
          ...anotacao,
          texto: textoEdicao.trim(),
        });
        setEditandoAnotacao(null);
        setTextoEdicao('');
        setAnotacoes(getAnotacoesPorData(date));
      }
    }
  };

  const handleCancelEdit = () => {
    setEditandoAnotacao(null);
    setTextoEdicao('');
  };

  const handleDeleteAnotacao = (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta anotação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteAnotacao(id);
            setAnotacoes(getAnotacoesPorData(date));
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Calendar size={24} color="#3B82F6" />
            <Text style={styles.headerTitle}>
              {formatDateBR(date)}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Compromissos do dia */}
          {compromissos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Compromissos</Text>
              {compromissos.map((compromisso) => (
                <View key={compromisso.id} style={styles.compromissoItem}>
                  <View style={styles.compromissoHeader}>
                    <Text style={styles.compromissoTitulo}>{compromisso.titulo}</Text>
                    <View style={styles.compromissoTime}>
                      <Clock size={14} color="#64748B" />
                      <Text style={styles.compromissoHora}>{compromisso.hora}</Text>
                    </View>
                  </View>
                  {compromisso.descricao && (
                    <Text style={styles.compromissoDescricao}>{compromisso.descricao}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Anotações do dia */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Anotações</Text>
            
            {/* Adicionar nova anotação */}
            <View style={styles.addAnotacaoContainer}>
              <TextInput
                style={styles.addAnotacaoInput}
                placeholder="Adicionar anotação..."
                value={novaAnotacao}
                onChangeText={setNovaAnotacao}
                multiline
              />
              <TouchableOpacity
                onPress={handleAddAnotacao}
                style={styles.addButton}
                disabled={!novaAnotacao.trim()}
              >
                <Plus size={20} color={novaAnotacao.trim() ? "#fff" : "#64748B"} />
              </TouchableOpacity>
            </View>

            {/* Lista de anotações */}
            {anotacoes.map((anotacao) => (
              <View key={anotacao.id} style={styles.anotacaoItem}>
                {editandoAnotacao === anotacao.id ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      style={styles.editInput}
                      value={textoEdicao}
                      onChangeText={setTextoEdicao}
                      multiline
                      autoFocus
                    />
                    <View style={styles.editActions}>
                      <TouchableOpacity onPress={handleSaveEdit} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Salvar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.anotacaoContent}>
                    <Text style={styles.anotacaoTexto}>{anotacao.texto}</Text>
                    <View style={styles.anotacaoActions}>
                      <TouchableOpacity
                        onPress={() => handleEditAnotacao(anotacao)}
                        style={styles.actionButton}
                      >
                        <Edit3 size={16} color="#3B82F6" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteAnotacao(anotacao.id)}
                        style={styles.actionButton}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}

            {anotacoes.length === 0 && (
              <Text style={styles.emptyText}>Nenhuma anotação para este dia</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  compromissoItem: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  compromissoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  compromissoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  compromissoTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compromissoHora: {
    fontSize: 14,
    color: '#64748B',
  },
  compromissoDescricao: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  addAnotacaoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    gap: 8,
  },
  addAnotacaoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anotacaoItem: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  anotacaoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  anotacaoTexto: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    lineHeight: 20,
  },
  anotacaoActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
  actionButton: {
    padding: 4,
  },
  editContainer: {
    gap: 12,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#64748B',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
});