import { deepclone } from "../../../../core/src/helpers";
import { Events } from "../../../../core/src/types";
import { DamageConfig } from "../../../../core/src/types/hud";
import Hud from "./Hud";

interface Damage extends DamageConfig {}

export interface DamageInfo {
  in: boolean
  weapon: string
  damage: number
  distance: number
}

class Damage extends Hud implements DamageConfig {
  readonly red: RGBA = [243, 84, 84, 255]
  readonly green: RGBA = [84, 243, 140, 255]

  public in: boolean
  public weapon: string
  public distance: number

  private _damage: number

  constructor(config: DamageConfig, info: DamageInfo) {
    super({ avoidRender: true, ...config })
    Object.assign(this, deepclone(config))

    this.in = info.in
    this.weapon = info.weapon
    this.damage = info.damage
    this.distance = info.distance
  }

  render() {
    this.destroy()
  }

  get text() {
    return `${this.damage}hp / ${this.weapon} / ${this.distance}`
  }

  get component() {
    return this.in ? 'damage_in' : 'damage_out'
  }

  get damage() {
    return this._damage
  }

  set damage(dmg: number) {
    this._damage = dmg
    
    mp.game.audio.playSoundFrontend(-1, "TENNIS_MATCH_POINT", "HUD_AWARDS", true)
    mp.events.call(Events["tdm.notify.text"], this.text, this.alive, this.component, this.component)
  }
}

export default Damage