import { event, eventable, logClient, types } from "../../league-core/client";
import PlayerService from "./PlayerService";
import weapons from "./weapons";

@eventable
export default class WeaponService {
  public weaponConfig?: types.weapon.Config
  constructor(readonly playerService: PlayerService) {}

  @logClient
  @event("outgoingDamage")
  outgoingDamage(
    sourceEntity: EntityMp,
    targetEntity: EntityMp,
    targetPlayer: PlayerMp,
    weapon: number,
    boneIndex: number,
    damage: number
  ): boolean | void {
    try {
      if (
        this.playerService.alive ||
        this.playerService.sameTeam(targetPlayer)
      ) {
        return true
      }

      const newDamage = this.calculateDamage(weapon, damage)
      } catch (err) {

    }
  }


  public calculateDamage(weapon: number, damage: number) {
    if (!this.weaponConfig) {
      return damage
    }

    const name = `weapon_${weapons[weapon]}`
    const specificDamage = this.weaponConfig.damage.weapon[name]

    if (typeof specificDamage !== 'undefined') {
      return specificDamage
    }

    const category = this.getWeaponCategory(name)
    const groupDamage = this.weaponConfig.damage.category[category]

    if (typeof groupDamage !== 'undefined') {
      return groupDamage
    }

    return damage
  }

  public getWeaponCategory(name: string): string | undefined {
    if (this.weaponConfig) {
      return
    }

    const [category] = Object
      .values(this.weaponConfig.category)
      .find(([, weapons]) => weapons.includes(name)) || []

    return category
  }
}