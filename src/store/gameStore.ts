import { create } from 'zustand';
import { SQUAD_RESULTS, SQUAD_RESULTS as initialResults, type SquadResult, type NationName } from '@/lib/gameData';
import { calculateScores } from '@/lib/scoring';

interface GameState {
  results: Record<NationName, SquadResult>;
  ranking: any;
  matches: any[];
  updateSquadField: (nation: NationName, field: keyof SquadResult, value: any) => void;
  resetToZero: () => void;
}

export const useGameStore = create<GameState>((set) => {
  // Carica i dati salvati o usa quelli di partenza a zero
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
    matches: [], // Gestito dal hook API o mock
    
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

    resetToZero: () => set(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('mundial_squad_results', JSON.stringify(initialResults));
      }
      return {
        results: initialResults,
        ranking: calculateScores(initialResults)
      };
    })
  };
});
