import { event, eventable } from "../../league-core/client";
import { Events } from "../../league-core/src/types";
import { PlayerData, State, Team, WeaponState } from "../../league-core/src/types/tdm";

@eventable
export default class PlayerService {
  getState(player?: PlayerMp): State | undefined {
    player = player || this.local

    if (mp.players.exists(player)) {
      return this.getVariable(player, 'state')
    }
  }

  getTeam(player?: PlayerMp): Team | undefined {
    player = player || this.local
    
    if (mp.players.exists(player)) {
      return this.getVariable(player, 'team')
    }
  }

  sameTeam(player: PlayerMp): boolean {
    return this.getTeam() === this.getTeam(player)
  }

  get alive(): boolean {
    return this.getVariable(this.local, 'state') === State.alive
  }

  get select(): boolean {
    return this.getVariable(this.local, 'state') === State.select
  }

  get canSelectWeapon(): boolean {
    return this.getVariable(this.local, 'weaponState') === WeaponState.idle
  }

  setPosition(vector: Vector3, player?: PlayerMp) {
    (player || this.local).position = vector
  }

  setCoordsNoOffset(x: number, y: number, z: number, xAxis: boolean = false, yAxis: boolean = false, zAxis: boolean = false) {
    this.local.setCoordsNoOffset(x, y, z, xAxis, yAxis, zAxis)
  }

  getPosition(player?: PlayerMp) {
    return (player || this.local).position
  }

  getDimension(player?: PlayerMp) {
    return (player || this.local).dimension
  }

  setInvicible(toggle: boolean, player?: PlayerMp) {
    (player || this.local).setInvincible(toggle)
  }

  freezePosition(toggle: boolean, player?: PlayerMp) {
    (player || this.local).freezePosition(toggle)
  }

  setAlpha(alphaLevel: number, player?: PlayerMp) {
    (player || this.local).setAlpha(alphaLevel)
  }

  getVariable<_, K extends keyof PlayerData>(
    player: PlayerMp, key: K
  ): PlayerData[K] {
    return player.getVariable(String(key))
  }

  get local() {
    return mp.players.local
  }
}