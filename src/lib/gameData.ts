export type NationName = string;
export interface SquadResult {
  wins: number;
  draws: number;
  losses: number;
  groupWin: boolean;
  advance: boolean;
  finalist: boolean;
  champion: boolean;
}
export interface Squad { name: NationName; flag: string; coefficient: number; result: SquadResult; }
export interface Team { id: number; name: string; players: string; color: string; squads: NationName[]; }
export interface Match { id: number; group: string; home: NationName; away: NationName; homeScore: number | null; awayScore: number | null; status: 'FT' | 'LIVE' | 'NS'; date: string; minute?: number; }

export const COEFFICIENTS: Record<NationName, number> = {
  'Argentina': 1.5, 'Brasile': 1.5, 'Francia': 1.5, 'Inghilterra': 1.5,
  'Spagna': 2.0, 'Germania': 2.0, 'Portogallo': 2.0, 'Olanda': 2.0, 'Belgio': 2.0,
  'Croazia': 3.0, 'Uruguay': 3.0, 'Colombia': 3.0, 'Marocco': 3.0, 'Svizzera': 3.0, 'Austria': 3.0, 'Senegal': 3.0,
  'USA': 4.0, 'Messico': 4.0, 'Giappone': 4.0, 'Corea del Sud': 4.0, 'Iran': 4.0, 'Ecuador': 4.0, 'Paraguay': 4.0, 'Norvegia': 4.0, 'Svezia': 4.0, 'Turchia': 4.0, 'Rep. Ceca': 4.0, 'Scozia': 4.0,
  'Australia': 6.0, 'Qatar': 6.0, 'Arabia Saudita': 6.0, 'Panama': 6.0, "Costa d'Avorio": 6.0, 'Egitto': 6.0, 'Algeria': 6.0, 'Ghana': 6.0, 'Sudafrica': 6.0, 'Tunisia': 6.0, 'Bosnia': 6.0, 'Iraq': 6.0,
  'Canada': 10.0, 'Uzbekistan': 10.0, 'Giordania': 10.0, 'Capo Verde': 10.0, 'Curacao': 10.0, 'Haiti': 10.0, 'Nuova Zelanda': 10.0, 'RD Congo': 10.0,
};

export const FLAGS: Record<NationName, string> = {
  'Canada': '🇨🇦', 'Spagna': '🇪🇸', 'Giappone': '🇯🇵', 'Marocco': '🇲🇦',
  'Messico': '🇲🇽', 'Germania': '🇩🇪', 'Svizzera': '🇨🇭', 'Brasile': '🇧🇷',
  'USA': '🇺🇸', 'Portogallo': '🇵🇹', 'Norvegia': '🇳🇴', 'Belgio': '🇧🇪',
  'Argentina': '🇦🇷', 'Francia': '🇫🇷', 'Inghilterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Croazia': '🇭🇷',
  'Uruguay': '🇺🇾', 'Colombia': '🇨🇴', 'Olanda': '🇳🇱', 'Sudafrica': '🇿🇦',
  'Bosnia': '🇧🇦', 'Qatar': '🇶🇦', 'Haiti': '🇭🇹', 'Scozia': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Paraguay': '🇵🇾', 'Australia': '🇦🇺', 'Turchia': '🇹🇷', 'Curacao': '🇨🇼',
  "Costa d'Avorio": '🇨🇮', 'Ecuador': '🇪🇨', 'Svezia': '🇸🇪', 'Tunisia': '🇹🇳',
  'Egitto': '🇪🇬', 'Iran': '🇮🇷', 'Nuova Zelanda': '🇳🇿', 'Capo Verde': '🇨🇻',
  'Arabia Saudita': '🇸🇦', 'Iraq': '🇮🇶', 'Senegal': '🇸🇳', 'RD Congo': '🇨🇩',
  'Uzbekistan': '🇺🇿', 'Rep. Ceca': '🇨🇿', 'Corea del Sud': '🇰🇷',
};

