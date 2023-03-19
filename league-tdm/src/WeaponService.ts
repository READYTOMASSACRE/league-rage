import { command, commandable, event, eventable, log } from "../../league-core";
import { Events, tdm, weapon } from "../../league-core/src/types";
import { State, WeaponState } from "../../league-core/src/types/tdm";
import { Category } from "../../league-core/src/types/weapon";
import { ILanguage, Lang } from "../../league-lang/language";
import BroadCastError from "./error/BroadCastError";
import PlayerService from "./PlayerService";
import RoundService from "./RoundService";
import TaskManager, { Task } from "./TaskManager";

@eventable
@commandable
export default class WeaponService {
  private delayedTasks: Task[] = []

  constructor(
    readonly config: weapon.Config,
    readonly playerService: PlayerService,
    readonly roundService: RoundService,
    readonly lang: ILanguage,
  ) {}

  @log
  @event(Events["tdm.round.prepare"])
  tdmRoundPrepare(_: number, players: number[]) {
    this.clearDelayedTasks()
    this.delayedTasks = [TaskManager.add(() => {
      players.forEach((p) => {
        if (!mp.players.exists(p)) return

        if (this.playerService.hasState(p, State.alive)) {
          this.playerService.setWeaponState(p, WeaponState.has)
        }
      })
    }, this.config.selectTime)]

    mp.players.forEachFast((p) => {
      p.removeAllWeapons()
      this.playerService.setWeaponSlot(p)
      this.playerService.setWeaponState(p, tdm.WeaponState.idle)
    })
  }
  
  @log
  @event(Events["tdm.round.end"])
  tdmRoundEnd() {
    this.clearDelayedTasks()
    mp.players.forEachFast((p) => {
      p.removeAllWeapons()
      this.playerService.setWeaponSlot(p)
      this.playerService.setWeaponState(p, tdm.WeaponState.has)
    })
  }

  @log
  @event(Events["tdm.round.add"])
  tdmRoundAdd(id: number, manual?: boolean) {
    this.playerService.setWeaponSlot(id)
    this.playerService.setWeaponState(id, tdm.WeaponState.idle)

    if (manual) {
      this.delayedTasks.push(
        TaskManager.add(() => {
          if (!this || !mp.players.exists(id)) return
  
          this.playerService.setWeaponState(id, WeaponState.has)
        }, this.config.selectTime)
      )
    }
  }

  @log
  @event(Events["tdm.round.remove"])
  tdmRoundRemove(id: number, manual?: boolean) {
    this.playerService.setWeaponSlot(id)
    this.playerService.setWeaponState(id, tdm.WeaponState.idle)
  }

  @log
  @event(Events["tdm.weapon.submit"])
  weaponRequest(player: PlayerMp, weapon?: string) {
    if (!weapon) {
      throw new BroadCastError(this.lang.get(Lang["error.weapon.weapon_not_found"]), player)
    }

    const slot = this.validateRequest(player, weapon)

    this.playerService.setWeaponSlot(player, slot, weapon, this.config.ammo)
  }

  @log
  @command(['w', 'weapon'], { desc: Lang["cmd.weapon"] })
  weaponRequestCmd(player: PlayerMp, fullText: string, description: string, weapon?: string) {
    if (!weapon) {
      return player.outputChatBox(description)
    }

    const slot = this.validateRequest(player, weapon)

    this.playerService.setWeaponSlot(player, slot, weapon, this.config.ammo)
  }

  @log
  @event(Events["tdm.player.incoming_damage"])
  weaponDamage(player: PlayerMp, sourcePlayer?: number, weapon?: string, hit?: number, damage?: number) {
    const source = mp.players.at(sourcePlayer)

    if (!mp.players.exists(source)) {
      return false
    }

    if (
      !this.config.friendlyfire &&
      this.playerService.getTeam(player) === this.playerService.getTeam(source) &&
      this.playerService.hasState(player, tdm.State.alive)
    ) {
      return
    }

    const category = this.getCategory(weapon)

    if (typeof this.config.damage.weapon[weapon] !== 'undefined') {
      damage = this.config.damage.weapon[weapon] * hit
    } else if (typeof this.config.damage.category[category] !== 'undefined') {
      damage = this.config.damage.category[category] * hit
    }

    const alive = this.playerService.isAlive(player)

    if (alive) {
      const newHealth = this.playerService.getHealth(player) - damage
      this.playerService.setHealth(player, newHealth)
  
      for (const p of [player, source]) {
        p.call(Events["tdm.player.damage"], [player.id, source.id, weapon, damage])
      }
  
      mp.events.call(Events["tdm.player.damage"], player.id, source.id, weapon, damage)
  
      return [player.id, source.id, weapon, damage, newHealth, player.getVariable('health')]
    }
  }

  @log
  private validateRequest(player: PlayerMp, weapon: string) {
    if (!mp.players.exists(player)) {
      throw new Error(this.lang.get(Lang["error.player.not_found"], { player: player?.id }))
    }

    if (!weapon) {
      throw new BroadCastError(this.lang.get(Lang["error.weapon.weapon_not_found"]), player)
    }

    if (!this.roundService.running) {
      throw new BroadCastError(this.lang.get(Lang["tdm.round.is_not_running"]), player)
    }

    if (!this.playerService.hasWeaponState(player, tdm.WeaponState.idle)) {
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
      throw new BroadCastError(this.lang.get(Lang["error.weapon.slot_is_busy"], {
        slot, weapon: typeof oldWeapon === 'string' ? oldWeapon : ''
      }), player)
    }

    return slot
  }

  getCategory(weapon: string): Category | undefined {
    for (const [category, weapons] of Object.entries(this.config.category)) {
      if (weapons.includes(weapon)) {
        return <Category>category
      }
    }
  }

  getSlotByCategory(category: Category): string | undefined {
    for (const [slot, categories] of Object.entries(this.config.slot)) {
      if (categories.includes(category)) {
        return slot
      }
    }
  }

  private clearDelayedTasks() {
    this.delayedTasks.forEach(fn => TaskManager.remove(fn))
    this.delayedTasks = []
  }
}