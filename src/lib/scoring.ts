import { COEFFICIENTS, SQUAD_RESULTS, TEAMS, type NationName, type SquadResult, type Team } from './gameData';

export interface SquadScore {
  nation: NationName;
  coefficient: number;
  matchPoints: number;
  bonusPoints: number;
  totalBeforeCoeff: number;
  finalScore: number;
  hasGroupBonus: boolean;
  advanceCount: number;
  hasFinalistBonus: boolean;
  hasChampionBonus: boolean;
}

export interface TeamScore {
  team: Team;
  squads: SquadScore[];
  totalScore: number;
  rank?: number;
}

export function calcSquadScore(nation: NationName, result?: SquadResult): SquadScore {
  const r = result ?? SQUAD_RESULTS[nation];
  const coeff = COEFFICIENTS[nation] ?? 1;

  if (!r) {
    return {
      nation, coefficient: coeff, matchPoints: 0, bonusPoints: 0,
      totalBeforeCoeff: 0, finalScore: 0,
      hasGroupBonus: false, advanceCount: 0,
      hasFinalistBonus: false, hasChampionBonus: false,
    };
  }

  const matchPoints = r.wins * 3 + r.draws * 1;

  let bonusPoints = 0;
  if (r.groupWin) bonusPoints += 3;
  bonusPoints += (r.advance ?? 0) * 3;
  if (r.finalist) bonusPoints += 5;
  if (r.champion) bonusPoints += 15;

  const totalBeforeCoeff = matchPoints + bonusPoints;
  const finalScore = (matchPoints * coeff) + bonusPoints;

  return {
    nation, coefficient: coeff, matchPoints, bonusPoints,
    totalBeforeCoeff, finalScore,
    hasGroupBonus: r.groupWin,
    advanceCount: r.advance ?? 0,
    hasFinalistBonus: r.finalist,
    hasChampionBonus: r.champion,
  };
}

export function calcTeamScore(team: Team): TeamScore {
  const squads = team.squads.map(nation => calcSquadScore(nation));
  const totalScore = squads.reduce((sum, s) => sum + s.finalScore, 0);
  return { team, squads, totalScore };
}

export function calcRanking(): TeamScore[] {
  return TEAMS
    .map(calcTeamScore)
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((ts, i) => ({ ...ts, rank: i + 1 }));
}

export function findNationOwner(nation: NationName): Team | undefined {
  return TEAMS.find(t => t.squads.includes(nation));
}

export function formatScore(score: number): string {
  return score % 1 === 0 ? score.toString() : score.toFixed(1);
}
