import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { Calendar, X } from 'lucide-react-native';
import { Calendar as CalendarComponent } from '../Calendar/Calendar';
import { applyDateMask, isValidDate, formatDateToBR, formatDateFromBR } from '@/utils/dateUtils';

interface DatePickerProps {
  value: string;
  onDateChange: (date: string) => void;
  placeholder?: string;
  label?: string;
}

export function DatePicker({ value, onDateChange, placeholder = "dd/mm/yyyy", label }: DatePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  
  // Função para obter data atual no formato ISO
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Inicializar inputValue corretamente
  const [inputValue, setInputValue] = useState(() => {
    if (value && value !== '') {
      return formatDateToBR(value);
    }
    // Se não há valor, usar data atual
    const currentDate = getCurrentDate();
    return formatDateToBR(currentDate);
  });

  // useEffect para sincronizar com mudanças externas do value
  useEffect(() => {
    if (value && value !== '') {
      setInputValue(formatDateToBR(value));
    } else {
      // Se value está vazio, inicializar com data atual
      const currentDate = getCurrentDate();
      setInputValue(formatDateToBR(currentDate));
      // Notificar o componente pai sobre a data atual
      onDateChange(currentDate);
    }
  }, [value, onDateChange]);

  const handleInputChange = (text: string) => {
    const maskedText = applyDateMask(text);
    setInputValue(maskedText);
    
    // Validar e converter para formato ISO quando completo
    if (maskedText.length === 10 && isValidDate(maskedText)) {
      const isoDate = formatDateFromBR(maskedText);
      onDateChange(isoDate);
    }
  };

  const handleCalendarSelect = (date: string) => {
    onDateChange(date);
    setInputValue(formatDateToBR(date));
    setModalVisible(false);
  };

  const openCalendar = () => {
    setModalVisible(true);
  };

  // Função para garantir que sempre temos uma data válida para exibir
  const getDisplayValue = () => {
    if (inputValue && inputValue !== placeholder) {
      return inputValue;
    }
    // Fallback para data atual
    return formatDateToBR(getCurrentDate());
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={openCalendar} style={styles.calendarIcon}>
          <Calendar size={20} color="#64748B" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          value={getDisplayValue()}
          onChangeText={handleInputChange}
          placeholder={placeholder}
          keyboardType="numeric"
          maxLength={10}
        />
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Data</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <CalendarComponent onDayPress={handleCalendarSelect} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  calendarIcon: {
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
});