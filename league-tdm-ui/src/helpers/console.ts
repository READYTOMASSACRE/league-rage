import { decorate, throttle } from "../../../league-core/src/helpers"
import { Events } from "../../../league-core/src/types"

const console = new class {
  private queue: string[] = []
  private ready: boolean = false

  constructor() {
    this.log = this.log.bind(this)
    this.error = this.error.bind(this)
    this.warning = this.warning.bind(this)
    this.fatal = this.fatal.bind(this)

    mp.events.add(Events["tdm.ui.ready"], () => {
      this.ready = true
      this.message(this.queue)
      this.queue = []
    })
  }

  log(...args: any[]) {
    return this.message(args, 'log')
  }

  error(...args: any[]) {
    return this.message(args, 'error')
  }

  warning(...args: any[]) {
    return this.message(args, 'warning')
  }

  fatal(...args: any[]) {
    return this.message(args, 'fatal')
  }

  private message(args: any[], type: 'log' | 'error' | 'warning' | 'fatal' = 'log') {
    try {
      args = args.map(decorate)
      if (this.ready) {
        mp.events.call(Events["tdm.cef.debug"], args, type)
      } else {
        this.queue.push(...args)
      }
    } catch (err) {
      mp.events.call(Events["tdm.cef.debug"], [decorate(err.stack)], 'error')
    }
  }
}

const throttleMs = 1000
const throttledConsole = {
  log: throttle((...args: any[]) => console.log(...args), throttleMs),
  error: throttle((...args: any[]) => console.error(...args), throttleMs),
  warning: throttle((...args: any[]) => console.warning(...args), throttleMs),
  fatal: throttle((...args: any[]) => console.fatal(...args), throttleMs),
}

mp.console.log = console.log
mp.console.error = console.error
mp.console.warning = console.warning
mp.console.fatal = console.fatal

export default console
export { throttledConsole }
