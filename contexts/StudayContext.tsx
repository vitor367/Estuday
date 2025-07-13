import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface Compromisso {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  categoria: 'aula' | 'prova' | 'trabalho' | 'outro';
  concluido: boolean;
  notificationId?: string;
}

export interface AnotacaoCalendario {
  id: string;
  data: string;
  texto: string;
}

interface EstudayState {
  compromissos: Compromisso[];
  anotacoes: AnotacaoCalendario[];
  loading: boolean;
}

type EstudayAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_DATA'; payload: { compromissos: Compromisso[]; anotacoes: AnotacaoCalendario[] } }
  | { type: 'ADD_COMPROMISSO'; payload: Compromisso }
  | { type: 'UPDATE_COMPROMISSO'; payload: Compromisso }
  | { type: 'DELETE_COMPROMISSO'; payload: string }
  | { type: 'ADD_ANOTACAO'; payload: AnotacaoCalendario }
  | { type: 'UPDATE_ANOTACAO'; payload: AnotacaoCalendario }
  | { type: 'DELETE_ANOTACAO'; payload: string };

const initialState: EstudayState = {
  compromissos: [],
  anotacoes: [],
  loading: false,
};

// Configurar notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function estudayReducer(state: EstudayState, action: EstudayAction): EstudayState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOAD_DATA':
      return {
        ...state,
        compromissos: action.payload.compromissos,
        anotacoes: action.payload.anotacoes,
        loading: false,
      };
    case 'ADD_COMPROMISSO':
      return {
        ...state,
        compromissos: [...state.compromissos, action.payload],
      };
    case 'UPDATE_COMPROMISSO':
      return {
        ...state,
        compromissos: state.compromissos.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_COMPROMISSO':
      return {
        ...state,
        compromissos: state.compromissos.filter(c => c.id !== action.payload),
      };
    case 'ADD_ANOTACAO':
      return {
        ...state,
        anotacoes: [...state.anotacoes, action.payload],
      };
    case 'UPDATE_ANOTACAO':
      return {
        ...state,
        anotacoes: state.anotacoes.map(a =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    case 'DELETE_ANOTACAO':
      return {
        ...state,
        anotacoes: state.anotacoes.filter(a => a.id !== action.payload),
      };
    default:
      return state;
  }
}

interface EstudayContextType {
  state: EstudayState;
  dispatch: React.Dispatch<EstudayAction>;
  addCompromisso: (compromisso: Omit<Compromisso, 'id'>) => Promise<void>;
  updateCompromisso: (compromisso: Compromisso) => Promise<void>;
  deleteCompromisso: (id: string) => Promise<void>;
  addAnotacao: (anotacao: Omit<AnotacaoCalendario, 'id'>) => Promise<void>;
  updateAnotacao: (anotacao: AnotacaoCalendario) => Promise<void>;
  deleteAnotacao: (id: string) => Promise<void>;
  getAnotacoesPorData: (data: string) => AnotacaoCalendario[];
  getCompromissosPorData: (data: string) => Compromisso[];
}

const EstudayContext = createContext<EstudayContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COMPROMISSOS: '@estuday:compromissos',
  ANOTACOES: '@estuday:anotacoes',
};

// Função para agendar notificação
const scheduleNotification = async (compromisso: Omit<Compromisso, 'id' | 'notificationId'>): Promise<string | undefined> => {
  if (Platform.OS === 'web') {
    return undefined;
  }

  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return undefined;
    }

    const compromissoDateTime = new Date(`${compromisso.data}T${compromisso.hora}`);
    const notificationTime = new Date(compromissoDateTime.getTime() - 24 * 60 * 60 * 1000); // 1 dia antes

    if (notificationTime <= new Date()) {
      return undefined; // Não agendar se a data já passou
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Lembrete de Compromisso',
        body: `${compromisso.titulo} está agendado para amanhã às ${compromisso.hora}`,
        data: { compromissoId: Date.now().toString() },
      },
      trigger: notificationTime,
    });

    return notificationId;
  } catch (error) {
    console.error('Erro ao agendar notificação:', error);
    return undefined;
  }
};

