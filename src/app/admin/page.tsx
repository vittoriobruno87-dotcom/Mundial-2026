'use client';

import React, { useState, useEffect } from 'react';
import { SQUAD_RESULTS, NationName } from '../../lib/gameData';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [results, setResults] = useState(SQUAD_RESULTS);

  const ADMIN_PASSWORD = 'mundial2026admin';

  useEffect(() => {
    const saved = localStorage.getItem('mundial_squad_results');
    if (saved) {
      try {
        setResults(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
    } else {
      alert('Password errata!');
    }
  };

  const updateField = (nation: NationName, field: string, value: any) => {
    const updated = {
      ...results,
      [nation]: {
        ...results[nation],
        [field]: value
      }
    };
    setResults(updated);
    localStorage.setItem('mundial_squad_results', JSON.stringify(updated));
  };

  if (!isAuthorized) {
    return (
      <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h2>Accesso Amministratore</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="password" 
            placeholder="Inserisci password admin" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Accedi
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Pannello Admin - Gestione Turni e Risultati</h1>
      <p style={{ color: '#666' }}>I cambiamenti vengono salvati automaticamente nel dispositivo.</p>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#f0f0f0', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Squadra</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>V</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>N</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>P</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Vince Girone</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Passaggi Turno (Multipli)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(results).map(([nation, data]) => (
            <tr key={nation}>
              <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>{nation}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <input 
                  type="number" 
                  value={data.wins} 
                  onChange={(e) => updateField(nation as NationName, 'wins', parseInt(e.target.value) || 0)}
                  style={{ width: '50px', padding: '5px' }}
                />
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <input 
                  type="number" 
                  value={data.draws} 
                  onChange={(e) => updateField(nation as NationName, 'draws', parseInt(e.target.value) || 0)}
                  style={{ width: '50px', padding: '5px' }}
                />
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <input 
                  type="number" 
                  value={data.losses} 
                  onChange={(e) => updateField(nation as NationName, 'losses', parseInt(e.target.value) || 0)}
                  style={{ width: '50px', padding: '5px' }}
                />
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={data.groupWin} 
                  onChange={(e) => updateField(nation as NationName, 'groupWin', e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={() => updateField(nation as NationName, 'advance', Math.max(0, (data.advance || 0) - 1))}
                    style={{ padding: '4px 8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{data.advance || 0}</span>
                  <button 
                    onClick={() => updateField(nation as NationName, 'advance', (data.advance || 0) + 1)}
                    style={{ padding: '4px 8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    +
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
