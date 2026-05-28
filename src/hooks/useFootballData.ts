// ============================================================
// HOOK: Aggiornamento risultati (API reale o mock)
// ============================================================

'use client';

import { useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';

// ---- Configurazione API-Football (api-football.com) ----
// 1. Registra su https://www.api-football.com (piano Free: 100 req/giorno)
// 2. Copia la chiave in .env.local: NEXT_PUBLIC_API_FOOTBALL_KEY=xxxx
// 3. Il Mondiale 2026 avrà ID: verificare dopo il torneo inizia
const API_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY ?? '';
const WORLD_CUP_2026_ID = 1; // Aggiornare con ID reale

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minuti

async function fetchLiveMatches() {
  if (!API_KEY) return null;

  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures?league=${WORLD_CUP_2026_ID}&season=2026&status=LIVE`,
      { headers: { 'x-apisports-key': API_KEY } }
    );
    const data = await res.json();
    return data.response ?? null;
  } catch {
    console.warn('[API] Fallback ai dati mock');
    return null;
  }
}

export function useFootballData() {
  const { setLoading, setLastUpdated, updateMatch } = useGameStore();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const fixtures = await fetchLiveMatches();

      if (fixtures) {
        // Mapping risposta API → formato interno
        fixtures.forEach((f: any) => {
          const home = f.teams.home.name;
          const away = f.teams.away.name;
          const homeScore = f.goals.home;
          const awayScore = f.goals.away;
          const status = f.fixture.status.short === 'FT' ? 'FT'
            : f.fixture.status.short === 'NS' ? 'NS' : 'LIVE';

          // Trovare l'ID interno corrispondente
          // Nota: bisogna mappare i nomi API → nomi interni
          // Implementare un dizionario di mapping se necessario
          const internalId = mapApiIdToInternal(f.fixture.id);
          if (internalId) {
            updateMatch(internalId, homeScore, awayScore, status);
          }
        });
      }

      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, [setLoading, setLastUpdated, updateMatch]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  return { refresh };
}

// Dizionario: ID API-Football → ID interno
// Compilare manualmente una volta iniziato il torneo
function mapApiIdToInternal(apiId: number): number | null {
  const mapping: Record<number, number> = {
    // Esempio: 1001234: 1,
  };
  return mapping[apiId] ?? null;
}
