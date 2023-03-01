export interface IPlayers {
  id: number,
  name: string,
  kills: number,
  death: number,
  assists: number,
  ping: number,
  role: string;
  team: string,
}

export interface ITeams {
  id: number;
  name: string;
  role: string;
  score: number;
}

export interface ICurrentPlayer {
  id: number;
}