import { BroadCastError, catchError, event, eventable } from "../../../core";
import { IDummyService } from "../../../core/src/server/DummyService";
import { Events, tdm, weapon } from "../../../core/src/types";
import { Entity, RoundState, State, WeaponState } from "../../../core/src/types/tdm";
import { Category } from "../../../core/src/types/weapon";
import { ILanguage, Lang } from "../../../lang/language";
import PlayerService from "./PlayerService";
import TaskManager, { Task } from "./TaskManager";
import ErrorNotifyHandler from "./error/ErrorNotifyHandler";

@eventable
export default class WeaponService {
  private delayedTasks: Task[] = []

  constructor(
    readonly config: weapon.Config,
    readonly playerService: PlayerService,
    readonly dummyService: IDummyService,
    readonly lang: ILanguage,
  ) {}

  onRoundPrepare(players: number[]) {
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

  onRoundEnd() {
    this.clearDelayedTasks()
    mp.players.forEachFast((p) => {
      p.removeAllWeapons()
      this.playerService.setWeaponSlot(p)
      this.playerService.setWeaponState(p, tdm.WeaponState.has)
    })
  }

  onRoundAdd(id: number, manual?: boolean) {
    if (manual) {
      this.playerService.setWeaponSlot(id)
      this.playerService.setWeaponState(id, tdm.WeaponState.idle)

      this.delayedTasks.push(
        TaskManager.add(() => {
          if (!this || !mp.players.exists(id)) return
  
          this.playerService.setWeaponState(id, WeaponState.has)
        }, this.config.selectTime)
      )
    }
  }

  onRoundRemove(id: number) {
    this.playerService.setWeaponSlot(id)
    this.playerService.setWeaponState(id, tdm.WeaponState.idle)
  }

  @catchError(ErrorNotifyHandler)
  @event(Events["tdm.weapon.submit"])
  weaponRequest(player: PlayerMp, weapon?: string) {
    if (!weapon) {
      throw new BroadCastError(Lang["error.weapon.weapon_not_found"], player)
    }

    const slot = this.validateRequest(player, weapon)

    this.playerService.setWeaponSlot(player, slot, weapon, this.config.ammo)
  }

  @event(Events["tdm.player.incoming_damage"])
  weaponDamage(player: PlayerMp, sourcePlayer?: number, weapon?: string, hit?: number, damage?: number) {
    const source = mp.players.at(sourcePlayer)

    if (!mp.players.exists(source)) {
      return false
    }

    if (
      !this.config.friendlyfire &&
      this.playerService.getTeam(player) === this.playerService.getTeam(source) &&
      this.playerService.inRound(player)
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

      if (newHealth <= 0) {
        mp.events.call(Events["tdm.player.kill"], player.id, source.id, weapon)
        mp.players.call(Events["tdm.player.kill"], [player.id, source.id, weapon])
      }
  
      return [player.id, source.id, weapon, damage, newHealth, player.getVariable('health')]
    }
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

  private validateRequest(player: PlayerMp, weapon: string) {
    if (!mp.players.exists(player)) {
      throw new Error(this.lang.get(Lang["error.player.not_found"], { player: player?.id }))
    }

    if (!weapon) {
      throw new BroadCastError(Lang["error.weapon.weapon_not_found"], player)
    }

    const state = this.dummyService.get(Entity.ROUND, 'state')

    if (state !== RoundState.running) {
      throw new BroadCastError(Lang["tdm.round.is_not_running"], player)
    }

    if (this.playerService.getTeam(player) === tdm.Team.spectators) {
      throw new BroadCastError(Lang["error.weapon.is_busy"], player)
    }

    if (!this.playerService.inRound(player)) {
      throw new BroadCastError(Lang["error.weapon.is_busy"], player)
    }

    if (!this.playerService.hasWeaponState(player, tdm.WeaponState.idle)) {
      throw new BroadCastError(Lang["error.weapon.is_busy"], player)
    }

    const category = this.getCategory(weapon)

    if (!category) {
      throw new BroadCastError(Lang["error.weapon.category_not_found"], player, { name: weapon })
    }

    const slot = this.getSlotByCategory(category)

    if (!slot) {
      throw new BroadCastError(Lang["error.weapon.slot_not_found"], player, { category })
    }

    const oldWeapon = this.playerService.getWeaponSlot(player, slot)

    if (oldWeapon) {
      throw new BroadCastError(Lang["error.weapon.slot_is_busy"], player, {
        slot, weapon: typeof oldWeapon === 'string' ? oldWeapon : ''
      })
    }

    return slot
  }

  private clearDelayedTasks() {
    this.delayedTasks.forEach(fn => TaskManager.remove(fn))
    this.delayedTasks = []
  }
}