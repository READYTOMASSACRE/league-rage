export interface Player {
  id: number
  name: string
  current: boolean
  kills: number
  death: number
  assists: number
  ping: number
  role: string
  team: string
  lvl: number
}

export interface Team {
  id: number
  name: string
  role: string
  score: number
  color: string
}

export type Data = {
  players: Player[]
  teams: Team[]
}