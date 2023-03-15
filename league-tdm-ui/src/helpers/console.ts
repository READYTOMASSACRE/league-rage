import { decorate } from "../../../league-core/src/helpers"

const message = (type: string = 'logInfo') => (...args: any[]) => args.map(arg => mp.console[type](String(decorate(arg))))

export default {
  log: message('logInfo'),
  error: message('logError'),
  warning: message('logWarning'),
  fatal: message('logFatal'),
}