import { DamageConfig } from "../../../league-core/src/types/hud";
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
  public damage: number
  public distance: number

  constructor(config: DamageConfig, info: DamageInfo) {
    super(config)
    Object.assign(this, config)

    this.in = info.in
    this.weapon = info.weapon
    this.damage = info.damage
    this.distance = info.distance

    mp.game.audio.playSoundFrontend(-1, "TENNIS_MATCH_POINT", "HUD_AWARDS", true)
  }

  render() {
    try {
      mp.game.graphics.drawText(
        this.text,
        this.in ? [0.55, 0.55] : [0.55, 0.5],
        { ...this.textElement.style, color: this.in ? this.red : this.green})
    } catch (err) {
      this.destroy(err)
    }
  }

  get text() {
    return `${this.damage}hp / ${this.weapon} / ${this.distance}`
  }
}

export default Damage