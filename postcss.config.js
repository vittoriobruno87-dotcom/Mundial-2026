/* ============================================================
   STILE GLOBALE – Mundial 2026
   ============================================================ */

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --gold:    #F5A623;
  --silver:  #A8A8A8;
  --bronze:  #CD7F32;
  --accent:  #00C853;
  --danger:  #FF3B30;

  --bg:       #0A0E1A;
  --surface:  #131929;
  --surface2: #1C2438;
  --text:     #F0F4FF;
  --muted:    #6B7A99;
  --border:   rgba(255, 255, 255, 0.07);

  --font-display: var(--font-bebas), 'Bebas Neue', cursive;
  --font-body:    var(--font-dm), 'DM Sans', sans-serif;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* ---- Animazioni ---- */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.animate-fade-in-up {
  animation: fadeInUp 0.35s ease both;
}

.animate-pulse-dot {
  animation: pulse 2s infinite;
}

/* ---- Scrollbar ---- */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--surface2); border-radius: 2px; }

/* ---- Font display ---- */
.font-display { font-family: var(--font-display); }
