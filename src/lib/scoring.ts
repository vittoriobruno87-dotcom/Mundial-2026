import { SQUAD_RESULTS, type SquadResult, type NationName, type TeamName } from './gameData';

// Funzione di utilità per formattare il punteggio
export function formatScore(score: number): string {
  return score.toFixed(1).replace('.0', '');
}

// Trova il proprietario di una nazione partendo dai dati statici
export function findNationOwner(nation: NationName): TeamName {
  for (const [team, data] of Object.entries(SQUAD_RESULTS)) {
    // Cerchiamo se la nazione è presente nell'array delle squadre associate
    // Nota: usiamo una ricerca difensiva per evitare crash in fase di build
    const squads = (data as any).squads || [];
    if (squads.includes(nation)) {
      return team as TeamName;
    }
  }
  return "Senza Proprietario" as TeamName;
}

export function calculateScores(results: Record<NationName, SquadResult>) {
  // Controllo di sicurezza fondamentale per il prerendering di Next.js
  if (!results || Object.keys(results).length === 0) {
    return [];
  }

  // Mappa di supporto per aggregare i dati dei 4 partecipanti reali
  const teamAggregates: Record<string, { id: string; name: string; totalScore: number; squads: any[] }> = {
    'Vittorio': { id: 'vittorio', name: 'Vittorio', totalScore: 0, squads: [] },
    'Andrea': { id: 'andrea', name: 'Andrea', totalScore: 0, squads: [] },
    'Stefano': { id: 'stefano', name: 'Stefano', totalScore: 0, squads: [] },
    'Albi': { id: 'albi', name: 'Albi', totalScore: 0, squads: [] }
  };

  // Calcola i punti per ciascuna nazione e associala al rispettivo proprietario
  for (const [nation, data] of Object.entries(results)) {
    const wins = data.wins || 0;
    const draws = data.draws || 0;
    const losses = data.losses || 0;
    const advance = data.advance || 0;
    const groupWin = data.groupWin ? 1 : 0;

    // Formula: 3pt vittoria, 1pt pareggio + 3pt vittoria girone + (5pt * numero passaggi turno)
    const points = (wins * 3) + (draws * 1) + (groupWin * 3) + (advance * 5);
    const owner = findNationOwner(nation as NationName);

    if (teamAggregates[owner]) {
      teamAggregates[owner].totalScore += points;
      teamAggregates[owner].squads.push({
        nation,
        wins,
        draws,
        losses,
        groupWin: data.groupWin,
        advance,
        score: points
      });
    }
  }

  // Restituisce l'array ordinato dal punteggio più alto al più basso per la classifica
  return Object.values(teamAggregates).sort((a, b) => b.totalScore - a.totalScore);
}
