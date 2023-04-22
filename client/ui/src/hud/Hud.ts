import { toMs } from "../../../../core/src/helpers"
import { IHud } from "../../../../core/src/types/hud"

abstract class Hud implements IHud {
  public alive: number
  public avoidRender?: boolean

  private callback: () => void
  private timeout: number
  private destroyed: boolean = false
  private rendered: boolean = false

  abstract render(...args: any[]): void

  constructor({ alive, avoidRender = false }: IHud) {
    this.alive = alive
    this.avoidRender = avoidRender
    this.callback = (...args: any[]) => {
      try {
        this.render(...args)
      } catch (err) {
        this.destroy(err)
      }
    }

    if (this.avoidRender) this.draw()
  }

  draw(..._: any[]) {
    if (this.destroyed) {
      mp.console.logError(`${this.constructor.name} is destroyed`)
      return
    }

    if (this.rendered) {
      mp.console.logError(`${this.constructor.name} is already rendered`)
      return
    }

    if (this.alive > 0) {
      this.timeout = setTimeout(() => this.destroy(), toMs(this.alive))
    }

    if (!this.avoidRender) {
      mp.events.add('render', this.callback)
    }

    this.rendered = true
  }

  destroy(err?: Error) {
    if (this.destroyed) {
      return
    }

    mp.events.remove('render', this.callback)
    clearTimeout(this.timeout)
    this.destroyed = true

    if (err) {
      mp.console.logError(err.stack)
    }
  }

  refreshAlive(alive?: number) {
    if (this.destroyed) {
      return
    }

    this.alive = typeof alive !== 'undefined' ? alive: this.alive
    clearTimeout(this.timeout)

    if (this.alive > 0) {
      this.timeout = setTimeout(() => this.destroy(), toMs(this.alive))
    }
  }

  get isDestroyed() {
    return this.destroyed
  }
}

export default Hud