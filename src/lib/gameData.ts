import { NationName, SquadResult } from './types';

export type NationName = 
  | 'Canada' | 'Spagna' | 'Giappone' | 'Marocco' 
  | 'Messico' | 'Germania' | 'Svizzera' | 'Brasile' 
  | 'USA' | 'Portogallo' | 'Norvegia' | 'Belgio';

export interface SquadResult {
  wins: number;
  draws: number;
  losses: number;
  groupWin: boolean;
  advance: number; // Modificato da boolean a number per passaggi multipli
}

export const SQUAD_RESULTS: Record<NationName, SquadResult> = {
  'Canada':     { wins: 0, draws: 0, losses: 0, groupWin: false, advance: 0 },
  'Spagna':     { wins: 0, draws: 0, losses: 0, groupWin: false, advance: 0 },
  'Giappone':   { wins: 0, draws: 0, losses: 0, groupWin: false, advance: 0 },
  'Marocco':    { wins: 0, draws: 0, losses: 0, groupWin: false, advance: 0 },
  'Messico':    { wins: 0, draws: 0, losses: 0, groupWin: false, advance: 0 },
  'Germania':   { wins: 0, draws: 0, losses: 0, groupWin: false, advance: 0 },
  'Svizzera':   { wins: 0, draws: 0, losses: 0, groupWin: false, advance: 0 },
  'Brasile':    { wins: 0, draws: 0, losses: 0, groupWin: false, advance: 0 },
  'USA':        { wins: 0, draws: 0, losses: 0, groupWin: false, advance: 0 },
  'Portogallo': { wins: 0, draws: 0, losses: 0, groupWin: false, advance: 0 },
  'Norvegia':   { wins: 0, draws: 0, losses: 0, groupWin: false, advance: 0 },
  'Belgio':     { wins: 0, draws: 0, losses: 0, groupWin: false, advance: 0 },
};

export const TEAMS_DEFINITION = {
  'Vittorio/Giuseppe': ['Messico', 'Brasile', 'Giappone', 'Svizzera'],
  'Andrea': ['Canada', 'Germania', 'Portogallo', 'Belgio'],
  'Ciccio/Corrado/Gigi': ['Spagna', 'Marocco', 'USA', 'Norvegia']
};
