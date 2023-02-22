import { ensurePlayer } from "../../helpers/decorators/ensurePlayer";

export default class PlayerService {
  @ensurePlayer
  setHealth(p: number | PlayerMp, health: number) {
    (p as PlayerMp).health = health
  }

  @ensurePlayer
  getHealth(p: number | PlayerMp) {
    return (p as PlayerMp).health
  }

  @ensurePlayer
  setDimension(p: number | PlayerMp, dimension: number) {
    (p as PlayerMp).dimension = dimension
  }

  @ensurePlayer
  getTeam(p: number | PlayerMp) {
    return (p as PlayerMp).data.teamId
  }

  @ensurePlayer
  spawn(p: number | PlayerMp, vector: number) {
    (p as PlayerMp).spawn(new mp.Vector3(vector, vector, vector))
  }

  @ensurePlayer
  setState(p: number | PlayerMp, state: string) {
    (p as PlayerMp).data.state = state
  }

  @ensurePlayer
  spawnLobby(p: number | PlayerMp) {
    (p as PlayerMp).spawn(new mp.Vector3(0, 0, 0))
  }

  call(eventName: string, players: number[] | PlayerMp[], args: any[]) {
    for (const id of players) {
      const player = typeof id === 'number' ? mp.players.at(id) : id

      if (mp.players.exists(player)) {
        player.call(eventName, args)
      }
    }
  }
}