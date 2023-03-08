import { event, eventable, log } from "../../league-core";
import { Events, tdm, weapon } from "../../league-core/src/types";
import { ILanguage, Lang } from "../../league-lang/language";
import BroadCastError from "./error/BroadCastError";
import PlayerService from "./PlayerService";

@eventable
export default class WeaponService {
  constructor(
    readonly config: weapon.Config,
    readonly playerService: PlayerService,
    readonly lang: ILanguage,
  ) {}

  @log
  @event(Events["tdm.round.prepare"])
  tdmRoundPrepare() {
    mp.players.forEachFast((p) => this.playerService.setWeaponState(p, tdm.WeaponState.idle))
  }
  
  @log
  @event(Events["tdm.round.end"])
  tdmRoundEnd() {
    mp.players.forEachFast((p) => this.playerService.setWeaponState(p, tdm.WeaponState.has))
  }

  @log
  @event(Events["tdm.weapon.request"])
  weaponRequest(player: PlayerMp, choice: string[]) {
    this.validateRequest(player, choice)

    player.removeAllWeapons()
    choice.forEach(hash => player.giveWeapon(hash, this.config.ammo))

    this.playerService.setWeaponState(player, tdm.WeaponState.has)
  }

  @log
  private validateRequest(player: PlayerMp, choice: string[]) {
    if (!mp.players.exists(player)) {
      throw new Error(this.lang.get(Lang["error.player.not_found"], { player: player?.id }))
    }

    if (!choice?.length) {
      throw new BroadCastError(this.lang.get(Lang["error.weapon.empty_choice"]), player)
    }

    if (!this.isValidChoice(choice)) {
      player.giveWeapon('weapon_bat', 1)
      throw new BroadCastError(this.lang.get(Lang["error.weapon.not_configured"]), player)
    }

    if (!this.playerService.hasState(player, tdm.State.alive)) {
      throw new BroadCastError(this.lang.get(Lang["error.player.not_in_round"]), player)
    }

    if (this.playerService.hasWeaponState(player, tdm.WeaponState.has)) {
      throw new BroadCastError(this.lang.get(Lang["error.weapon.already_equipped"]), player)
    }
  }

  @log
  private isValidChoice(choice: string[]) {
    return choice.length > this.config.slotCount && choice.every((hash) => this.flat.includes(hash))
  }

  get flat() {
    return Object.values(this.config.category).flat()
  }
}