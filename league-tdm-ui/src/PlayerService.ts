import { types } from "../../league-core/client";

export default class PlayerService {
  getState(player?: PlayerMp): types.tdm.State | undefined {
    player = player || mp.players.local

    if (mp.players.exists(player)) {
      return player.getVariable('state')
    }
  }

  getTeam(player?: PlayerMp): types.tdm.Team | undefined {
    player = player || mp.players.local
    
    if (mp.players.exists(player)) {
      return mp.players.local.getVariable('team')
    }
  }

  sameTeam(player: PlayerMp): boolean {
    return this.getTeam() === this.getTeam(player)
  }

  get alive(): boolean {
    return mp.players.local.getVariable('state') === types.tdm.State.alive
  }
}