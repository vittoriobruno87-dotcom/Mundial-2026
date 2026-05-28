// ============================================================
// PAGINA ADMIN – Aggiornamento risultati
// Protetta da password, accessibile solo all'admin
// ============================================================

'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { TEAMS, FLAGS } from '@/lib/gameData';

// ⚠️ Cambia questa password con una tua
const ADMIN_PASSWORD = 'mundial2026admin';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<string | null>(null);

  const { squadResults, updateSquadResult, refreshRanking } = useGameStore();

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setError('');
    } else {
      setError('Password errata');
    }
  };

  const handleUpdate = (
    nation: string,
    field: 'wins' | 'draws' | 'losses' | 'groupWin' | 'advance',
    value: number | boolean
  ) => {
    updateSquadResult(nation, { [field]: value });
    refreshRanking();
    setSaved(nation);
    setTimeout(() => setSaved(null), 1500);
  };

  // ---- Login screen ----
  if (!loggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'var(--font-body)',
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          letterSpacing: 2,
          color: 'var(--text)',
          marginBottom: 8,
        }}>
          AREA ADMIN
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 32 }}>
          Solo per l'amministratore del gioco
        </p>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{
            width: '100%',
            maxWidth: 320,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '12px 16px',
            color: 'var(--text)',
            fontSize: 16,
            outline: 'none',
            marginBottom: 12,
            fontFamily: 'var(--font-body)',
          }}
        />

        {error && (
          <p style={{ color: '#FF3B30', fontSize: 13, marginBottom: 12 }}>{error}</p>
        )}

        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            maxWidth: 320,
            background: 'var(--gold)',
            color: '#000',
            border: 'none',
            borderRadius: 10,
            padding: '13px',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
        >
          Entra
        </button>

        <a href="/" style={{ color: 'var(--muted)', fontSize: 12, marginTop: 24, textDecoration: 'none' }}>
          ← Torna alla classifica
        </a>
      </div>
    );
  }

  // ---- Admin panel ----
  const allNations = TEAMS.flatMap(t => t.squads);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'var(--font-body)',
      paddingBottom: 40,
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0A0E1A 0%, #1a1040 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '48px 16px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: 2, margin: 0 }}>
            ⚙️ ADMIN
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 12, margin: '4px 0 0' }}>
            Aggiorna i risultati delle squadre
          </p>
        </div>
        <a href="/" style={{
          color: 'var(--gold)',
          fontSize: 12,
          textDecoration: 'none',
          background: 'rgba(245,166,35,0.1)',
          border: '1px solid rgba(245,166,35,0.3)',
          padding: '6px 12px',
          borderRadius: 20,
        }}>
          ← Classifica
        </a>
      </div>

      <div style={{ padding: '16px' }}>
        <p style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 16, textAlign: 'center' }}>
          Le modifiche aggiornano la classifica in tempo reale
        </p>

        {TEAMS.map(team => (
          <div key={team.id} style={{ marginBottom: 24 }}>
            {/* Team header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
              padding: '10px 14px',
              background: 'var(--surface)',
              borderRadius: 10,
              border: `1px solid ${team.color}44`,
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: team.color, flexShrink: 0,
              }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{team.name}</p>
                <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>{team.players}</p>
              </div>
            </div>

            {/* Squadre del team */}
            {team.squads.map(nation => {
              const r = squadResults[nation];
              if (!r) return null;
              const isSaved = saved === nation;

              return (
                <div key={nation} style={{
                  background: 'var(--surface)',
                  border: isSaved
                    ? '1px solid var(--accent)'
                    : '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 10,
                  transition: 'border-color 0.3s',
                }}>
                  {/* Nazione */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 22 }}>{FLAGS[nation] ?? '🏳'}</span>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{nation}</span>
                    {isSaved && (
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: 11,
                        color: 'var(--accent)',
                        background: 'rgba(0,200,83,0.1)',
                        padding: '2px 8px',
                        borderRadius: 20,
                      }}>
                        ✓ Salvato
                      </span>
                    )}
                  </div>

                  {/* V / P / S */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                    {(['wins', 'draws', 'losses'] as const).map(field => {
                      const labels = { wins: '⚽ Vittorie', draws: '🤝 Pareggi', losses: '❌ Sconfitte' };
                      return (
                        <div key={field} style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 6 }}>
                            {labels[field]}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <button
                              onClick={() => handleUpdate(nation, field, Math.max(0, r[field] - 1))}
                              style={btnStyle}
                            >−</button>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, minWidth: 24, textAlign: 'center' }}>
                              {r[field]}
                            </span>
                            <button
                              onClick={() => handleUpdate(nation, field, r[field] + 1)}
                              style={btnStyle}
                            >+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bonus */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleUpdate(nation, 'groupWin', !r.groupWin)}
                      style={{
                        flex: 1,
                        padding: '8px 4px',
                        borderRadius: 8,
                        border: r.groupWin
                          ? '1px solid rgba(245,166,35,0.6)'
                          : '1px solid var(--border)',
                        background: r.groupWin
                          ? 'rgba(245,166,35,0.15)'
                          : 'var(--surface2)',
                        color: r.groupWin ? 'var(--gold)' : 'var(--muted)',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        transition: 'all 0.2s',
                      }}
                    >
                      🏆 Vince girone
                    </button>
                    <button
                      onClick={() => handleUpdate(nation, 'advance', !r.advance)}
                      style={{
                        flex: 1,
                        padding: '8px 4px',
                        borderRadius: 8,
                        border: r.advance
                          ? '1px solid rgba(0,200,83,0.6)'
                          : '1px solid var(--border)',
                        background: r.advance
          ? 'rgba(0,200,83,0.15)'
                          : 'var(--surface2)',
                        color: r.advance ? 'var(--accent)' : 'var(--muted)',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        transition: 'all 0.2s',
                      }}
                    >
                      ⬆ Passa turno
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: '1px solid var(--border)',
  background: 'var(--surface2)',
  color: 'var(--text)',
  fontSize: 16,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--font-body)',
};
