export interface Player {
  name: string
  color: string
}

export interface DeathLog {
  killer: Player
  weapon: string
  victim: Player
}

export interface DeathLogData {
  deathlog: DeathLog
  alive: number
  id: string
}