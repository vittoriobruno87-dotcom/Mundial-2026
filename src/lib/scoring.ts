// ============================================================
// LOGICA DI CALCOLO PUNTEGGIO
// ============================================================

import {
  COEFFICIENTS,
  SQUAD_RESULTS,
  TEAMS,
  type NationName,
  type SquadResult,
  type Team,
} from './gameData';

export interface SquadScore {
  nation: NationName;
  coefficient: number;
  matchPoints: number;    // punti grezzi (V=3, P=1, S=0)
  bonusPoints: number;    // bonus girone + passaggio turno
  totalBeforeCoeff: number;
  finalScore: number;
  hasGroupBonus: boolean;
  hasAdvanceBonus: boolean;
}

export interface TeamScore {
  team: Team;
  squads: SquadScore[];
  totalScore: number;
  rank?: number;
}

// Calcola i punti di una singola squadra nazionale
export function calcSquadScore(nation: NationName, result?: SquadResult): SquadScore {
  const r = result ?? SQUAD_RESULTS[nation];
  const coeff = COEFFICIENTS[nation] ?? 1;

  if (!r) {
    return {
      nation, coefficient: coeff,
      matchPoints: 0, bonusPoints: 0,
      totalBeforeCoeff: 0, finalScore: 0,
      hasGroupBonus: false, hasAdvanceBonus: false,
    };
  }

  const matchPoints = r.wins * 3 + r.draws * 1;
  let bonusPoints = 0;
  if (r.groupWin) bonusPoints += 1.5;
  if (r.advance) bonusPoints += 3;

  const totalBeforeCoeff = matchPoints + bonusPoints;
  const finalScore = totalBeforeCoeff * coeff;

  return {
    nation,
    coefficient: coeff,
    matchPoints,
    bonusPoints,
    totalBeforeCoeff,
    finalScore,
    hasGroupBonus: r.groupWin,
    hasAdvanceBonus: r.advance,
  };
}

// Calcola il punteggio totale di un team
export function calcTeamScore(team: Team): TeamScore {
  const squads = team.squads.map(nation => calcSquadScore(nation));
  const totalScore = squads.reduce((sum, s) => sum + s.finalScore, 0);

  return { team, squads, totalScore };
}

// Calcola e ordina tutti i team per la classifica
export function calcRanking(): TeamScore[] {
  return TEAMS
    .map(calcTeamScore)
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((ts, i) => ({ ...ts, rank: i + 1 }));
}

// Trova il team proprietario di una nazionale
export function findNationOwner(nation: NationName): Team | undefined {
  return TEAMS.find(t => t.squads.includes(nation));
}

// Formatta il punteggio per visualizzazione
export function formatScore(score: number): string {
  return score % 1 === 0 ? score.toString() : score.toFixed(1);
}
