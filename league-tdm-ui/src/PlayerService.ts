import { Events, Procs } from "../../league-core/src/types";
import { PlayerData, State, Team, WeaponState } from "../../league-core/src/types/tdm";
import console from "./helpers/console";
import { toPlayerStat, toProfile } from '../../league-core/src/helpers/toStatistic';

export default class PlayerService {
  private interval: number = 0
  private syncMs: number = 500

  constructor() {
    this.interval = setInterval(() => this.syncHealth(), this.syncMs)
  }

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

  async getPositionProc(player: PlayerMp): Promise<[number, number, number, number]> {
    const position = await mp.events.callRemoteProc(Procs["tdm.spectate.get"], player.remoteId)
    return position ? position : [0, 0, 0, 0]
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

  spawnLobby() {
    mp.events.callRemote(Events["tdm.player.spawn_lobby"])
  }

  getStatistic(player?: PlayerMp) {
    player = player || this.local
    let statistic = this.getVariable(player, 'statistic')

    if (typeof statistic === 'string') {
      try {
        statistic = JSON.parse(statistic)
      } catch (err) {
        console.error(err)
      }
    }

    return toPlayerStat(statistic)
  }

  getProfile(player?: PlayerMp) {
    player = player || this.local
    let profile = this.getVariable(player, 'profile')

    if (typeof profile === 'string') {
      try {
        profile = JSON.parse(profile)
      } catch (err) {
        console.error(err)
      }
    }

    return toProfile(profile)
  }

  setVariable<K extends keyof PlayerData, V extends PlayerData[K]>(
    key: K, value: V
  ) {
    this.local.setVariable(String(key), value)
  }

  getVariable<_, K extends keyof PlayerData>(
    player: PlayerMp, key: K
  ): PlayerData[K] {
    return player.getVariable(String(key))
  }

  get local() {
    return mp.players.local
  }

  private syncHealth() {
    if (
      typeof this.getVariable(this.local, 'health') !== 'number' ||
      this.getVariable(this.local, 'health') > (this.local.getHealth() + 1)
    ) {
      mp.events.callRemote(Events["tdm.player.sync_health"])
    }
  }
}