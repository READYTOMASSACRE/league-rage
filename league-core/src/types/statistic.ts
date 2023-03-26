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

export type Round = {
  id: number
  arenaId: number
  result: Team | "draw"
  [Team.attackers]: {
    name: string
    players: Record<userId, PlayerStat>
  }
  [Team.defenders]: {
    name: string
    players: Record<userId, PlayerStat>
  }
}

export type PanelData = {
  profile: ClientProfile
  rounds: Round[]
  visible: boolean
}