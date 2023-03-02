import { event, eventable, types } from "../../league-core";
import BroadCastError from "./error/BroadCastError";

@eventable
export default class WeaponService {
  constructor(readonly config: types.weapon.Config) {}

  @event('tdm.weapon.request')
  weaponRequest(player: PlayerMp, choice: string[]) {
    player.removeAllWeapons()

    if (!this.isValid(choice)) {
      player.giveWeapon('weapon_bat', 1)
      throw new BroadCastError('Invalid choice', player)
    }

    choice.forEach(hash => player.giveWeapon(hash, this.config.ammo))
  }

  private isValid(choice: string[]) {
    return choice.length > this.config.slots && choice.every((hash) => this.flat.includes(hash))
  }

  get flat() {
    return Object.values(this.config.id).flat()
  }
}