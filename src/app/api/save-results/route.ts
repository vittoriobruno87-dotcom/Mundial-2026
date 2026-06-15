// ============================================================
// API ROUTE: Salva risultati direttamente su GitHub
// Il file gameData.ts viene aggiornato → Vercel rideploya
// ============================================================
import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? '';
const GITHUB_OWNER = process.env.GITHUB_OWNER ?? '';
const GITHUB_REPO = process.env.GITHUB_REPO ?? '';
const FILE_PATH = 'src/lib/gameData.ts';

export async function POST(req: Request) {
  try {
    const { password, squadResults } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Leggi il file attuale da GitHub per ottenere lo SHA
    const getRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' } }
    );
    const fileData = await getRes.json();
    const sha = fileData.sha;
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8');

    // 2. Sostituisci solo il blocco SQUAD_RESULTS nel file
    const newBlock = buildSquadResultsBlock(squadResults);
    const updatedContent = currentContent.replace(
      /export const SQUAD_RESULTS[\s\S]*?^};/m,
      newBlock
    );

    // 3. Scrivi il file aggiornato su GitHub
    const updateRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Admin: aggiornamento risultati Mondiale 2026',
          content: Buffer.from(updatedContent).toString('base64'),
          sha,
        }),
      }
    );

    if (!updateRes.ok) {
      const err = await updateRes.json();
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function buildSquadResultsBlock(results: Record<string, any>): string {
  const lines = Object.entries(results).map(([nation, r]: [string, any]) => {
    const pad = nation.length < 10 ? ' '.repeat(10 - nation.length) : '';
    return `  '${nation}':${pad}{ wins: ${r.wins}, draws: ${r.draws}, losses: ${r.losses}, groupWin: ${r.groupWin}, advance: ${r.advance} },`;
  });
  return `export const SQUAD_RESULTS: Record<NationName, SquadResult> = {\n${lines.join('\n')}\n};`;
}
