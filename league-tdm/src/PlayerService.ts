import { event, eventable, log, ensurePlayer } from "../../league-core";
import { Events, IConfig, tdm } from "../../league-core/src/types";
import BroadCastError from "./error/BroadCastError";

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
    (p as PlayerMp).health = health
  }

  @ensurePlayer
  getHealth(p: number | PlayerMp) {
    return (p as PlayerMp).health
  }

  @log
  @ensurePlayer
  setDimension(p: number | PlayerMp, dimension: number) {
    (p as PlayerMp).dimension = dimension
  }

  @ensurePlayer
  getTeam(p: number | PlayerMp): tdm.Team {
    return (p as PlayerMp).getVariable('team')
  }

  @log
  @ensurePlayer
  setTeam(p: number | PlayerMp, id: tdm.Team) {
    const player = <PlayerMp>p

    player.setVariable('team', id)
    mp.players.call(Events["tdm.player.team"], [player.id, id])
  }

  @log
  @ensurePlayer
  spawn(p: number | PlayerMp, vector: IVector3) {
    (p as PlayerMp).spawn(new mp.Vector3(vector))
  }

  @log
  @ensurePlayer
  getState(p: number | PlayerMp): tdm.State {
    return (p as PlayerMp).getVariable('state')
  }

  @log
  @ensurePlayer
  setState(p: number | PlayerMp, state: tdm.State) {
    const player = <PlayerMp>p

    player.setVariable('state', state)
    mp.players.call(Events["tdm.player.state"], [player.id, state])
  }

  @log
  @ensurePlayer
  hasState(p: number | PlayerMp, state: tdm.State) {
    return this.getState(p) === state
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

    player.setVariable('weaponState', state)
    mp.players.call(Events["tdm.player.weapon_state"], [player.id, state])
  }

  @log
  @ensurePlayer
  setWeaponSlot(p: number | PlayerMp, slot?: string, weapon?: string, ammo?: number) {
    const player = <PlayerMp>p

    if (!slot) {
      player.setVariable('weaponSlot', {})  
    } else {
      player.setVariable('weaponSlot', {...player.getVariable('weaponSlot'), [slot]: weapon})
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
    const player = <PlayerMp>p

    return slot ?
      player.getVariable('weaponSlot')?.[slot] :
      player.getVariable('weaponSlot')
  }

  @log
  @ensurePlayer
  getWeaponState(p: number | PlayerMp): tdm.WeaponState {
    return (p as PlayerMp).getVariable('weaponState')
  }

  @log
  @ensurePlayer
  hasWeaponState(p: number | PlayerMp, state: tdm.WeaponState) {
    return this.getWeaponState(p) === state
  }

  @log
  getByIdOrName(id: string | number, player?: PlayerMp): PlayerMp | PlayerMp[] | undefined {
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
    (p as PlayerMp).model = model
  }
}