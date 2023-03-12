export interface IMessage {
  id: string
  text: string
  type: string
  active: boolean
  alive: number
}

export type IWeapon = {
  name?: string
  damage?: number
  firerate?: number
  range?: number
  magazine?: number
}

export type Categories = {
  [key:string]: IWeapon[]
}