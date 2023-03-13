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

  @event(Events["tdm.player.model"])
  playerSetModel(id: number, model: number) {
    if (this.local.remoteId === id) {
      return
    }

    const player = mp.players.atRemoteId(id)

    if (!mp.players.exists(player)) {
      return
    }

    // player.model = model
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