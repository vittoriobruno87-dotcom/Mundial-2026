// ============================================================
// API ROUTE: Proxy verso api-football.com (evita CORS)
// GET /api/fixtures
// ============================================================

import { NextResponse } from 'next/server';

const API_KEY = process.env.API_FOOTBALL_KEY ?? '';
const LEAGUE_ID = 1;
const SEASON = 2026;

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json({ error: 'No API key' }, { status: 401 });
  }

  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures?league=${LEAGUE_ID}&season=${SEASON}`,
      {
        headers: {
          'x-apisports-key': API_KEY,
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
        next: { revalidate: 300 }, // cache 5 minuti
      }
    );

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[API Route] Errore:', err);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}
