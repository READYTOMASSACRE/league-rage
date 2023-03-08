import { types } from "../../league-core/client";

export default class PlayerService {
  getState(player?: PlayerMp): types.tdm.State | undefined {
    player = player || this.local

    if (mp.players.exists(player)) {
      return player.getVariable('state')
    }
  }

  getTeam(player?: PlayerMp): types.tdm.Team | undefined {
    player = player || this.local
    
    if (mp.players.exists(player)) {
      return this.local.getVariable('team')
    }
  }

  sameTeam(player: PlayerMp): boolean {
    return this.getTeam() === this.getTeam(player)
  }

  get alive(): boolean {
    return this.local.getVariable('state') === types.tdm.State.alive
  }

  setPosition(vector: Vector3) {
    this.local.position = vector
  }

  getPosition() {
    return this.local.position
  }

  setInvicible(toggle: boolean) {
    this.local.setInvincible(toggle)
  }

  freezePosition(toggle: boolean) {
    this.local.freezePosition(toggle)
  }

  setAlpha(alphaLevel: number) {
    this.local.setAlpha(alphaLevel)
  }

  get local() {
    return mp.players.local
  }
}