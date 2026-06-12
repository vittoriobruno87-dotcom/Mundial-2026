'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useFootballData } from '@/hooks/useFootballData';
import { RankingTab } from '@/components/features/RankingTab';
import { MatchesTab } from '@/components/features/MatchesTab';
import { StatsTab } from '@/components/features/StatsTab';

type Tab = 'ranking' | 'matches' | 'stats';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('ranking');
  const { isLoading, lastUpdated } = useGameStore();
  const { refresh } = useFootballData();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', paddingBottom: '80px' }}>
      <header style={{ background: 'linear-gradient(135deg, #0A0E1A 0%, #1a1040 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-4 pt-12 pb-0">
          <h1 className="font-display text-2xl tracking-widest">
            ⚽ MUNDIAL <span style={{ color: 'var(--gold)' }}>2026</span>
          </h1>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <span className="text-[10px] text-[var(--muted)]">Aggiornamento…</span>
            ) : (
              <button onClick={refresh} className="text-[10px] px-2 py-1 rounded-full font-semibold"
                style={{ background: 'rgba(255,59,48,0.15)', color: '#FF6B6B', border: 'none', cursor: 'pointer' }}>
                ● LIVE
              </button>
            )}
          </div>
        </div>
        {lastUpdated && (
          <p className="px-4 text-[10px] text-[var(--muted)] pb-1">
            Aggiornato: {new Date(lastUpdated).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
        <div className="flex">
          {(['ranking', 'matches', 'stats'] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 text-sm font-medium transition-all duration-200"
              style={{
                background: 'none', border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--gold)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--gold)' : 'var(--muted)',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}>
              {tab === 'ranking' ? 'Classifica' : tab === 'matches' ? 'Partite' : 'Stats'}
            </button>
          ))}
        </div>
      </header>
      <main className="pt-4">
        {activeTab === 'ranking' && <RankingTab />}
        {activeTab === 'matches' && <MatchesTab />}
        {activeTab === 'stats' && <StatsTab />}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 flex"
        style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {[{ id: 'ranking', label: 'Classifica', icon: '🏆' }, { id: 'matches', label: 'Partite', icon: '⚽' }, { id: 'stats', label: 'Stats', icon: '📊' }].map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id as Tab)}
            className="flex-1 flex flex-col items-center gap-1 py-2"
            style={{
              background: 'none', border: 'none',
              color: activeTab === item.id ? 'var(--gold)' : 'var(--muted)',
              cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '10px',
              fontWeight: activeTab === item.id ? 600 : 400,
            }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
