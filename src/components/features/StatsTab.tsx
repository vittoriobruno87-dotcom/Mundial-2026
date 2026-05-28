// ============================================================
// COMPONENTE: Stats
// ============================================================

'use client';

import { useGameStore } from '@/store/gameStore';
import { FLAGS } from '@/lib/gameData';
import { formatScore } from '@/lib/scoring';

export function StatsTab() {
  const { ranking, matches } = useGameStore();
  const maxScore = Math.max(...ranking.map(t => t.totalScore), 1);
  const played = matches.filter(m => m.status === 'FT').length;
  const upcoming = matches.filter(m => m.status === 'NS').length;
  const live = matches.filter(m => m.status === 'LIVE').length;
  const teamColors = ['#F5A623', '#00C853', '#2196F3'];

  return (
    <div className="px-4 pb-6">

      {/* Stat cards */}
      <p className="font-display text-sm tracking-widest text-[var(--muted)] mb-3">Panoramica</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: 'Partite giocate', value: played, sub: 'completate' },
          { label: 'In programma', value: upcoming, sub: 'prossime gare' },
          { label: 'In corso', value: live, sub: 'live ora' },
          { label: 'Squadre in gioco', value: 12, sub: 'su 48 totali' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl p-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-[11px] text-[var(--muted)] mb-1">{stat.label}</p>
            <p className="font-display text-3xl">{stat.value}</p>
            <p className="text-[11px] text-[var(--muted)] mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Barre rendimento */}
      <p className="font-display text-sm tracking-widest text-[var(--muted)] mb-3">Rendimento Team</p>
      {ranking.map((ts, i) => {
        const pct = Math.round((ts.totalScore / maxScore) * 100);
        return (
          <div key={ts.team.id} className="rounded-xl p-4 mb-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm font-semibold">{ts.team.name}</p>
                <p className="text-xs text-[var(--muted)]">{ts.team.players}</p>
              </div>
              <span className="font-display text-2xl" style={{ color: teamColors[i] }}>
                {formatScore(ts.totalScore)}
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full mb-3" style={{ background: 'var(--surface2)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: teamColors[i] }} />
            </div>
            {/* Squadre mini */}
            <div className="flex justify-between">
              {ts.squads.map(sq => (
                <div key={sq.nation} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-lg">{FLAGS[sq.nation] ?? '🏳'}</span>
                  <span className="font-display text-sm" style={{ color: teamColors[i] }}>
                    {formatScore(sq.finalScore)}
                  </span>
                  {(sq.hasGroupBonus || sq.hasAdvanceBonus) && (
                    <span className="text-[8px] text-[var(--accent)]">★</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Legenda coefficienti */}
      <p className="font-display text-sm tracking-widest text-[var(--muted)] mb-3 mt-4">Coefficienti</p>
      <div className="rounded-xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {[
          { tier: 'Tier 1', coeff: '×1.5', nations: 'Argentina, Brasile, Francia, Inghilterra' },
          { tier: 'Tier 2', coeff: '×2.0', nations: 'Spagna, Germania, Portogallo, Olanda, Belgio' },
          { tier: 'Tier 3', coeff: '×3.0', nations: 'Croazia, Marocco, Svizzera, Uruguay…' },
          { tier: 'Tier 4', coeff: '×4.0', nations: 'USA, Messico, Giappone, Norvegia…' },
          { tier: 'Tier 5', coeff: '×6.0', nations: 'Australia, Qatar, Arabia Saudita…' },
          { tier: 'Tier 6', coeff: '×10.0', nations: 'Canada, Nuova Zelanda, Haiti…' },
        ].map(row => (
          <div key={row.tier} className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
            <span className="font-display text-lg text-[var(--gold)] w-16">{row.coeff}</span>
            <div>
              <span className="text-xs text-[var(--muted)]">{row.tier} — </span>
              <span className="text-xs text-[var(--text)]">{row.nations}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Regole bonus */}
      <div className="rounded-xl p-4 mt-3 text-sm"
        style={{ background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.15)' }}>
        <p className="font-semibold mb-2">📐 Formula punteggio</p>
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          (Punti partite + bonus) × coefficiente<br />
          Vittoria = 3pt · Pareggio = 1pt<br />
          🏆 Vittoria girone = +1.5pt<br />
          ⬆ Passaggio turno = +3pt
        </p>
      </div>
    </div>
  );
}
