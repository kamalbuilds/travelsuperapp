import { UserPreferences } from '@/components/PreferenceForm';
import React, { createContext, ReactNode, useContext, useReducer } from 'react';

interface Trip {
  id: string;
  destination: string;
  airline: string;
  hotel: string;
  price: string;
  duration: string;
  image: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  date: string;
  paymentMethod?: string;
}

interface AppState {
  userPreferences: UserPreferences | null;
  trips: Trip[];
  isOnboarded: boolean;
  currentUser: {
    name: string;
    email: string;
  } | null;
}

type AppAction =
  | { type: 'SET_PREFERENCES'; payload: UserPreferences }
  | { type: 'ADD_TRIP'; payload: Trip }
  | { type: 'UPDATE_TRIP'; payload: { id: string; updates: Partial<Trip> } }
  | { type: 'SET_ONBOARDED'; payload: boolean }
  | { type: 'SET_USER'; payload: { name: string; email: string } | null };

const initialState: AppState = {
  userPreferences: null,
  trips: [],
  isOnboarded: false,
  currentUser: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PREFERENCES':
      return {
        ...state,
        userPreferences: action.payload,
      };
    case 'ADD_TRIP':
      return {
        ...state,
        trips: [...state.trips, action.payload],
      };
    case 'UPDATE_TRIP':
      return {
        ...state,
        trips: state.trips.map(trip =>
          trip.id === action.payload.id
            ? { ...trip, ...action.payload.updates }
            : trip
        ),
      };
    case 'SET_ONBOARDED':
      return {
        ...state,
        isOnboarded: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.payload,
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 