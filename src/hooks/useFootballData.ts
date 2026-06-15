'use client';
import { useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { NationName } from '@/lib/gameData';

const REFRESH_MS = 5 * 60 * 1000;

const API_NAME_MAP: Record<string, NationName> = {
  'Mexico': 'Messico', 'Germany': 'Germania', 'Brazil': 'Brasile',
  'Spain': 'Spagna', 'Portugal': 'Portogallo', 'Belgium': 'Belgio',
  'Japan': 'Giappone', 'Morocco': 'Marocco', 'Switzerland': 'Svizzera',
  'Norway': 'Norvegia', 'Canada': 'Canada', 'United States': 'USA',
};

const OUR_NATIONS = new Set(Object.values(API_NAME_MAP));

export function useFootballData() {
  const { updateSquadResult, updateMatch, setLoading, setLastUpdated, matches } = useGameStore();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fixtures');
      if (!res.ok) return;
      const data = await res.json();
      if (data.error || !data.response) return;

      const stats: Record<string, { wins: number; draws: number; losses: number }> = {};

      for (const f of data.response) {
        const shortStatus = f.fixture?.status?.short ?? '';
        const isFinished = ['FT', 'AET', 'PEN'].includes(shortStatus);
        const isLive = ['1H', '2H', 'HT', 'ET', 'BT'].includes(shortStatus);
        if (!isFinished && !isLive) continue;

        const homeApi: string = f.teams?.home?.name ?? '';
        const awayApi: string = f.teams?.away?.name ?? '';
        const homeGoals: number = f.goals?.home ?? 0;
        const awayGoals: number = f.goals?.away ?? 0;
        const homeNation = API_NAME_MAP[homeApi] ?? null;
        const awayNation = API_NAME_MAP[awayApi] ?? null;

        const match = matches.find(m =>
          (m.home === homeNation && m.away === awayNation) ||
          (m.home === awayNation && m.away === homeNation)
        );
        if (match) {
          const status = isFinished ? 'FT' : 'LIVE';
          const hScore = match.home === homeNation ? homeGoals : awayGoals;
          const aScore = match.home === homeNation ? awayGoals : homeGoals;
          updateMatch(match.id, hScore, aScore, status);
        }

        if (!isFinished) continue;
        const process = (nation: string | null, isHome: boolean) => {
          if (!nation || !OUR_NATIONS.has(nation as NationName)) return;
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

      for (const [nation, s] of Object.entries(stats)) {
        updateSquadResult(nation as NationName, { wins: s.wins, draws: s.draws, losses: s.losses });
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.warn('[API] Errore:', err);
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
