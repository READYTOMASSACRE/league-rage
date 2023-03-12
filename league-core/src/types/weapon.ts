export enum Category {
  melee = 'melee',
  handguns = 'handguns',
  submachine = 'submachine',
  shotguns = 'shotguns',
  rifles = 'rifles',
  light_rifles = 'light_rifles',
  sniper_rifles = 'sniper_rifles',
}

export interface Config {
  ammo: number
  friendlyfire: boolean
  slot: Record<string, Category[]>
  category: Record<Category, string[]>
  damage: {
    weapon: Record<string, number>
    category: Partial<Record<Category, number>>
  }
}