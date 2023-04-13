export type CurrentPlayer = {
  visible: boolean
  name: string
  kill: number
  death: number
  assists: number
  id: number
  spectate: string[]
}

export type SpectateData = {
  active: boolean
  current?: CurrentPlayer
}