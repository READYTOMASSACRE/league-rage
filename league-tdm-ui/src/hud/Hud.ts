import { logClient } from "../../../league-core/client"
import { toMs } from "../../../league-core/src/helpers"
import { IHud } from "../../../league-core/src/types/hud"

abstract class Hud implements IHud {
  public alive: number
  private callback: () => void
  private timeout: number
  private destroyed: boolean = false
  private rendered: boolean = false

  abstract render(): void

  constructor({ alive }: IHud) {
    this.alive = alive
    this.callback = () => {
      try {
        this.render()
      } catch (err) {
        this.destroy(err)
      }
    }
  }

  @logClient
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

    mp.events.add('render', this.callback)
    this.rendered = true
  }

  @logClient
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
}

export default Hud