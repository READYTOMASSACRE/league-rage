import { RoundData } from "./tdm"

export type Weapon = {
  name: string
  damage: number
  firerate?: number
  range?: number
  magazine?: number
}

export type Team = {
  name: string
  color: string
  score: number
  players?: number[]
}

export type InfoPanel = {
  attackers: Team
  defenders: Team
  arena: string
  timeleft: number
  pause: boolean
}

export type Control = {
  key: string
  description: string
}

export type ChatPart = [string, string]
export type ChatMessage = ChatPart[]
export type ChatItem = { message: ChatPart[] }