// ============================================================
// HOOK: Aggiornamento automatico — chiama la nostra API Route
// (nessun problema CORS, la chiave API rimane sul server)
// ============================================================

'use client';

import { useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { NationName } from '@/lib/gameData';

const REFRESH_MS = 5 * 60 * 1000; // 5 minuti

// Mappa nomi API-Football → nomi interni dell'app
const API_NAME_MAP: Record<string, NationName> = {
  'Mexico':        'Messico',
  'Germany':       'Germania',
  'Brazil':        'Brasile',
  'Spain':         'Spagna',
  'Portugal':      'Portogallo',
  'Belgium':       'Belgio',
  'Japan':         'Giappone',
  'Morocco':       'Marocco',
  'Switzerland':   'Svizzera',
  'Norway':        'Norvegia',
  'Canada':        'Canada',
  'United States': 'USA',
};

const OUR_NATIONS = new Set(Object.values(API_NAME_MAP));

function mapName(apiName: string): NationName | null {
  return API_NAME_MAP[apiName] ?? null;
}

export function useFootballData() {
  const { updateSquadResult, updateMatch, setLoading, setLastUpdated, matches } = useGameStore();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // Chiama la nostra API Route interna (niente CORS)
      const res = await fetch('/api/fixtures');
      if (!res.ok) {
        console.warn('[Hook] API non disponibile, modalità manuale attiva');
        return;
      }

      const data = await res.json();
      if (data.error) {
        console.info('[Hook] Nessuna chiave API — usa la pagina admin per aggiornamenti manuali');
        return;
      }

      const fixtures = data.response ?? [];
      const stats: Record<NationName, { wins: number; draws: number; losses: number }> = {};

      for (const f of fixtures) {
        const shortStatus = f.fixture?.status?.short ?? '';
        const isFinished = ['FT', 'AET', 'PEN'].includes(shortStatus);
        const isLive = ['1H', '2H', 'HT', 'ET', 'BT'].includes(shortStatus);

        if (!isFinished && !isLive) continue;

        const homeApi: string = f.teams?.home?.name ?? '';
        const awayApi: string = f.teams?.away?.name ?? '';
        const homeGoals: number = f.goals?.home ?? 0;
        const awayGoals: number = f.goals?.away ?? 0;
        const minute: number | undefined = f.fixture?.status?.elapsed ?? undefined;

        const homeNation = mapName(homeApi);
        const awayNation = mapName(awayApi);

        // Aggiorna partita visibile nell'app
        const internalMatch = matches.find(m =>
          (m.home === homeNation && m.away === awayNation) ||
          (m.home === awayNation && m.away === homeNation)
        );
        if (internalMatch) {
          const status = isFinished ? 'FT' : 'LIVE';
          const hScore = internalMatch.home === homeNation ? homeGoals : awayGoals;
          const aScore = internalMatch.home === homeNation ? awayGoals : homeGoals;
          updateMatch(internalMatch.id, hScore, aScore, status);
        }

        // Calcola V/P/S solo per partite finite
        if (!isFinished) continue;

        const process = (nation: NationName | null, isHome: boolean) => {
          if (!nation || !OUR_NATIONS.has(nation)) return;
          if (!stats[nation]) stats[nation] = { wins: 0, draws: 0, losses: 0 };
          const scored = isHome ? homeGoals : awayGoals;
          const conceded = isHome ? awayGoals : homeGoals;
          if (scored > conceded) stats[nation].wins++;
          else if (scored === conceded) stats[nation].draws++;
          else stats[nation].losses++;
        };

        process(homeNation, true);
        process(awayNation, false);
      }

      // Aggiorna store — preserva i bonus impostati dall'admin
      for (const [nation, s] of Object.entries(stats)) {
        updateSquadResult(nation as NationName, s);
      }

      setLastUpdated(new Date());
      console.info(`[API] Aggiornato: ${new Date().toLocaleTimeString('it-IT')}`);
    } catch (err) {
      console.warn('[Hook] Errore fetch:', err);
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