export const SQUAD_RESULTS: Record<NationName, SquadResult> = {
  'Canada':    { wins: 1, draws: 1, losses: 0, groupWin: false, advance: false, finalist: false, champion: false },
  'Spagna':    { wins: 1, draws: 1, losses: 0, groupWin: false, advance: false, finalist: false, champion: false },
  'Giappone':  { wins: 1, draws: 1, losses: 0, groupWin: false, advance: false, finalist: false, champion: false },
  'Marocco':   { wins: 1, draws: 1, losses: 0, groupWin: false, advance: false, finalist: false, champion: false },
  'Messico':   { wins: 2, draws: 0, losses: 0, groupWin: false, advance: false, finalist: false, champion: false },
  'Germania':  { wins: 2, draws: 0, losses: 0, groupWin: false, advance: false, finalist: false, champion: false },
  'Svizzera':  { wins: 1, draws: 1, losses: 0, groupWin: false, advance: false, finalist: false, champion: false },
  'Brasile':   { wins: 1, draws: 1, losses: 0, groupWin: false, advance: false, finalist: false, champion: false },
  'USA':       { wins: 2, draws: 0, losses: 0, groupWin: false, advance: false, finalist: false, champion: false },
  'Portogallo':{ wins: 0, draws: 1, losses: 0, groupWin: false, advance: false, finalist: false, champion: false },
  'Norvegia':  { wins: 2, draws: 0, losses: 0, groupWin: false, advance: false, finalist: false, champion: false },
  'Belgio':    { wins: 0, draws: 2, losses: 0, groupWin: false, advance: false, finalist: false, champion: false },
};

export const TEAMS: Team[] = [
  { id: 1, name: "Varrà un Molino?", players: "Andrea & Ciccio", color: "#F5A623", squads: ['Canada', 'Spagna', 'Giappone', 'Marocco'] },
  { id: 2, name: "Non dire Gatto…", players: "Vittorio & Peppe", color: "#00C853", squads: ['Messico', 'Germania', 'Svizzera', 'Brasile'] },
  { id: 3, name: "Bedbanny FC", players: "Corrado & Gigi", color: "#2196F3", squads: ['USA', 'Portogallo', 'Norvegia', 'Belgio'] },
];

