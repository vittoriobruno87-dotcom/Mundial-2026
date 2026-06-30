'use client';
import { useState } from 'react';
import { TEAMS, FLAGS, COEFFICIENTS, SQUAD_RESULTS, type SquadResult } from '@/lib/gameData';

const PASSWORD = 'mundial2026admin';

function calcRanking(results: Record<string, SquadResult>) {
  return TEAMS.map(team => {
    const total = team.squads.reduce((sum, nation) => {
      const r = results[nation];
      if (!r) return sum;
      const matchPts = r.wins * 3 + r.draws;
      const bonus = (r.groupWin ? 3 : 0) + ((r.advance ?? 0) * 3) + (r.finalist ? 5 : 0) + (r.champion ? 15 : 0);
      const coeff = COEFFICIENTS[nation] ?? 1;
      return sum + (matchPts * coeff) + bonus;
    }, 0);
    return { team, total };
  }).sort((a, b) => b.total - a.total);
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState<Record<string, SquadResult>>(
    JSON.parse(JSON.stringify(SQUAD_RESULTS))
  );
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');

  const handleLogin = () => {
    if (password === PASSWORD) { setLoggedIn(true); setError(''); }
    else setError('Password errata');
  };

  const update = (nation: string, field: string, value: number | boolean) => {
    setResults(prev => ({ ...prev, [nation]: { ...prev[nation], [field]: value } }));
    setStatus('idle');
  };

  const saveAll = async () => {
    setStatus('saving');
    try {
      const res = await fetch('/api/save-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: PASSWORD, squadResults: results }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus('ok');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        console.error(data.error);
      }
    } catch {
      setStatus('error');
    }
  };

  const ranking = calcRanking(results);
  const medals = ['🥇', '🥈', '🥉'];

  if (!loggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'var(--font-body)' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 2, color: 'var(--text)', marginBottom: 8 }}>AREA ADMIN</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 32 }}>Solo per l'amministratore</p>
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{ width: '100%', maxWidth: 320, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', color: 'var(--text)', fontSize: 16, outline: 'none', marginBottom: 12, fontFamily: 'var(--font-body)' }} />
        {error && <p style={{ color: '#FF3B30', fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <button onClick={handleLogin}
          style={{ width: '100%', maxWidth: 320, background: 'var(--gold)', color: '#000', border: 'none', borderRadius: 10, padding: 13, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          Entra
        </button>
        <a href="/" style={{ color: 'var(--muted)', fontSize: 12, marginTop: 24, textDecoration: 'none' }}>← Classifica</a>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body)', paddingBottom: 100 }}>
      <div style={{ background: 'linear-gradient(135deg, #0A0E1A 0%, #1a1040 100%)', borderBottom: '1px solid var(--border)', padding: '48px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: 2, margin: 0 }}>⚙️ ADMIN</h1>
          <p style={{ color: 'var(--muted)', fontSize: 12, margin: '4px 0 0' }}>Modifica e premi SALVA per aggiornare</p>
        </div>
        <a href="/" style={{ color: 'var(--gold)', fontSize: 12, textDecoration: 'none', background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)', padding: '6px 12px', borderRadius: 20 }}>← Classifica</a>
      </div>

      <div style={{ margin: '16px 16px 0', padding: 14, background: 'var(--surface)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 12 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 1, color: 'var(--muted)', margin: '0 0 10px' }}>ANTEPRIMA CLASSIFICA</p>
        {ranking.map((r, i) => (
          <div key={r.team.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < ranking.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ fontSize: 13 }}>{medals[i]} {r.team.name}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--gold)' }}>{r.total.toFixed(1)}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {TEAMS.map(team => (
          <div key={team.id} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: '10px 14px', background: 'var(--surface)', borderRadius: 10, border: `1px solid ${team.color}44` }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: team.color }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{team.name}</p>
                <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>{team.players}</p>
              </div>
            </div>

            {team.squads.map(nation => {
              const r = results[nation];
              if (!r) return null;
              const matchPts = r.wins * 3 + r.draws;
              const bonus = (r.groupWin ? 3 : 0) + ((r.advance ?? 0) * 3) + (r.finalist ? 5 : 0) + (r.champion ? 15 : 0);
              const coeff = COEFFICIENTS[nation] ?? 1;
              const finalScore = (matchPts * coeff) + bonus;

              return (
                <div key={nation} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 22 }}>{FLAGS[nation] ?? '🏳'}</span>
                    <span style={{ fontWeight: 600, fontSize: 15, flex: 1 }}>{nation}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--accent)' }}>{finalScore.toFixed(1)} pt</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                    {(['wins', 'draws', 'losses'] as const).map(field => {
                      const labels = { wins: '⚽ Vittorie', draws: '🤝 Pareggi', losses: '❌ Sconfitte' };
                      return (
                        <div key={field} style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 6 }}>{labels[field]}</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <button onClick={() => update(nation, field, Math.max(0, r[field] - 1))}
                              style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', fontSize: 18, cursor: 'pointer' }}>−</button>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, minWidth: 28, textAlign: 'center' }}>{r[field]}</span>
                            <button onClick={() => update(nation, field, r[field] + 1)}
                              style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', fontSize: 18, cursor: 'pointer' }}>+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <button onClick={() => update(nation, 'groupWin', !r.groupWin)}
                      style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: r.groupWin ? '1px solid rgba(245,166,35,0.6)' : '1px solid var(--border)', background: r.groupWin ? 'rgba(245,166,35,0.15)' : 'var(--surface2)', color: r.groupWin ? 'var(--gold)' : 'var(--muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      🏆 Vince girone <span style={{ opacity: 0.6 }}>+3</span>
                    </button>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: 8 }}>
                    <p style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 6 }}>⬆ Turni superati (+3 ciascuno)</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <button onClick={() => update(nation, 'advance', Math.max(0, (r.advance ?? 0) - 1))}
                        style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', fontSize: 18, cursor: 'pointer' }}>−</button>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, minWidth: 36, textAlign: 'center', color: (r.advance ?? 0) > 0 ? 'var(--accent)' : 'var(--text)' }}>
                        {r.advance ?? 0}
                      </span>
                      <button onClick={() => update(nation, 'advance', Math.min(3, (r.advance ?? 0) + 1))}
                        style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', fontSize: 18, cursor: 'pointer' }}>+</button>
                      <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 4 }}>
                        = +{(r.advance ?? 0) * 3} pt
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => update(nation, 'finalist', !r.finalist)}
                      style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: r.finalist ? '1px solid rgba(33,150,243,0.6)' : '1px solid var(--border)', background: r.finalist ? 'rgba(33,150,243,0.15)' : 'var(--surface2)', color: r.finalist ? '#2196F3' : 'var(--muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      🥈 Finalista <span style={{ opacity: 0.6 }}>+5</span>
                    </button>
                    <button onClick={() => update(nation, 'champion', !r.champion)}
                      style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: r.champion ? '1px solid rgba(255,215,0,0.7)' : '1px solid var(--border)', background: r.champion ? 'rgba(255,215,0,0.2)' : 'var(--surface2)', color: r.champion ? '#FFD700' : 'var(--muted)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      🏆 CAMPIONE <span style={{ opacity: 0.6 }}>+15</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <button onClick={saveAll} disabled={status === 'saving'}
          style={{
            width: '100%', padding: 16, borderRadius: 12, border: 'none', cursor: status === 'saving' ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 1,
            background: status === 'ok' ? 'var(--accent)' : status === 'error' ? '#FF3B30' : 'var(--gold)',
            color: status === 'ok' || status === 'error' ? '#fff' : '#000',
            transition: 'all 0.3s',
          }}>
          {status === 'saving' ? '⏳ Salvataggio...' : status === 'ok' ? '✓ SALVATO! Deploy in corso...' : status === 'error' ? '✗ Errore — riprova' : '💾 SALVA E AGGIORNA CLASSIFICA'}
        </button>
        {status === 'ok' && (
          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
            Vercel aggiornerà l'app in ~1 minuto per tutti
          </p>
        )}
      </div>
    </div>
  );
}
