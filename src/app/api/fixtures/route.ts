import { NextResponse } from 'next/server';
import { SQUAD_RESULTS } from '@/lib/gameData';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL ?? '';
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? '';

async function kvGet(key: string) {
  const res = await fetch(`${UPSTASH_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    cache: 'no-store',
  });
  const data = await res.json();
  return data.result ? JSON.parse(data.result) : null;
}

async function kvSet(key: string, value: unknown) {
  await fetch(`${UPSTASH_URL}/set/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  });
}

export async function GET() {
  try {
    const saved = await kvGet('squadResults');
    return NextResponse.json(saved ?? SQUAD_RESULTS);
  } catch {
    return NextResponse.json(SQUAD_RESULTS);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password, nation, field, value } = body;

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const current = await kvGet('squadResults') ?? { ...SQUAD_RESULTS };
    if (!current[nation]) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    current[nation][field] = value;
    await kvSet('squadResults', JSON.stringify(current));

    return NextResponse.json({ ok: true, squadResults: current });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
