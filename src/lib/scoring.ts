import { SQUAD_RESULTS, TEAMS_DEFINITION, NationName } from './gameData';

export interface TeamScore {
  name: string;
  points: number;
  details: Record<string, number>;
}

// Funzione richiesta per colorare i pallini delle vostre squadre
export function findNationOwner(nationName: string): string | null {
  for (const [teamName, nations] of Object.entries(TEAMS_DEFINITION)) {
    if (nations.includes(nationName)) {
      return teamName;
    }
  }
  return null;
}

// Funzione richiesta da RankingTab.tsx per formattare il testo dei punteggi
export function formatScore(points: number): string {
  return `${points} pt${points !== 1 ? 's' : ''}`;
}

export function calculateScores(currentResults: typeof SQUAD_RESULTS) {
  const POINTS_PER_WIN = 3;
  const POINTS_PER_DRAW = 1;
  const BONUS_GROUP_WIN = 5;
  const BONUS_ADVANCE = 3; // Punti per CIASCUN passaggio del turno

  const scores: Record<string, TeamScore> = {};

  Object.entries(TEAMS_DEFINITION).forEach(([teamName, nations]) => {
    let totalPoints = 0;
    const details: Record<string, number> = {};

    nations.forEach((nation) => {
      const res = currentResults[nation as NationName] || { wins: 0, draws: 0, losses: 0, groupWin: false, advance: 0 };
      
      const matchPoints = (res.wins * POINTS_PER_WIN) + (res.draws * POINTS_PER_DRAW);
      const groupBonus = res.groupWin ? BONUS_GROUP_WIN : 0;
      const advanceBonus = (res.advance || 0) * BONUS_ADVANCE; // Moltiplica per il numero di passaggi

      const nationTotal = matchPoints + groupBonus + advanceBonus;
      totalPoints += nationTotal;
      details[nation] = nationTotal;
    });

    scores[teamName] = {
      name: teamName,
      points: totalPoints,
      details
    };
  });

  return scores;
}
