// ============================================================
// MUNDIAL 2026 - DATI DEL GIOCO
// ============================================================

export type NationName = string;

export interface SquadResult {
  wins: number;
  draws: number;
  losses: number;
  groupWin: boolean;
  advance: boolean;
}

export interface Squad {
  name: NationName;
  flag: string;
  coefficient: number;
  result: SquadResult;
}

export interface Team {
  id: number;
  name: string;
  players: string;
  color: string;
  squads: NationName[];
}

export interface Match {
  id: number;
  group: string;
  home: NationName;
  away: NationName;
  homeScore: number | null;
  awayScore: number | null;
  status: 'FT' | 'LIVE' | 'NS';
  date: string;
  minute?: number;
}

// Coefficienti per nazionali
export const COEFFICIENTS: Record<NationName, number> = {
  // Tier 1 - 1.5
  'Argentina': 1.5, 'Brasile': 1.5, 'Francia': 1.5, 'Inghilterra': 1.5,
  // Tier 2 - 2.0
  'Spagna': 2.0, 'Germania': 2.0, 'Portogallo': 2.0, 'Olanda': 2.0, 'Belgio': 2.0,
  // Tier 3 - 3.0
  'Croazia': 3.0, 'Uruguay': 3.0, 'Colombia': 3.0, 'Marocco': 3.0,
  'Svizzera': 3.0, 'Austria': 3.0, 'Senegal': 3.0,
  // Tier 4 - 4.0
  'USA': 4.0, 'Messico': 4.0, 'Giappone': 4.0, 'Corea del Sud': 4.0,
  'Iran': 4.0, 'Ecuador': 4.0, 'Paraguay': 4.0, 'Norvegia': 4.0,
  'Svezia': 4.0, 'Turchia': 4.0, 'Rep. Ceca': 4.0, 'Scozia': 4.0,
  // Tier 5 - 6.0
  'Australia': 6.0, 'Qatar': 6.0, 'Arabia Saudita': 6.0, 'Panama': 6.0,
  "Costa d'Avorio": 6.0, 'Egitto': 6.0, 'Algeria': 6.0, 'Ghana': 6.0,
  'Sudafrica': 6.0, 'Tunisia': 6.0, 'Bosnia': 6.0, 'Iraq': 6.0,
  // Tier 6 - 10.0
  'Canada': 10.0, 'Uzbekistan': 10.0, 'Giordania': 10.0, 'Capo Verde': 10.0,
  'Curacao': 10.0, 'Haiti': 10.0, 'Nuova Zelanda': 10.0, 'RD Congo': 10.0,
};

export const FLAGS: Record<NationName, string> = {
  'Canada': '🇨🇦', 'Spagna': '🇪🇸', 'Giappone': '🇯🇵', 'Marocco': '🇲🇦',
  'Messico': '🇲🇽', 'Germania': '🇩🇪', 'Svizzera': '🇨🇭', 'Brasile': '🇧🇷',
  'USA': '🇺🇸', 'Portogallo': '🇵🇹', 'Norvegia': '🇳🇴', 'Belgio': '🇧🇪',
  'Argentina': '🇦🇷', 'Francia': '🇫🇷', 'Inghilterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Croazia': '🇭🇷',
  'Uruguay': '🇺🇾', 'Colombia': '🇨🇴', 'Olanda': '🇳🇱',
};

