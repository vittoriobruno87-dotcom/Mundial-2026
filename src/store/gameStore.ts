import { create } from 'zustand';
import { SQUAD_RESULTS, SQUAD_RESULTS as initialResults, type SquadResult, type NationName } from '@/lib/gameData';
import { calculateScores } from '@/lib/scoring';

interface GameState {
  results: Record<NationName, SquadResult>;
  ranking: any;
  matches: any[];
  isLoading: boolean;
  lastUpdated: string | null;
  updateSquadField: (nation: NationName, field: keyof SquadResult, value: any) => void;
  updateSquadResult: (nation: NationName, updatedData: SquadResult) => void;
  updateMatch: (matchId: number, homeScore: number, awayScore: number, status: 'NS' | 'LIVE' | 'FT') => void; // Allineato a 4 argomenti
  setLoading: (loading: boolean) => void;
  setLastUpdated: (dateStr: string) => void;
  resetToZero: () => void;
}

export const useGameStore = create<GameState>((set) => {
  const getInitialResults = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mundial_squad_results');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return initialResults;
  };

  const startingResults = getInitialResults();

  return {
    results: startingResults,
    ranking: calculateScores(startingResults),
    matches: [],
    isLoading: false,
    lastUpdated: null,
    
    updateSquadField: (nation, field, value) => set((state) => {
      const updatedSquad = { ...state.results[nation], [field]: value };
      const updatedResults = { ...state.results, [nation]: updatedSquad };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('mundial_squad_results', JSON.stringify(updatedResults));
      }

      return {
        results: updatedResults,
        ranking: calculateScores(updatedResults)
      };
    }),

    updateSquadResult: (nation, updatedData) => set((state) => {
      const updatedResults = { ...state.results, [nation]: updatedData };
      if (typeof window !== 'undefined') {
        localStorage.setItem('mundial_squad_results', JSON.stringify(updatedResults));
      }
      return {
        results: updatedResults,
        ranking: calculateScores(updatedResults)
      };
    }),

    // Implementazione corretta a 4 argomenti per rispondere alla riga 51 di useFootballData.ts
    updateMatch: (matchId, homeScore, awayScore, status) => set((state) => {
      const updatedMatches = state.matches.map(m => 
        m.id === matchId ? { ...m, homeScore, awayScore, status } : m
      );
      return { matches: updatedMatches };
    }),

    setLoading: (loading) => set({ isLoading: loading }),
    setLastUpdated: (dateStr) => set({ lastUpdated: dateStr }),

    resetToZero: () => set(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('mundial_squad_results', JSON.stringify(initialResults));
      }
      return {
        results: initialResults,
        ranking: calculateScores(initialResults),
        isLoading: false,
        lastUpdated: null
      };
    })
  };
});
        lastUpdated: null
      };
    })
  };
});
