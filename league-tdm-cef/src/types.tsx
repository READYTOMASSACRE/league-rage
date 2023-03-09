export interface IPlayers {
  id: number
  name: string
  kills: number
  death: number
  assists: number
  ping: number
  role: string
  team: string
  lvl: number
}

export interface ITeams {
  id: number
  name: string
  role: string
  score: number
  color: string
}

export interface ICurrentPlayer {
  id: number
}

export interface IMessage {
  id: string
  text: string
  type: string
  active: boolean
  alive: number
}