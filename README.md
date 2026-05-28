# ⚽ Mundial 2026 – Gioco Amici

App mobile-first per gestire il gioco tra amici basato sui risultati del Mondiale 2026.  
Installabile come PWA su iPhone e Android.

\---

## 🚀 Avvio rapido

```bash
# 1. Installa le dipendenze
npm install

# 2. Copia le variabili d'ambiente
cp .env.example .env.local

# 3. Avvia in sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) dal browser.

\---

## 📁 Struttura del progetto

```
src/
├── app/
│   ├── layout.tsx          # Layout root + metadata PWA
│   ├── page.tsx            # Pagina principale + navigazione
│   └── globals.css         # Stili globali + variabili CSS
├── components/
│   └── features/
│       ├── RankingTab.tsx  # Classifica con podio e dettaglio
│       ├── MatchesTab.tsx  # Lista partite con status
│       └── StatsTab.tsx    # Statistiche e barre progresso
├── lib/
│   ├── gameData.ts         # 🔑 Dati: team, coefficienti, risultati, partite
│   └── scoring.ts          # 🔑 Logica calcolo punteggi
├── hooks/
│   └── useFootballData.ts  # Hook aggiornamento via API o mock
└── store/
    └── gameStore.ts        # Stato globale (Zustand)
public/
└── manifest.json           # PWA manifest
```

\---

## 🔑 File chiave da modificare

### `src/lib/gameData.ts`

Contiene **tutti i dati del gioco**:

* `COEFFICIENTS` — coefficienti per nazionali
* `SQUAD\\\_RESULTS` — risultati aggiornati di ogni squadra
* `TEAMS` — i 3 team partecipanti con le loro nazionali
* `MATCHES` — partite con risultati

**Per aggiornare un risultato manualmente:**

```ts
// In SQUAD\\\_RESULTS modifica il record della squadra
'Brasile': { wins: 4, draws: 0, losses: 0, groupWin: true, advance: true },
```

### `src/lib/scoring.ts`

Logica pura di calcolo — non modificare salvo cambio regole.

```ts
// Formula applicata:
const matchPoints = wins \\\* 3 + draws \\\* 1;
const bonus = (groupWin ? 1.5 : 0) + (advance ? 3 : 0);
const finalScore = (matchPoints + bonus) \\\* coefficient;
```

\---

## 🌐 Integrazione API reale (API-Football)

1. Registrati su [api-football.com](https://www.api-football.com) (piano Free gratuito)
2. Copia la chiave API in `.env.local`:

```
   NEXT\\\_PUBLIC\\\_API\\\_FOOTBALL\\\_KEY=la\\\_tua\\\_chiave
   ```

3. Quando inizia il torneo (giugno 2026), recupera l'ID del Mondiale:

```bash
   curl "https://v3.football.api-sports.io/leagues?name=World+Cup\\\&season=2026" \\\\
     -H "x-apisports-key: LA\\\_TUA\\\_CHIAVE"
   ```

4. Aggiorna `NEXT\\\_PUBLIC\\\_WORLD\\\_CUP\\\_ID` e il dizionario `mapApiIdToInternal` in `useFootballData.ts`

L'hook si aggiorna automaticamente ogni 5 minuti. Senza chiave API, i dati mock rimangono attivi.

\---

## 📦 Deploy su Vercel (consigliato)

```bash
# Installa Vercel CLI
npm i -g vercel

# Deploy (segui le istruzioni)
vercel

# Per i successivi deploy
vercel --prod
```

Oppure collega il repository GitHub a [vercel.com](https://vercel.com) per deploy automatici ad ogni push.

**Variabili d'ambiente su Vercel:**  
Dashboard → Project → Settings → Environment Variables  
Aggiungi `NEXT\\\_PUBLIC\\\_API\\\_FOOTBALL\\\_KEY`

\---

## 📦 Deploy su Netlify

```bash
npm run build
# Cartella di output: .next  (oppure `out` se usi output: 'export')
```

Su Netlify: New site → Import from Git → Build command: `npm run build` → Publish directory: `.next`

\---

## 📱 Installare come PWA (iPhone)

1. Apri l'URL del sito su **Safari**
2. Tocca il tasto **Condividi** (quadrato con freccia in alto)
3. Scorri e tocca **"Aggiungi alla schermata Home"**
4. Dai un nome e tocca **Aggiungi**

L'app apparirà come icona nativa sulla home, senza barra URL.

## 📱 Installare come PWA (Android Chrome)

1. Apri l'URL su **Chrome**
2. Tocca i **tre puntini** → **"Aggiungi alla schermata Home"**  
(oppure comparirà in automatico il banner di installazione)
3. Tocca **Installa**

\---

## ➕ Aggiungere un nuovo team

In `src/lib/gameData.ts`, aggiungi un oggetto a `TEAMS`:

```ts
{
  id: 4,
  name: "Nuovo Team",
  players: "Mario \\\& Luigi",
  color: "#9C27B0",
  squads: \\\['Argentina', 'Croazia', 'Ecuador', 'Tunisia'],
}
```

Il calcolo della classifica si aggiorna automaticamente.

\---

## 🛠 Stack tecnologico

|Tecnologia|Scopo|
|-|-|
|Next.js 14 (App Router)|Framework React con SSR/SSG|
|TypeScript|Type safety|
|Tailwind CSS|Styling utility-first|
|Zustand|State management leggero|
|Google Fonts (Bebas Neue + DM Sans)|Tipografia display|
|API-Football v3|Dati live (opzionale)|
|PWA Manifest|Installabilità mobile|

\---

## 🗺 Roadmap futura

* \[ ] Pagina admin per aggiornare risultati senza toccare il codice
* \[ ] Notifiche push per gol e fischio finale
* \[ ] Storico turno per turno
* \[ ] Condivisione classifica via link/immagine
* \[ ] Firebase Realtime DB per sync multi-device



