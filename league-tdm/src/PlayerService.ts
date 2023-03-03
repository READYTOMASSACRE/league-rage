import { event, eventable, log, ensurePlayer } from "../../league-core";
import { tdm } from "../../league-core/src/types";

@eventable
export default class PlayerService {
  @log
  @event(RageEnums.EventKey.PLAYER_READY)
  playerReady(player: PlayerMp) {
    this.setState(player, tdm.State.idle)
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
    (p as PlayerMp).setVariable('team', id)
  }

  @log
  @ensurePlayer
  spawn(p: number | PlayerMp, vector: Vector3Mp) {
    (p as PlayerMp).spawn(vector)
  }

  @log
  @ensurePlayer
  getState(p: number | PlayerMp): tdm.State {
    return (p as PlayerMp).getVariable('state')
  }

  @log
  @ensurePlayer
  setState(p: number | PlayerMp, state: tdm.State) {
    (p as PlayerMp).setVariable('state', state)
  }

  @log
  @ensurePlayer
  hasState(p: number | PlayerMp, state: tdm.State) {
    return this.getState(p) === state
  }

  @log
  @ensurePlayer
  spawnLobby(p: number | PlayerMp) {
    (p as PlayerMp).spawn(new mp.Vector3(0, 0, 0))
  }

  @log
  @ensurePlayer
  setWeaponState(p: number | PlayerMp, state: tdm.WeaponState) {
    (p as PlayerMp).setVariable('weaponState', state)
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
  call(eventName: string, players: number[] | PlayerMp[], args: any[]) {
    for (const id of players) {
      const player = typeof id === 'number' ? mp.players.at(id) : id

      if (mp.players.exists(player)) {
        player.call(eventName, args)
      }
    }
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
}