// Risultati squadre (aggiornare in tempo reale o via API)
export const SQUAD_RESULTS: Record<NationName, SquadResult> = {
  'Canada':    { wins: 0, draws: 0, losses: 3, groupWin: false, advance: false },
  'Spagna':    { wins: 2, draws: 1, losses: 0, groupWin: true,  advance: true  },
  'Giappone':  { wins: 1, draws: 1, losses: 1, groupWin: false, advance: false },
  'Marocco':   { wins: 2, draws: 0, losses: 1, groupWin: false, advance: true  },
  'Messico':   { wins: 1, draws: 0, losses: 2, groupWin: false, advance: false },
  'Germania':  { wins: 2, draws: 1, losses: 0, groupWin: true,  advance: true  },
  'Svizzera':  { wins: 1, draws: 1, losses: 1, groupWin: false, advance: false },
  'Brasile':   { wins: 3, draws: 0, losses: 0, groupWin: true,  advance: true  },
  'USA':       { wins: 1, draws: 1, losses: 1, groupWin: false, advance: false },
  'Portogallo':{ wins: 2, draws: 1, losses: 0, groupWin: true,  advance: true  },
  'Norvegia':  { wins: 0, draws: 1, losses: 2, groupWin: false, advance: false },
  'Belgio':    { wins: 2, draws: 0, losses: 1, groupWin: false, advance: true  },
};

// Team partecipanti al gioco
export const TEAMS: Team[] = [
  {
    id: 1,
    name: "Varrà un Molino?",
    players: "Andrea & Ciccio",
    color: "#F5A623",
    squads: ['Canada', 'Spagna', 'Giappone', 'Marocco'],
  },
  {
    id: 2,
    name: "Non dire Gatto…",
    players: "Vittorio & Peppe",
    color: "#00C853",
    squads: ['Messico', 'Germania', 'Svizzera', 'Brasile'],
  },
  {
    id: 3,
    name: "Bedbanny FC",
    players: "Corrado & Gigi",
    color: "#2196F3",
    squads: ['USA', 'Portogallo', 'Norvegia', 'Belgio'],
  },
];

// Partite (dati mock - sostituire con API reale)
export const MATCHES: Match[] = [
  { id: 1,  group: 'Gruppo A', home: 'Spagna',    away: 'Marocco',   homeScore: 2, awayScore: 1, status: 'FT',   date: '12 Giu' },
  { id: 2,  group: 'Gruppo A', home: 'Spagna',    away: 'Canada',    homeScore: 3, awayScore: 0, status: 'FT',   date: '16 Giu' },
  { id: 3,  group: 'Gruppo A', home: 'Marocco',   away: 'Canada',    homeScore: 1, awayScore: 0, status: 'FT',   date: '20 Giu' },
  { id: 4,  group: 'Gruppo B', home: 'Brasile',   away: 'Germania',  homeScore: 2, awayScore: 1, status: 'FT',   date: '13 Giu' },
  { id: 5,  group: 'Gruppo B', home: 'Germania',  away: 'Svizzera',  homeScore: 3, awayScore: 2, status: 'FT',   date: '17 Giu' },
  { id: 6,  group: 'Gruppo B', home: 'Brasile',   away: 'Svizzera',  homeScore: 2, awayScore: 0, status: 'FT',   date: '21 Giu' },
  { id: 7,  group: 'Gruppo C', home: 'Portogallo',away: 'Norvegia',  homeScore: 2, awayScore: 2, status: 'FT',   date: '14 Giu' },
  { id: 8,  group: 'Gruppo C', home: 'Belgio',    away: 'USA',       homeScore: 1, awayScore: 1, status: 'FT',   date: '14 Giu' },
  { id: 9,  group: 'Gruppo C', home: 'Portogallo',away: 'Belgio',    homeScore: 2, awayScore: 1, status: 'FT',   date: '18 Giu' },
  { id: 10, group: 'Ottavi',   home: 'Spagna',    away: 'USA',       homeScore: null, awayScore: null, status: 'NS',   date: '28 Giu' },
  { id: 11, group: 'Ottavi',   home: 'Brasile',   away: 'Belgio',    homeScore: null, awayScore: null, status: 'LIVE', date: 'Oggi', minute: 67 },
  { id: 12, group: 'Ottavi',   home: 'Germania',  away: 'Marocco',   homeScore: null, awayScore: null, status: 'NS',   date: '29 Giu' },
  { id: 13, group: 'Ottavi',   home: 'Portogallo',away: 'Messico',   homeScore: null, awayScore: null, status: 'NS',   date: '29 Giu' },
];
