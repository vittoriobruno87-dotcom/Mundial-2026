'use client';
import { create } from 'zustand';
import { MATCHES, SQUAD_RESULTS, TEAMS, COEFFICIENTS, type Match, type NationName, type SquadResult } from '@/lib/gameData';

export interface SquadScore {
  nation: NationName;
  coefficient: number;
  matchPoints: number;
  bonusPoints: number;
  totalBeforeCoeff: number;
  finalScore: number;
  hasGroupBonus: boolean;
  hasAdvanceBonus: boolean;
}

export interface TeamScore {
  team: typeof TEAMS[0];
  squads: SquadScore[];
  totalScore: number;
  rank?: number;
}

function buildRanking(squadResults: Record<NationName, SquadResult>): TeamScore[] {
  return TEAMS
    .map(team => {
      const squads: SquadScore[] = team.squads.map(nation => {
        const r = squadResults[nation];
        const coeff = COEFFICIENTS[nation] ?? 1;
        if (!r) return { nation, coefficient: coeff, matchPoints: 0, bonusPoints: 0, totalBeforeCoeff: 0, finalScore: 0, hasGroupBonus: false, hasAdvanceBonus: false };
        const matchPoints = r.wins * 3 + r.draws;
        const bonusPoints = (r.groupWin ? 1.5 : 0) + (r.advance ? 3 : 0);
        const finalScore = (matchPoints + bonusPoints) * coeff;
        return { nation, coefficient: coeff, matchPoints, bonusPoints, totalBeforeCoeff: matchPoints + bonusPoints, finalScore, hasGroupBonus: r.groupWin, hasAdvanceBonus: r.advance };
      });
      const totalScore = squads.reduce((s, q) => s + q.finalScore, 0);
      return { team, squads, totalScore };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((ts, i) => ({ ...ts, rank: i + 1 }));
}

interface GameStore {
  matches: Match[];
  squadResults: Record<NationName, SquadResult>;
  ranking: TeamScore[];
  lastUpdated: Date | null;
  isLoading: boolean;
  updateSquadResult: (nation: NationName, result: Partial<SquadResult>) => void;
  updateMatch: (id: number, homeScore: number, awayScore: number, status: Match['status']) => void;
  setLoading: (v: boolean) => void;
  setLastUpdated: (d: Date) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  matches: MATCHES,
  squadResults: { ...SQUAD_RESULTS },
  ranking: buildRanking(SQUAD_RESULTS),
  lastUpdated: null,
  isLoading: false,

  updateSquadResult: (nation, partial) => {
    set(state => {
      const newResults = { ...state.squadResults, [nation]: { ...state.squadResults[nation], ...partial } };
      return { squadResults: newResults, ranking: buildRanking(newResults) };
    });
  },

  updateMatch: (id, homeScore, awayScore, status) => {
    set(state => ({
      matches: state.matches.map(m => m.id === id ? { ...m, homeScore, awayScore, status } : m),
    }));
  },

  setLoading: (v) => set({ isLoading: v }),
  setLastUpdated: (d) => set({ lastUpdated: d }),
}));
