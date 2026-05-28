// ============================================================
// STORE GLOBALE (Zustand)
// ============================================================

import { create } from 'zustand';
import { MATCHES, SQUAD_RESULTS, type Match, type NationName, type SquadResult } from '@/lib/gameData';
import { calcRanking, type TeamScore } from '@/lib/scoring';

interface GameStore {
  matches: Match[];
  squadResults: Record<NationName, SquadResult>;
  ranking: TeamScore[];
  lastUpdated: Date | null;
  isLoading: boolean;

  // Actions
  updateSquadResult: (nation: NationName, result: Partial<SquadResult>) => void;
  updateMatch: (id: number, homeScore: number, awayScore: number, status: Match['status']) => void;
  refreshRanking: () => void;
  setLoading: (v: boolean) => void;
  setLastUpdated: (d: Date) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  matches: MATCHES,
  squadResults: SQUAD_RESULTS,
  ranking: calcRanking(),
  lastUpdated: null,
  isLoading: false,

  updateSquadResult: (nation, partial) => {
    set(state => ({
      squadResults: {
        ...state.squadResults,
        [nation]: { ...state.squadResults[nation], ...partial },
      },
    }));
    get().refreshRanking();
  },

  updateMatch: (id, homeScore, awayScore, status) => {
    set(state => ({
      matches: state.matches.map(m =>
        m.id === id ? { ...m, homeScore, awayScore, status } : m
      ),
    }));
  },

  refreshRanking: () => {
    set({ ranking: calcRanking() });
  },

  setLoading: (v) => set({ isLoading: v }),
  setLastUpdated: (d) => set({ lastUpdated: d }),
}));
