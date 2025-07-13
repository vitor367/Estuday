import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, CreditCard as Edit3, Trash2, CircleCheck as CheckCircle, Circle } from 'lucide-react-native';
import { Compromisso } from '@/contexts/StudayContext';
import { formatDateBR } from '@/utils/dateUtils';

interface CompromissoCardProps {
  compromisso: Compromisso;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

const getCategoriaColor = (categoria: string) => {
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
};

const getCategoriaLabel = (categoria: string) => {
  switch (categoria) {
    case 'aula':
      return 'Aula';
    case 'prova':
      return 'Prova';
    case 'trabalho':
      return 'Trabalho';
    case 'outro':
      return 'Outro';
    default:
      return 'Outro';
  }
};

export function CompromissoCard({ compromisso, onEdit, onDelete, onToggleComplete }: CompromissoCardProps) {
  const categoriaColor = getCategoriaColor(compromisso.categoria);

  return (
    <View style={[styles.container, compromisso.concluido && styles.completed]}>
      {/* Header com título e ações */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onToggleComplete} style={styles.checkButton}>
          {compromisso.concluido ? (
            <CheckCircle size={20} color="#10B981" />
          ) : (
            <Circle size={20} color="#64748B" />
          )}
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={[styles.titulo, compromisso.concluido && styles.tituloCompleted]}>
            {compromisso.titulo}
          </Text>
          <View style={styles.categoria}>
            <View style={[styles.categoriaIndicator, { backgroundColor: categoriaColor }]} />
            <Text style={styles.categoriaText}>
              {getCategoriaLabel(compromisso.categoria)}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <Edit3 size={16} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Informações de data e hora */}
      <View style={styles.info}>
        <View style={styles.infoItem}>
          <Clock size={14} color="#64748B" />
          <Text style={styles.infoText}>
            {formatDateBR(compromisso.data)} às {compromisso.hora}
          </Text>
        </View>
      </View>

      {/* Descrição */}
      {compromisso.descricao && (
        <Text style={[styles.descricao, compromisso.concluido && styles.descricaoCompleted]}>
          {compromisso.descricao}
        </Text>
      )}

      {/* Barra lateral com cor da categoria */}
      <View style={[styles.sideBar, { backgroundColor: categoriaColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  completed: {
    opacity: 0.7,
    backgroundColor: '#F8FAFC',
  },
  sideBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkButton: {
    marginRight: 12,
    marginTop: 2,
  },
  titleContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  tituloCompleted: {
    textDecorationLine: 'line-through',
    color: '#64748B',
  },
  categoria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoriaIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoriaText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  info: {
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
  },
  descricao: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 18,
  },
  descricaoCompleted: {
    textDecorationLine: 'line-through',
  },
});