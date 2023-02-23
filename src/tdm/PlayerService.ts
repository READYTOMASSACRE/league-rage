import { ensurePlayer } from "../helpers/decorators/ensurePlayer";
import { log } from "../helpers/decorators/log";

export default class PlayerService {
  @log
  @ensurePlayer
  setHealth(p: number | PlayerMp, health: number) {
    (p as PlayerMp).health = health
  }

  @log
  @ensurePlayer
  getHealth(p: number | PlayerMp) {
    return (p as PlayerMp).health
  }

  @log
  @ensurePlayer
  setDimension(p: number | PlayerMp, dimension: number) {
    (p as PlayerMp).dimension = dimension
  }

  @log
  @ensurePlayer
  getTeam(p: number | PlayerMp) {
    return (p as PlayerMp).data.teamId
  }

  @log
  @ensurePlayer
  spawn(p: number | PlayerMp, vector: Vector3Mp) {
    (p as PlayerMp).spawn(vector)
  }

  @log
  @ensurePlayer
  setState(p: number | PlayerMp, state: string) {
    (p as PlayerMp).data.state = state
  }

  @log
  @ensurePlayer
  spawnLobby(p: number | PlayerMp) {
    (p as PlayerMp).spawn(new mp.Vector3(0, 0, 0))
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
}