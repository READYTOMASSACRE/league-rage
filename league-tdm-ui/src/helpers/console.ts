import { decorate } from "../../../league-core/src/helpers"

const message = (type: string = 'logInfo') => (...args: any[]) => args.map(arg => mp.console[type](decorate(arg)))

export default {
  log: message('logInfo'),
  error: message('logFatal'),
  warning: message('logWarning'),
  fatal: message('logFatal'),
}