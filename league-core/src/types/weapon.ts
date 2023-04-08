export enum Category {
  melee = 'melee',
  pistols = 'pistols',
  submachine_guns = 'submachine_guns',
  shotguns = 'shotguns',
  assaul_trifles = 'assaul_trifles',
  light_rifles = 'light_rifles',
  sniper_rifles = 'sniper_rifles',
}

export interface Config {
  ammo: number
  friendlyfire: boolean
  slot: Record<string, Category[]>
  category: Record<Category, string[]>
  selectTime: number
  damage: {
    weapon: Record<string, number>
    category: Partial<Record<Category, number>>
  }
}