import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useEstuday } from '@/contexts/StudayContext';
import { getMonthName, getDaysInMonth, getFirstDayOfMonth, createDateString, isToday } from '@/utils/dateUtils';
import { CalendarDay } from './CalendarDay';

interface CalendarProps {
  onDayPress: (date: string) => void;
}

export function Calendar({ onDayPress }: CalendarProps) {
  const { state } = useEstuday();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const hasEventsOnDate = (dateString: string) => {
    const compromissos = state.compromissos.filter(c => c.data === dateString);
    const anotacoes = state.anotacoes.filter(a => a.data === dateString);
    return compromissos.length > 0 || anotacoes.length > 0;
  };

  const renderCalendarWeeks = () => {
    const weeks = [];
    const totalCells = 42; // 6 semanas × 7 dias
    const allDays = [];
    
    // Espaços vazios para o início do mês
    for (let i = 0; i < firstDayOfMonth; i++) {
      allDays.push(null);
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      allDays.push(day);
    }
    
    // Preencher o resto com null para completar 42 células
    while (allDays.length < totalCells) {
      allDays.push(null);
    }
    
    // Dividir em semanas (6 semanas de 7 dias cada)
    for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
      const weekDays = [];
      
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const cellIndex = weekIndex * 7 + dayIndex;
        const day = allDays[cellIndex];
        
        if (day === null) {
          // Célula vazia
          weekDays.push(
            <View key={`empty-${cellIndex}`} style={styles.emptyDay} />
          );
        } else {
          // Dia com conteúdo
          const dateString = createDateString(year, month, day);
          const today = isToday(dateString);
          const hasEvents = hasEventsOnDate(dateString);
          
          weekDays.push(
            <CalendarDay
              key={`day-${day}`}
              day={day}
              dateString={dateString}
              isToday={today}
              hasEvents={hasEvents}
              onPress={onDayPress}
            />
          );
        }
      }
      
      // Adicionar a semana completa
      weeks.push(
        <View key={`week-${weekIndex}`} style={styles.weekRow}>
          {weekDays}
        </View>
      );
    }
    
    return weeks;
  };

  return (
    <View style={styles.container}>
      {/* Header do calendário */}
      <View style={styles.header}>
        <TouchableOpacity onPress={previousMonth} style={styles.navButton}>
          <ChevronLeft size={24} color="#3B82F6" />
        </TouchableOpacity>
        
        <Text style={styles.monthYear}>
          {getMonthName(month)} {year}
        </Text>
        
        <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
          <ChevronRight size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Dias da semana */}
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <View key={day} style={styles.weekDayCell}>
            <Text style={styles.weekDay}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Grid do calendário - Agora com 6 semanas fixas */}
      <View style={styles.calendarGrid}>
        {renderCalendarWeeks()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  monthYear: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDay: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  calendarGrid: {
    width: '100%',
  },
  weekRow: {
    flexDirection: 'row',
    width: '100%',
    height: 50, // Altura fixa para cada linha
  },
  emptyDay: {
    width: '14.285714%', // 100% / 7 = 14.285714%
    height: '100%',
  },
});