'use client';

import { useGameStore } from '@/store/gameStore';
import { FLAGS, type Match } from '@/lib/gameData';
import { findNationOwner } from '@/lib/scoring';

export function MatchesTab() {
  const { matches } = useGameStore();

  const groups: Record<string, Match[]> = {};
  matches.forEach(m => {
    if (!groups[m.group]) groups[m.group] = [];
    groups[m.group].push(m);
  });

  return (
    <div className="px-4 pb-6">
      <div className="rounded-xl p-3 mb-4 text-center text-xs text-[var(--muted)]"
        style={{ background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.15)' }}>
        ● Il pallino dorato indica le nazionali nel gioco
      </div>

      {Object.entries(groups).map(([group, ms]) => (
        <div key={group}>
          <p className="font-display text-sm tracking-widest text-[var(--muted)] mb-2 mt-4 first:mt-0">
            {group}
          </p>
          {ms.map(m => {
            const homeOwner = findNationOwner(m.home);
            const awayOwner = findNationOwner(m.away);
            return (
              <div key={m.id} className="rounded-xl p-3 mb-2"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full text-[var(--muted)]"
                    style={{ background: 'var(--surface2)' }}>
                    {m.group}
                  </span>
                  <span className="text-[10px] text-[var(--muted)]">{m.date}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-2xl">{FLAGS[m.home] ?? '🏳'}</span>
                    <span className="text-[10px] text-[var(--muted)] text-center">
                      {m.home}
                      {homeOwner && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--gold)] ml-1 align-middle" />
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-3">
                    <span className="font-display text-3xl min-w-[22px] text-center">
                      {m.homeScore !== null ? m.homeScore : '-'}
                    </span>
                    <span className="font-display text-sm text-[var(--muted)]">:</span>
                    <span className="font-display text-3xl min-w-[22px] text-center">
                      {m.awayScore !== null ? m.awayScore : '-'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-2xl">{FLAGS[m.away] ?? '🏳'}</span>
                    <span className="text-[10px] text-[var(--muted)] text-center">
                      {m.away}
                      {awayOwner && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--gold)] ml-1 align-middle" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="text-center mt-2">
                  {m.status === 'FT' && (
                    <span className="text-[10px] px-3 py-1 rounded-full font-semibold"
                      style={{ background: 'rgba(107,122,153,0.15)', color: 'var(--muted)' }}>
                      ✓ Terminata
                    </span>
                  )}
                  {m.status === 'LIVE' && (
                    <span className="text-[10px] px-3 py-1 rounded-full font-semibold animate-pulse-dot"
                      style={{ background: 'rgba(255,59,48,0.15)', color: '#FF6B6B' }}>
                      ● IN CORSO {m.minute ? `${m.minute}'` : ''}
                    </span>
                  )}
                  {m.status === 'NS' && (
                    <span className="text-[10px] px-3 py-1 rounded-full font-semibold"
                      style={{ background: 'rgba(245,166,35,0.1)', color: 'var(--gold)' }}>
                      ⏱ In programma
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
