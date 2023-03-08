import { ui } from "../../../league-core/src/types"
import Hud from "./Hud"

interface RoundStart extends ui.RoundStartConfig {}

class RoundStart extends Hud implements ui.RoundStartConfig {
  static cameraName: string = 'roundStart'

  private camera = mp.cameras.new(RoundStart.cameraName)
  private vector = new mp.Vector3(0, 0, 0)

  constructor(config: ui.RoundStartConfig) {
    super(config)
    Object.assign(this, config)
  }

  draw(code: string, vector: Vector3) {
    this.setCamera(true, vector)
    this.textElement.text = `Arena ${code} is starting`

    return super.draw()
  }

  destroy(err?: Error): void {
    this.setCamera(false)

    return super.destroy(err)
  }

  render() {
    this.moveCamera()

    mp.game.graphics.drawText(
      this.textElement.text,
      this.textElement.position,
      this.textElement.style
    )
  }

  private moveCamera() {
    const {x, y, z} = this.vector

    const rad = this.angle.current * Math.PI / 180
    const offsetX = this.radius.current * Math.cos(rad)
    const offsetY = this.radius.current * Math.sin(rad)

    this.angle.current += this.angle.step

    if (!this.radius.max || this.radius.max > this.radius.current) {
      this.radius.current += this.radius.step
    }

    if (!this.zOffset.max || this.zOffset.max > this.zOffset.current) {
      this.zOffset.current += this.zOffset.step
    }

    this.camera.setCoord(x + offsetX, y + offsetY, z + this.zOffset.current)
  }

  private setCamera(toggle: boolean, vector?: Vector3) {
    if (vector) {
      this.vector = vector
    }

    if (toggle) {
      const array3d = this.vector.toArray()

      this.camera.pointAtCoord(...array3d)
      this.camera.setCoord(...array3d)
    }

    const ease = false
    const easeTime = 0

    this.camera.setActive(toggle)
    mp.game.cam.renderScriptCams(toggle, ease, easeTime, true, false, 0)
  }
}

export default RoundStart