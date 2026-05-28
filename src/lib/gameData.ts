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

// Risultati squadre — tutti a zero, si aggiornano via pagina admin
export const SQUAD_RESULTS: Record<NationName, SquadResult> = {
  'Canada':    { wins: 0, draws: 0, losses: 0, groupWin: false, advance: false },
  'Spagna':    { wins: 0, draws: 0, losses: 0, groupWin: false, advance: false },
  'Giappone':  { wins: 0, draws: 0, losses: 0, groupWin: false, advance: false },
  'Marocco':   { wins: 0, draws: 0, losses: 0, groupWin: false, advance: false },
  'Messico':   { wins: 0, draws: 0, losses: 0, groupWin: false, advance: false },
  'Germania':  { wins: 0, draws: 0, losses: 0, groupWin: false, advance: false },
  'Svizzera':  { wins: 0, draws: 0, losses: 0, groupWin: false, advance: false },
  'Brasile':   { wins: 0, draws: 0, losses: 0, groupWin: false, advance: false },
  'USA':       { wins: 0, draws: 0, losses: 0, groupWin: false, advance: false },
  'Portogallo':{ wins: 0, draws: 0, losses: 0, groupWin: false, advance: false },
  'Norvegia':  { wins: 0, draws: 0, losses: 0, groupWin: false, advance: false },
  'Belgio':    { wins: 0, draws: 0, losses: 0, groupWin: false, advance: false },
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

// Partite — vuote, si popolano con l'API o manualmente
export const MATCHES: Match[] = [
  { id: 1,  group: 'Gruppo A', home: 'Spagna',    away: 'Marocco',    homeScore: null, awayScore: null, status: 'NS', date: '12 Giu' },
  { id: 2,  group: 'Gruppo A', home: 'Spagna',    away: 'Canada',     homeScore: null, awayScore: null, status: 'NS', date: '16 Giu' },
  { id: 3,  group: 'Gruppo A', home: 'Marocco',   away: 'Canada',     homeScore: null, awayScore: null, status: 'NS', date: '20 Giu' },
  { id: 4,  group: 'Gruppo B', home: 'Brasile',   away: 'Germania',   homeScore: null, awayScore: null, status: 'NS', date: '13 Giu' },
  { id: 5,  group: 'Gruppo B', home: 'Germania',  away: 'Svizzera',   homeScore: null, awayScore: null, status: 'NS', date: '17 Giu' },
  { id: 6,  group: 'Gruppo B', home: 'Brasile',   away: 'Svizzera',   homeScore: null, awayScore: null, status: 'NS', date: '21 Giu' },
  { id: 7,  group: 'Gruppo C', home: 'Portogallo',away: 'Norvegia',   homeScore: null, awayScore: null, status: 'NS', date: '14 Giu' },
  { id: 8,  group: 'Gruppo C', home: 'Belgio',    away: 'USA',        homeScore: null, awayScore: null, status: 'NS', date: '14 Giu' },
  { id: 9,  group: 'Gruppo C', home: 'Portogallo',away: 'Belgio',     homeScore: null, awayScore: null, status: 'NS', date: '18 Giu' },
];