export const MATCHES: Match[] = [
  { id: 1,  group: 'Gruppo A', home: 'Messico',    away: 'Sudafrica',      homeScore: null, awayScore: null, status: 'NS', date: '11 Giu 21:00' },
  { id: 2,  group: 'Gruppo A', home: 'Messico',    away: 'Corea del Sud',  homeScore: null, awayScore: null, status: 'NS', date: '19 Giu 03:00' },
  { id: 3,  group: 'Gruppo A', home: 'Rep. Ceca',  away: 'Messico',        homeScore: null, awayScore: null, status: 'NS', date: '24 Giu 21:00' },
  { id: 4,  group: 'Gruppo B', home: 'Canada',     away: 'Bosnia',         homeScore: null, awayScore: null, status: 'NS', date: '12 Giu 21:00' },
  { id: 5,  group: 'Gruppo B', home: 'Qatar',      away: 'Svizzera',       homeScore: null, awayScore: null, status: 'NS', date: '13 Giu 21:00' },
  { id: 6,  group: 'Gruppo B', home: 'Svizzera',   away: 'Bosnia',         homeScore: null, awayScore: null, status: 'NS', date: '18 Giu 21:00' },
  { id: 7,  group: 'Gruppo B', home: 'Canada',     away: 'Qatar',          homeScore: null, awayScore: null, status: 'NS', date: '19 Giu 24:00' },
  { id: 8,  group: 'Gruppo B', home: 'Svizzera',   away: 'Canada',         homeScore: null, awayScore: null, status: 'NS', date: '24 Giu 21:00' },
  { id: 9,  group: 'Gruppo C', home: 'Brasile',    away: 'Marocco',        homeScore: null, awayScore: null, status: 'NS', date: '14 Giu 00:00' },
  { id: 10, group: 'Gruppo C', home: 'Brasile',    away: 'Haiti',          homeScore: null, awayScore: null, status: 'NS', date: '20 Giu 03:00' },
  { id: 11, group: 'Gruppo C', home: 'Scozia',     away: 'Marocco',        homeScore: null, awayScore: null, status: 'NS', date: '20 Giu 24:00' },
  { id: 12, group: 'Gruppo C', home: 'Brasile',    away: 'Scozia',         homeScore: null, awayScore: null, status: 'NS', date: '25 Giu 00:00' },
  { id: 13, group: 'Gruppo C', home: 'Marocco',    away: 'Haiti',          homeScore: null, awayScore: null, status: 'NS', date: '25 Giu 00:00' },
  { id: 14, group: 'Gruppo D', home: 'USA',        away: 'Paraguay',       homeScore: null, awayScore: null, status: 'NS', date: '13 Giu 03:00' },
  { id: 15, group: 'Gruppo D', home: 'USA',        away: 'Australia',      homeScore: null, awayScore: null, status: 'NS', date: '19 Giu 21:00' },
  { id: 16, group: 'Gruppo D', home: 'USA',        away: 'Turchia',        homeScore: null, awayScore: null, status: 'NS', date: '25 Giu 21:00' },
  { id: 17, group: 'Gruppo E', home: 'Germania',   away: 'Curacao',        homeScore: null, awayScore: null, status: 'NS', date: '14 Giu 19:00' },
  { id: 18, group: 'Gruppo E', home: 'Germania',   away: "Costa d'Avorio", homeScore: null, awayScore: null, status: 'NS', date: '20 Giu 22:00' },
  { id: 19, group: 'Gruppo E', home: 'Ecuador',    away: 'Germania',       homeScore: null, awayScore: null, status: 'NS', date: '25 Giu 22:00' },
  { id: 20, group: 'Gruppo F', home: 'Olanda',     away: 'Giappone',       homeScore: null, awayScore: null, status: 'NS', date: '14 Giu 22:00' },
  { id: 21, group: 'Gruppo F', home: 'Tunisia',    away: 'Giappone',       homeScore: null, awayScore: null, status: 'NS', date: '20 Giu 06:00' },
  { id: 22, group: 'Gruppo F', home: 'Giappone',   away: 'Svezia',         homeScore: null, awayScore: null, status: 'NS', date: '25 Giu 22:00' },
  { id: 23, group: 'Gruppo G', home: 'Belgio',     away: 'Egitto',         homeScore: null, awayScore: null, status: 'NS', date: '15 Giu 21:00' },
  { id: 24, group: 'Gruppo G', home: 'Belgio',     away: 'Iran',           homeScore: null, awayScore: null, status: 'NS', date: '21 Giu 21:00' },
  { id: 25, group: 'Gruppo G', home: 'Belgio',     away: 'Nuova Zelanda',  homeScore: null, awayScore: null, status: 'NS', date: '26 Giu 21:00' },
  { id: 26, group: 'Gruppo H', home: 'Spagna',     away: 'Capo Verde',     homeScore: null, awayScore: null, status: 'NS', date: '15 Giu 18:00' },
  { id: 27, group: 'Gruppo H', home: 'Spagna',     away: 'Arabia Saudita', homeScore: null, awayScore: null, status: 'NS', date: '21 Giu 18:00' },
  { id: 28, group: 'Gruppo H', home: 'Spagna',     away: 'Uruguay',        homeScore: null, awayScore: null, status: 'NS', date: '26 Giu 22:00' },
  { id: 29, group: 'Gruppo I', home: 'Iraq',       away: 'Norvegia',       homeScore: null, awayScore: null, status: 'NS', date: '17 Giu 00:00' },
  { id: 30, group: 'Gruppo I', home: 'Francia',    away: 'Norvegia',       homeScore: null, awayScore: null, status: 'NS', date: '22 Giu 00:00' },
  { id: 31, group: 'Gruppo I', home: 'Norvegia',   away: 'Senegal',        homeScore: null, awayScore: null, status: 'NS', date: '27 Giu 00:00' },
  { id: 32, group: 'Gruppo K', home: 'Portogallo', away: 'RD Congo',       homeScore: null, awayScore: null, status: 'NS', date: '17 Giu 19:00' },
  { id: 33, group: 'Gruppo K', home: 'Portogallo', away: 'Uzbekistan',     homeScore: null, awayScore: null, status: 'NS', date: '22 Giu 19:00' },
  { id: 34, group: 'Gruppo K', home: 'Portogallo', away: 'Colombia',       homeScore: null, awayScore: null, status: 'NS', date: '27 Giu 22:00' },
];
