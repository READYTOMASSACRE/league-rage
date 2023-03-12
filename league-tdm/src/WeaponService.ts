import { command, commandable, event, eventable, log } from "../../league-core";
import { Events, tdm, weapon } from "../../league-core/src/types";
import { Category } from "../../league-core/src/types/weapon";
import { ILanguage, Lang } from "../../league-lang/language";
import BroadCastError from "./error/BroadCastError";
import PlayerService from "./PlayerService";

@eventable
@commandable
export default class WeaponService {
  constructor(
    readonly config: weapon.Config,
    readonly playerService: PlayerService,
    readonly lang: ILanguage,
  ) {}

  @log
  @event(Events["tdm.round.prepare"])
  tdmRoundPrepare() {
    mp.players.forEachFast((p) => {
      p.removeAllWeapons()
      this.playerService.setWeaponSlot(p)
      this.playerService.setWeaponState(p, tdm.WeaponState.idle)
    })
  }
  
  @log
  @event(Events["tdm.round.end"])
  tdmRoundEnd() {
    mp.players.forEachFast((p) => this.playerService.setWeaponState(p, tdm.WeaponState.has))
  }

  @log
  @event(Events["tdm.weapon.submit"])
  weaponRequest(player: PlayerMp, weapon?: string) {
    if (!weapon) {
      throw new BroadCastError(this.lang.get(Lang["error.weapon.weapon_not_found"]), player)
    }

    // weapon = `weapon_${weapon.replace(/^weapon_/, '')}`
    const slot = this.validateRequest(player, weapon)

    this.playerService.setWeaponSlot(player, slot, weapon, this.config.ammo)
  }

  @log
  @command(['w', 'weapon'], { desc: Lang["cmd.weapon"] })
  weaponRequestCmd(player: PlayerMp, fullText: string, description: string, weapon?: string) {
    if (!weapon) {
      return player.outputChatBox(description)
    }

    // weapon = `weapon_${weapon.replace(/^weapon_/, '')}`
    const slot = this.validateRequest(player, weapon)

    this.playerService.setWeaponSlot(player, slot, weapon, this.config.ammo)
  }

  @log
  @event(Events["tdm.player.damage.outgoing"])
  weaponDamage(player: PlayerMp, targetPlayer?: number, weapon?: string, damage?: number) {
    const target = mp.players.at(targetPlayer)

    if (!mp.players.exists(target)) {
      return false
    }

    if (
      !this.config.friendlyfire &&
      this.playerService.getTeam(player) === this.playerService.getTeam(target) &&
      this.playerService.hasState(player, tdm.State.alive)
    ) {
      return
    }

    weapon = `weapon_${weapon.replace(/^weapon_/, '')}`
    const category = this.getCategory(weapon)

    if (typeof this.config.damage.weapon[weapon] !== 'undefined') {
      damage = this.config.damage.weapon[weapon]
    } else if (typeof this.config.damage.category[category] !== 'undefined') {
      damage = this.config.damage.category[category]
    }

    const newHealth = player.health - damage
    const alive = newHealth > 0
    player.health = alive ? newHealth : 0

    for (const p of [player, target]) {
      p.call(Events["tdm.player.damage"], [player.id, target.id, weapon, damage, alive])
    }

    mp.events.call(Events["tdm.player.damage"], player.id, target.id, weapon, damage, alive)
  }

  @log
  private validateRequest(player: PlayerMp, weapon: string) {
    if (!mp.players.exists(player)) {
      throw new Error(this.lang.get(Lang["error.player.not_found"], { player: player?.id }))
    }

    if (!weapon) {
      throw new BroadCastError(this.lang.get(Lang["error.weapon.weapon_not_found"]), player)
    }

    if (!this.playerService.hasState(player, tdm.State.alive)) {
      throw new BroadCastError(this.lang.get(Lang["error.player.not_in_round"]), player)
    }

    if (this.playerService.hasWeaponState(player, tdm.WeaponState.has)) {
      throw new BroadCastError(this.lang.get(Lang["error.weapon.is_busy"]), player)
    }

    const category = this.getCategory(weapon)

    if (!category) {
      throw new BroadCastError(this.lang.get(Lang["error.weapon.category_not_found"], { name: weapon }), player)
    }

    const slot = this.getSlotByCategory(category)

    if (!slot) {
      throw new BroadCastError(this.lang.get(Lang["error.weapon.slot_not_found"], { category }), player)
    }

    const oldWeapon = this.playerService.getWeaponSlot(player, slot)

    if (oldWeapon) {
      throw new BroadCastError(this.lang.get(Lang["error.weapon.slot_is_busy"], { slot, weapon: oldWeapon }), player)
    }

    return slot
  }

  @log
  getCategory(weapon: string): Category | undefined {
    for (const [category, weapons] of Object.entries(this.config.category)) {
      if (weapons.includes(weapon)) {
        return <Category>category
      }
    }
  }

  @log
  getSlotByCategory(category: Category): string | undefined {
    for (const [slot, categories] of Object.entries(this.config.slot)) {
      if (categories.includes(category)) {
        return slot
      }
    }
  }
}