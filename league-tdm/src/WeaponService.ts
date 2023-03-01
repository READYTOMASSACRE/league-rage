import { event, eventable } from "../../league-core";

interface WeaponConfig {
  ammo: number
  categories: Record<string, string[]>
}
@eventable
export default class WeaponService {
  constructor(
    readonly ammo: number = 1000,
    
  ) {}

  @event('tdm.weapon.request')
  weaponRequest(player: PlayerMp, choice: string[]) {
    player.removeAllWeapons()

    choice.forEach(hash => player.giveWeapon(hash, this.ammo))
  }
}