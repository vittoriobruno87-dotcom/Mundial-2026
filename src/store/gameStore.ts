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
  updateSquadResult: (nation: NationName, updatedData: SquadResult) => void; // Aggiunto alias per useFootballData.ts
  updateMatch: (matchId: number, updatedFields: any) => void; // Aggiunto per evitare errori futuri su updateMatch
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

    // Implementazione dell'alias richiesto alla riga 18 di useFootballData.ts
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

    // Semplice mock per updateMatch richiesto da useFootballData per evitare errori di compilazione
    updateMatch: (matchId, updatedFields) => set((state) => {
      const updatedMatches = state.matches.map(m => m.id === matchId ? { ...m, ...updatedFields } : m);
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
