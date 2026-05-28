// ============================================================
// COMPONENTE: Classifica
// ============================================================

'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { FLAGS } from '@/lib/gameData';
import { formatScore } from '@/lib/scoring';

export function RankingTab() {
  const { ranking } = useGameStore();
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = (id: number) => setExpanded(prev => prev === id ? null : id);

  const medalColors = ['#F5A623', '#A8A8A8', '#CD7F32'];
  const medals = ['🥇', '🥈', '🥉'];

  // Podio
  const [first, second, third] = [ranking[0], ranking[1], ranking[2]];

  return (
    <div className="px-4 pb-6">

      {/* Podio */}
      {first && (
        <div className="mb-6">
          <p className="font-display text-sm tracking-widest text-[var(--muted)] mb-3">Podio</p>
          <div className="flex items-end justify-center gap-2">
            {/* 2° posto */}
            {second && (
              <div className="flex flex-col items-center gap-1 flex-1">
                <span className="text-xs text-center text-[var(--text)] font-medium leading-tight">
                  {second.team.name.length > 12 ? second.team.name.slice(0, 12) + '…' : second.team.name}
                </span>
                <div className="w-full rounded-t-lg flex flex-col items-center justify-end pb-2 min-h-[70px]"
                  style={{ background: 'rgba(168,168,168,0.15)', border: '1px solid rgba(168,168,168,0.3)' }}>
                  <span className="font-display text-2xl" style={{ color: '#A8A8A8' }}>
                    {formatScore(second.totalScore)}
                  </span>
                </div>
                <span className="text-lg">🥈</span>
              </div>
            )}
            {/* 1° posto */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <span className="text-xs text-center text-[var(--text)] font-medium leading-tight">
                {first.team.name.length > 12 ? first.team.name.slice(0, 12) + '…' : first.team.name}
              </span>
              <div className="w-full rounded-t-lg flex flex-col items-center justify-end pb-2 min-h-[90px]"
                style={{ background: 'rgba(245,166,35,0.2)', border: '1px solid rgba(245,166,35,0.4)' }}>
                <span className="font-display text-3xl text-[var(--gold)]">
                  {formatScore(first.totalScore)}
                </span>
              </div>
              <span className="text-lg">🥇</span>
            </div>
            {/* 3° posto */}
            {third && (
              <div className="flex flex-col items-center gap-1 flex-1">
                <span className="text-xs text-center text-[var(--text)] font-medium leading-tight">
                  {third.team.name.length > 12 ? third.team.name.slice(0, 12) + '…' : third.team.name}
                </span>
                <div className="w-full rounded-t-lg flex flex-col items-center justify-end pb-2 min-h-[55px]"
                  style={{ background: 'rgba(205,127,50,0.15)', border: '1px solid rgba(205,127,50,0.3)' }}>
                  <span className="font-display text-2xl" style={{ color: '#CD7F32' }}>
                    {formatScore(third.totalScore)}
                  </span>
                </div>
                <span className="text-lg">🥉</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lista dettagliata */}
      <p className="font-display text-sm tracking-widest text-[var(--muted)] mb-3">Dettaglio</p>
      {ranking.map((ts, idx) => {
        const isOpen = expanded === ts.team.id;
        return (
          <div
            key={ts.team.id}
            className="rounded-xl mb-3 cursor-pointer transition-all duration-200 animate-fade-in-up"
            style={{
              background: 'var(--surface)',
              border: isOpen ? '1px solid rgba(245,166,35,0.4)' : '1px solid var(--border)',
              animationDelay: `${idx * 60}ms`,
            }}
            onClick={() => toggle(ts.team.id)}
          >
            {/* Header card */}
            <div className="flex items-center gap-3 p-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-display text-base flex-shrink-0"
                style={{
                  background: `${medalColors[idx] ?? '#888'}22`,
                  border: `1px solid ${medalColors[idx] ?? '#888'}66`,
                  color: medalColors[idx] ?? '#888',
                }}
              >
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{ts.team.name}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{ts.team.players}</p>
              </div>
              <span className="font-display text-3xl text-[var(--gold)]">
                {formatScore(ts.totalScore)}
              </span>
              <span className="text-[var(--muted)] text-sm ml-1">{isOpen ? '▲' : '▼'}</span>
            </div>

            {/* Dettaglio squadre */}
            {isOpen && (
              <div className="px-4 pb-4 pt-1 border-t border-[var(--border)] animate-fade-in-up">
                {ts.squads.map(sq => (
                  <div key={sq.nation} className="flex items-center py-2 border-b border-[var(--border)] last:border-0">
                    <span className="text-xl w-8 text-center">{FLAGS[sq.nation] ?? '🏳'}</span>
                    <div className="flex-1 ml-2">
                      <p className="text-sm font-medium">{sq.nation}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded"
                          style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
                          ×{sq.coefficient}
                        </span>
                        <span className="text-[10px] text-[var(--muted)]">
                          {Math.round(sq.matchPoints / 3)}V {(sq.matchPoints % 3) > 0 ? 1 : 0}P
                        </span>
                        {sq.hasGroupBonus && (
                          <span className="text-[10px] px-2 py-0.5 rounded"
                            style={{ background: 'rgba(245,166,35,0.1)', color: 'var(--gold)', border: '1px solid rgba(245,166,35,0.3)' }}>
                            🏆 +1.5
                          </span>
                        )}
                        {sq.hasAdvanceBonus && (
                          <span className="text-[10px] px-2 py-0.5 rounded"
                            style={{ background: 'rgba(0,200,83,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,200,83,0.3)' }}>
                            ⬆ +3
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-display text-xl" style={{ color: 'var(--accent)' }}>
                      {formatScore(sq.finalScore)}
                    </span>
                  </div>
                ))}

                {/* Totale team */}
                <div className="flex justify-between items-center mt-3 pt-2">
                  <span className="text-xs text-[var(--muted)]">Punteggio totale</span>
                  <span className="font-display text-2xl text-[var(--gold)]">
                    {formatScore(ts.totalScore)}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
