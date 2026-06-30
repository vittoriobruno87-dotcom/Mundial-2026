import { SQUAD_RESULTS, TEAMS_DEFINITION, type SquadResult, type NationName } from './gameData';

// Funzione di utilità per formattare il punteggio
export function formatScore(score: number): string {
  return `${score} pt${score !== 1 ? 's' : ''}`;
}

// Trova il proprietario di una nazione basandosi sulla definizione dei team
export function findNationOwner(nationName: string): string {
  if (!TEAMS_DEFINITION) return "Senza Proprietario";
  
  for (const [teamName, nations] of Object.entries(TEAMS_DEFINITION)) {
    if (Array.isArray(nations) && nations.includes(nationName)) {
      return teamName;
    }
  }
  return "Senza Proprietario";
}

export function calculateScores(results: Record<NationName, SquadResult>) {
  // Mappa di supporto iniziale per i 4 partecipanti reali
  const teamAggregates: Record<string, { id: string; name: string; team: { id: string; name: string }; totalScore: number; points: number; squads: any[] }> = {
    'Vittorio': { id: 'vittorio', name: 'Vittorio', team: { id: 'vittorio', name: 'Vittorio' }, totalScore: 0, points: 0, squads: [] },
    'Andrea': { id: 'andrea', name: 'Andrea', team: { id: 'andrea', name: 'Andrea' }, totalScore: 0, points: 0, squads: [] },
    'Stefano': { id: 'stefano', name: 'Stefano', team: { id: 'stefano', name: 'Stefano' }, totalScore: 0, points: 0, squads: [] },
    'Albi': { id: 'albi', name: 'Albi', team: { id: 'albi', name: 'Albi' }, totalScore: 0, points: 0, squads: [] }
  };

  // Se i risultati non sono ancora pronti (fase di prerender statico), restituiamo subito i team base vuoti
  if (!results || Object.keys(results).length === 0) {
    return Object.values(teamAggregates);
  }

  // Iteriamo su tutte le nazioni presenti nei risultati
  for (const [nation, data] of Object.entries(results)) {
    if (!data) continue;
    
    const wins = data.wins || 0;
    const draws = data.draws || 0;
    const losses = data.losses || 0;
    const advance = data.advance || 0;
    const groupWin = data.groupWin ? 1 : 0;

    // Formula punti aggiornata: 3pt vittoria, 1pt pareggio, 3pt vittoria girone, 5pt per ogni passaggio turno
    const points = (wins * 3) + (draws * 1) + (groupWin * 3) + (advance * 5);
    const owner = findNationOwner(nation);

    // Se la nazione appartiene a uno dei 4 partecipanti, carichiamo i dati
    if (teamAggregates[owner]) {
      teamAggregates[owner].totalScore += points;
      teamAggregates[owner].points += points; // Duplicato per sicurezza a seconda di cosa usa il componente (totalScore o points)
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

  // Se i componenti cercano la proprietà "ts.team.id" o "ts.team.name", l'oggetto "team" interno li salverà dal crash
  return Object.values(teamAggregates).sort((a, b) => b.totalScore - a.totalScore);
}
