import { event, eventable, log } from "../../league-core";
import { Events, tdm, weapon } from "../../league-core/src/types";
import BroadCastError from "./error/BroadCastError";
import PlayerService from "./PlayerService";

@eventable
export default class WeaponService {
  constructor(
    readonly config: weapon.Config,
    readonly playerService: PlayerService,
  ) {}

  @log
  @event(Events["tdm.round.prepare"])
  tdmRoundPrepare() {
    mp.players.apply((p) => this.playerService.setWeaponState(p, tdm.WeaponState.idle))
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
      throw new Error('Player is not exists: ' + player?.id)
    }

    if (!choice?.length) {
      throw new BroadCastError('Choice is empty', player)
    }

    if (!this.isValidChoice(choice)) {
      player.giveWeapon('weapon_bat', 1)
      throw new BroadCastError('Weapon choice is not in config', player)
    }

    if (!this.playerService.hasState(player, tdm.State.alive)) {
      throw new BroadCastError('Not in round', player)
    }

    if (this.playerService.hasWeaponState(player, tdm.WeaponState.has)) {
      throw new BroadCastError('Already equipped', player)
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