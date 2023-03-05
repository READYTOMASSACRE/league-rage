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
  slotCount: number
  category: Record<Category, string[]>
  damage: {
    weapon: Record<string, number>
    category: Record<Category, number>
  }
}