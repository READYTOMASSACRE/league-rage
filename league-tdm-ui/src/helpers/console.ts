import { decorate, throttle } from "../../../league-core/src/helpers"

const message = (type: string = 'logInfo') => (...args: any[]) => args.map(arg => mp.console[type](String(decorate(arg))))

const throttleMs = 1000
export const throttledConsole = {
  log: throttle(message('logInfo'), throttleMs),
  error: throttle(message('logError'), throttleMs),
  warning: throttle(message('logWarning'), throttleMs),
  fatal: throttle(message('logFatal'), throttleMs),
}

export default {
  log: message('logInfo'),
  error: message('logError'),
  warning: message('logWarning'),
  fatal: message('logFatal'),
}