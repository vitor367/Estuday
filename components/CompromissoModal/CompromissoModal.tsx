import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { X, Clock, Tag } from 'lucide-react-native';
import { useEstuday, Compromisso } from '@/contexts/StudayContext';
import { formatDate } from '@/utils/dateUtils';
import { DatePicker } from '@/components/DatePicker/DatePicker';

interface CompromissoModalProps {
  visible: boolean;
  compromisso?: Compromisso | null;
  onClose: () => void;
  onSave: () => void;
}

const categorias = [
  { value: 'aula', label: 'Aula', color: '#3B82F6' },
  { value: 'prova', label: 'Prova', color: '#EF4444' },
  { value: 'trabalho', label: 'Trabalho', color: '#F97316' },
  { value: 'outro', label: 'Outro', color: '#8B5CF6' },
] as const;

export function CompromissoModal({ visible, compromisso, onClose, onSave }: CompromissoModalProps) {
  const { addCompromisso, updateCompromisso } = useEstuday();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [categoria, setCategoria] = useState<'aula' | 'prova' | 'trabalho' | 'outro'>('aula');

  const isEditing = !!compromisso;

  useEffect(() => {
    if (compromisso) {
      setTitulo(compromisso.titulo);
      setDescricao(compromisso.descricao);
      setData(compromisso.data);
      setHora(compromisso.hora);
      setCategoria(compromisso.categoria);
    } else {
      // Reset para novo compromisso
      setTitulo('');
      setDescricao('');
      setData(formatDate(new Date()));
      setHora('08:00');
      setCategoria('aula');
    }
  }, [compromisso, visible]);

  const handleSave = async () => {
    if (!titulo.trim()) {
      Alert.alert('Erro', 'Por favor, digite um título para o compromisso.');
      return;
    }

    if (!data) {
      Alert.alert('Erro', 'Por favor, selecione uma data.');
      return;
    }

    if (!hora) {
      Alert.alert('Erro', 'Por favor, selecione um horário.');
      return;
    }

    try {
      const compromissoData = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        data,
        hora,
        categoria,
        concluido: compromisso?.concluido || false,
      };

      if (isEditing && compromisso) {
        await updateCompromisso({
          ...compromissoData,
          id: compromisso.id,
          notificationId: compromisso.notificationId,
        });
      } else {
        await addCompromisso(compromissoData);
      }

      onSave();
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar compromisso. Tente novamente.');
    }
  };

  const getCategoriaColor = (cat: string) => {
    return categorias.find(c => c.value === cat)?.color || '#64748B';
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Editar Compromisso' : 'Novo Compromisso'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Título */}
          <View style={styles.field}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Digite o título do compromisso"
              autoFocus
            />
          </View>

          {/* Descrição */}
          <View style={styles.field}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Digite uma descrição (opcional)"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Data com DatePicker */}
          <View style={styles.field}>
            <DatePicker
              label="Data *"
              value={data}
              onDateChange={setData}
              placeholder="dd/mm/yyyy"
            />
          </View>

          {/* Horário */}
          <View style={styles.field}>
            <Text style={styles.label}>Horário *</Text>
            <View style={styles.inputWithIcon}>
              <Clock size={20} color="#64748B" />
              <TextInput
                style={styles.inputIcon}
                value={hora}
                onChangeText={setHora}
                placeholder="HH:MM"
              />
            </View>
          </View>

          {/* Categoria */}
          <View style={styles.field}>
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.categoriaGrid}>
              {categorias.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoriaButton,
                    { borderColor: cat.color },
                    categoria === cat.value && { backgroundColor: cat.color },
                  ]}
                  onPress={() => setCategoria(cat.value)}
                >
                  <Tag size={16} color={categoria === cat.value ? '#fff' : cat.color} />
                  <Text
                    style={[
                      styles.categoriaText,
                      { color: categoria === cat.value ? '#fff' : cat.color },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Salvar' : 'Criar'}
            </Text>
          </TouchableOpacity>
        </View>
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
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  inputIcon: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  categoriaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoriaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 20,
    gap: 6,
  },
  categoriaText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});