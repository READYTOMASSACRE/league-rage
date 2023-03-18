import { event, eventable, log, ensurePlayer } from "../../league-core";
import { Events, IConfig, tdm } from "../../league-core/src/types";
import { PlayerData } from "../../league-core/src/types/tdm";

@eventable
export default class PlayerService {
  constructor(readonly config: IConfig) {}

  @log
  @event("playerReady")
  playerReady(player: PlayerMp) {
    this.setState(player, tdm.State.idle)
    this.setTeam(player, tdm.Team.spectators)
    this.setWeaponState(player, tdm.WeaponState.idle)
    this.setWeaponSlot(player)
  }

  @log
  @ensurePlayer
  setHealth(p: number | PlayerMp, health: number) {
    const player = <PlayerMp>p

    health = health > 0 ? health : 0
    this.setVariable(player, 'health', health)
    this.setVariable(player, 'alive', health > 0)

    player.health = health
  }

  @ensurePlayer
  getHealth(p: number | PlayerMp) {
    return this.getVariable(<PlayerMp>p, 'health')
  }

  @ensurePlayer
  isAlive(p: number | PlayerMp) {
    return this.getVariable(<PlayerMp>p, 'alive')
  }

  @log
  @ensurePlayer
  setDimension(p: number | PlayerMp, dimension: number) {
    (p as PlayerMp).dimension = dimension
  }

  @ensurePlayer
  getTeam(p: number | PlayerMp): tdm.Team {
    return this.getVariable(<PlayerMp>p, 'team')
  }

  @log
  @ensurePlayer
  setTeam(p: number | PlayerMp, id: tdm.Team) {
    const player = <PlayerMp>p

    this.setVariable(player, 'team', id)
    mp.players.call(Events["tdm.player.team"], [player.id, id])
  }

  @log
  @ensurePlayer
  spawn(p: number | PlayerMp, vector: IVector3) {
    (p as PlayerMp).spawn(new mp.Vector3(vector))
  }

  @log
  @ensurePlayer
  getState(p: number | PlayerMp) {
    return this.getVariable(<PlayerMp>p, 'state')
  }

  getWithState(state: tdm.State): PlayerMp[] {
    const players: PlayerMp[] = []

    mp.players.forEachFast(player => {
      if (this.hasState(player, state) && mp.players.exists(player)) {
        players.push(player)
      }
    })

    return players
  }

  @log
  @ensurePlayer
  setState(p: number | PlayerMp, state: tdm.State) {
    const player = <PlayerMp>p

    this.setVariable(player, 'state', state)
    mp.players.call(Events["tdm.player.state"], [player.id, state])
  }

  @log
  @ensurePlayer
  hasState(p: number | PlayerMp, state: tdm.State | tdm.State[]) {
    return Array.isArray(state) ?
      state.includes(this.getState(p)) :
      this.getState(p) === state
  }

  @log
  @ensurePlayer
  spawnLobby(p: number | PlayerMp) {
    (p as PlayerMp).spawn(new mp.Vector3(this.config.lobby))
  }

  @log
  @ensurePlayer
  setWeaponState(p: number | PlayerMp, state: tdm.WeaponState) {
    const player = <PlayerMp>p

    this.setVariable(player, 'weaponState', state)
    mp.players.call(Events["tdm.player.weapon_state"], [player.id, state])
  }

  @log
  @ensurePlayer
  setWeaponSlot(p: number | PlayerMp, slot?: string, weapon?: string, ammo?: number) {
    const player = <PlayerMp>p

    if (!slot) {
      this.setVariable(player, 'weaponSlot', {})
    } else {
      this.setVariable(player, 'weaponSlot', {
        ...this.getVariable(player, 'weaponSlot'),
        [slot]: weapon,
      })
    }

    if (weapon) {
      weapon = `weapon_${weapon.replace(/^weapon_/, '')}`

      player.giveWeapon(mp.joaat(weapon), Number(ammo) || 0)
      mp.players.call(Events["tdm.player.weapon_slot"], [player.id, slot, weapon])
    }
  }

  @log
  @ensurePlayer
  getWeaponSlot(p: number | PlayerMp, slot?: string) {
    return slot ?
      this.getVariable(<PlayerMp>p, 'weaponSlot')?.[slot] :
      this.getVariable(<PlayerMp>p, 'weaponSlot')
  }

  @log
  @ensurePlayer
  getWeaponState(p: number | PlayerMp): tdm.WeaponState {
    return this.getVariable(<PlayerMp>p, 'weaponState')
  }

  @log
  @ensurePlayer
  hasWeaponState(p: number | PlayerMp, state: tdm.WeaponState) {
    return this.getWeaponState(p) === state
  }

  @log
  getByIdOrName(id: string | number): PlayerMp | PlayerMp[] | undefined {
    if (mp.players.exists(Number(id))) {
      return mp.players.at(Number(id))
    }

    const [p, ...other] = mp.players.toArray().filter(player => player.name.match(String(id)))

    if (other.length) {
      return [p, ...other]
    }

    return p
  }

  @log
  getById(id: number): PlayerMp | undefined {
    if (mp.players.exists(Number(id))) {
      return mp.players.at(Number(id))
    }
  }

  @log
  @ensurePlayer
  setModel(p: number | PlayerMp, model: number) {
    const player = <PlayerMp>p

    player.model = model

    mp.players.call(Events["tdm.player.model"], [player.id, model])
  }

  @ensurePlayer
  getSpectateId(p: number | PlayerMp) {
    return this.getVariable(<PlayerMp>p, 'spectate')
  }

  setVariable<_, K extends keyof PlayerData, V extends PlayerData[K]>(
    player: PlayerMp, key: K, value: V
  ) {
    player.setVariable(String(key), value)
  }

  getVariable<_, K extends keyof PlayerData>(
    player: PlayerMp, key: K
  ): PlayerData[K] {
    return player.getVariable(String(key))
  }

  call(players: number[], eventName: string, ...args: any[]) {
    players
      .map(player => mp.players.at(player))
      .filter(player => mp.players.exists(player))
      .forEach(player => player.call(eventName, [...args]))
  }
}