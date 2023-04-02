import { userId } from "./common"
import { Team } from "./tdm"

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
  _id: any
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
}

export type ClientProfile = Omit<Profile, 'password'>

export type PlayerStat = {
  kill: number
  death: number
  assists: number
  damageDone: number
  damageRecieved: number
  hit: number
  exp: number
  name: string
}

export type TeamStat = {
  name: string
  players: Record<userId, PlayerStat>
}

export type Round = {
  _id: any
  id: number
  arenaId: number
  result: Team | "draw"
  [Team.attackers]: TeamStat
  [Team.defenders]: TeamStat
}

export type PanelData = {
  profile: ClientProfile
  rounds: Round[]
  visible: boolean
}