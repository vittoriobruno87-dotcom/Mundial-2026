// ============================================================
// HOOK: Aggiornamento automatico risultati da API-Football
// league=1, season=2026 (Mondiale 2026)
// ============================================================

'use client';

import { useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { NationName } from '@/lib/gameData';

const API_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY ?? '';
const LEAGUE_ID = 1;
const SEASON = 2026;
const REFRESH_MS = 5 * 60 * 1000; // 5 minuti

// Mappa nomi API-Football → nomi interni dell'app
const API_NAME_MAP: Record<string, NationName> = {
  'Mexico':          'Messico',
  'Germany':         'Germania',
  'Brazil':          'Brasile',
  'Spain':           'Spagna',
  'Portugal':        'Portogallo',
  'Belgium':         'Belgio',
  'Japan':           'Giappone',
  'Morocco':         'Marocco',
  'Switzerland':     'Svizzera',
  'Norway':          'Norvegia',
  'Canada':          'Canada',
  'United States':   'USA',
  'USA':             'USA',
};

// Le 12 nazionali che ci interessano
const OUR_NATIONS = new Set([
  'Messico', 'Germania', 'Brasile', 'Spagna',
  'Portogallo', 'Belgio', 'Giappone', 'Marocco',
  'Svizzera', 'Norvegia', 'Canada', 'USA',
]);

function mapName(apiName: string): NationName | null {
  return API_NAME_MAP[apiName] ?? null;
}

export function useFootballData() {
  const { updateSquadResult, updateMatch, setLoading, setLastUpdated, matches } = useGameStore();

  const refresh = useCallback(async () => {
    if (!API_KEY) {
      console.info('[API] Nessuna chiave API — modalità manuale attiva');
      return;
    }

    setLoading(true);
    try {
      // Recupera tutte le partite del Mondiale 2026 già giocate o in corso
      const res = await fetch(
        `https://v3.football.api-sports.io/fixtures?league=${LEAGUE_ID}&season=${SEASON}`,
        {
          headers: {
            'x-apisports-key': API_KEY,
            'x-rapidapi-host': 'v3.football.api-sports.io',
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const fixtures = data.response ?? [];

      // Accumula V/P/S per ogni nazione
      const stats: Record<NationName, { wins: number; draws: number; losses: number }> = {};

      for (const f of fixtures) {
        const shortStatus = f.fixture?.status?.short ?? '';
        // Considera solo partite terminate o in corso
        if (!['FT', 'AET', 'PEN', '1H', '2H', 'HT', 'LIVE'].includes(shortStatus)) continue;

        const homeApi: string = f.teams?.home?.name ?? '';
        const awayApi: string = f.teams?.away?.name ?? '';
        const homeGoals: number = f.goals?.home ?? 0;
        const awayGoals: number = f.goals?.away ?? 0;
        const isFinished = ['FT', 'AET', 'PEN'].includes(shortStatus);
        const isLive = ['1H', '2H', 'HT', 'LIVE'].includes(shortStatus);

        const homeNation = mapName(homeApi);
        const awayNation = mapName(awayApi);

        // Aggiorna la lista partite visibile nell'app
        const internalMatch = matches.find(
          m =>
            (m.home === homeNation && m.away === awayNation) ||
            (m.home === awayNation && m.away === homeNation)
        );
        if (internalMatch) {
          const status = isFinished ? 'FT' : isLive ? 'LIVE' : 'NS';
          const hScore = internalMatch.home === homeNation ? homeGoals : awayGoals;
          const aScore = internalMatch.home === homeNation ? awayGoals : homeGoals;
          updateMatch(internalMatch.id, hScore, aScore, status);
        }

        // Calcola V/P/S solo per partite finite
        if (!isFinished) continue;

        const processNation = (nation: NationName | null, isHome: boolean) => {
          if (!nation || !OUR_NATIONS.has(nation)) return;
          if (!stats[nation]) stats[nation] = { wins: 0, draws: 0, losses: 0 };
          const scored = isHome ? homeGoals : awayGoals;
          const conceded = isHome ? awayGoals : homeGoals;
          if (scored > conceded) stats[nation].wins++;
          else if (scored === conceded) stats[nation].draws++;
          else stats[nation].losses++;
        };

        processNation(homeNation, true);
        processNation(awayNation, false);
      }

      // Aggiorna lo store con i nuovi risultati
      for (const [nation, s] of Object.entries(stats)) {
        updateSquadResult(nation as NationName, {
          wins: s.wins,
          draws: s.draws,
          losses: s.losses,
        });
      }

      setLastUpdated(new Date());
      console.info(`[API] Aggiornato: ${new Date().toLocaleTimeString('it-IT')}`);
    } catch (err) {
      console.warn('[API] Errore aggiornamento:', err);
    } finally {
      setLoading(false);
    }
  }, [updateSquadResult, updateMatch, setLoading, setLastUpdated, matches]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  return { refresh };
}