// Função para cancelar notificação
const cancelNotification = async (notificationId: string) => {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Erro ao cancelar notificação:', error);
  }
};

export function EstudayProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(estudayReducer, initialState);

  // Carregar dados do AsyncStorage
  useEffect(() => {
    loadData();
  }, []);

  // Salvar dados sempre que o estado mudar
  useEffect(() => {
    if (!state.loading && (state.compromissos.length > 0 || state.anotacoes.length > 0)) {
      saveData();
    }
  }, [state.compromissos, state.anotacoes]);

  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [compromissosData, anotacoesData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.COMPROMISSOS),
        AsyncStorage.getItem(STORAGE_KEYS.ANOTACOES),
      ]);

      const compromissos = compromissosData ? JSON.parse(compromissosData) : [];
      const anotacoes = anotacoesData ? JSON.parse(anotacoesData) : [];

      dispatch({ type: 'LOAD_DATA', payload: { compromissos, anotacoes } });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.COMPROMISSOS, JSON.stringify(state.compromissos)),
        AsyncStorage.setItem(STORAGE_KEYS.ANOTACOES, JSON.stringify(state.anotacoes)),
      ]);
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  const addCompromisso = async (compromisso: Omit<Compromisso, 'id'>) => {
    const notificationId = await scheduleNotification(compromisso);
    const novoCompromisso: Compromisso = {
      ...compromisso,
      id: Date.now().toString(),
      notificationId,
    };
    dispatch({ type: 'ADD_COMPROMISSO', payload: novoCompromisso });
  };

  const updateCompromisso = async (compromisso: Compromisso) => {
    // Cancelar notificação anterior se existir
    if (compromisso.notificationId) {
      await cancelNotification(compromisso.notificationId);
    }

    // Agendar nova notificação
    const notificationId = await scheduleNotification(compromisso);
    const compromissoAtualizado = { ...compromisso, notificationId };
    
    dispatch({ type: 'UPDATE_COMPROMISSO', payload: compromissoAtualizado });
  };

  const deleteCompromisso = async (id: string) => {
    const compromisso = state.compromissos.find(c => c.id === id);
    if (compromisso?.notificationId) {
      await cancelNotification(compromisso.notificationId);
    }
    dispatch({ type: 'DELETE_COMPROMISSO', payload: id });
  };

  const addAnotacao = async (anotacao: Omit<AnotacaoCalendario, 'id'>) => {
    const novaAnotacao: AnotacaoCalendario = {
      ...anotacao,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_ANOTACAO', payload: novaAnotacao });
  };

  const updateAnotacao = async (anotacao: AnotacaoCalendario) => {
    dispatch({ type: 'UPDATE_ANOTACAO', payload: anotacao });
  };

  const deleteAnotacao = async (id: string) => {
    dispatch({ type: 'DELETE_ANOTACAO', payload: id });
  };

  const getAnotacoesPorData = (data: string): AnotacaoCalendario[] => {
    return state.anotacoes.filter(anotacao => anotacao.data === data);
  };

  const getCompromissosPorData = (data: string): Compromisso[] => {
    return state.compromissos.filter(compromisso => compromisso.data === data);
  };

  return (
    <EstudayContext.Provider
      value={{
        state,
        dispatch,
        addCompromisso,
        updateCompromisso,
        deleteCompromisso,
        addAnotacao,
        updateAnotacao,
        deleteAnotacao,
        getAnotacoesPorData,
        getCompromissosPorData,
      }}
    >
      {children}
    </EstudayContext.Provider>
  );
}

export function useEstuday() {
  const context = useContext(EstudayContext);
  if (context === undefined) {
    throw new Error('useEstuday must be used within a EstudayProvider');
  }
  return context;
}