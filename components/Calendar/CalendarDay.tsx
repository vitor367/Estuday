import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface CalendarDayProps {
  day: number;
  dateString: string;
  isToday: boolean;
  hasEvents: boolean;
  onPress: (date: string) => void;
}

export function CalendarDay({ day, dateString, isToday, hasEvents, onPress }: CalendarDayProps) {
  return (
    <TouchableOpacity
      style={[
        styles.dayContainer,
        isToday && styles.today,
      ]}
      onPress={() => onPress(dateString)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.dayText,
        isToday && styles.todayText,
      ]}>
        {day}
      </Text>
      {hasEvents && (
        <View style={[
          styles.eventIndicator,
          isToday && styles.eventIndicatorToday,
        ]} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dayContainer: {
    width: '14.285714%', // 100% / 7 = 14.285714%
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 8,
    // CORREÇÃO: Removido margin: 1 que estava causando overflow
    // margin: 1,
  },
  today: {
    backgroundColor: '#3B82F6',
  },
  dayText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  todayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F97316',
  },
  eventIndicatorToday: {
    backgroundColor: '#FFF',
  },
});