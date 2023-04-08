import { userId } from "./common"
import { Role } from "./permission"
import { Arena, Team } from "./tdm"

export type StatisticConfig = {
  exp: {
    kill: number
    death: number
    assist: number
    win: number
    hit: number
    damageRecieved: number
    damageDone: number
    expToLvl: number
  }
}

export type Profile = {
  id: string
  lvl: number
  exp: number
  kill: number
  death: number
  assists: number
  damageDone: number
  damageRecieved: number
  hit: number
  name: string
  role: Role
  rating: number
  victory: number
  kda: number
  averageDamage: number
  wins: number
  loses: number
  draws: number
}

export type MongoProfile = Profile & { _id: any }

export type ClientProfile = Omit<Profile, 'password' | '_id'>

export type PlayerStat = {
  kill: number
  death: number
  assists: number
  damageDone: number
  damageRecieved: number
  hit: number
  exp: number
  name: string
  kda: number
}

export type TeamStat = {
  name: string
  players: Record<userId, PlayerStat>
}

export type Round = {
  id: number
  arenaId: number
  result: Team | "draw"
  [Team.attackers]: TeamStat
  [Team.defenders]: TeamStat
}

export type MongoRound = Round & { _id: any }

export type PanelData = {
  profile: ClientProfile
  rounds: Round[]
  visible: boolean
  arenas: Record<number, Arena>
}

export type AuthType = 'pending' | 'social' | 'auth' | 'error'