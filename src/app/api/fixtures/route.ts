import { NextResponse } from 'next/server';

const API_KEY = process.env.API_FOOTBALL_KEY ?? '';

export async function GET() {
  if (!API_KEY) return NextResponse.json({ error: 'No API key' }, { status: 401 });
  try {
    const res = await fetch(
      'https://v3.football.api-sports.io/fixtures?league=1&season=2026',
      { headers: { 'x-apisports-key': API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' }, next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}
