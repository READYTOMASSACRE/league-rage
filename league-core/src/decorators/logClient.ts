import {format} from 'date-fns'
import { decorate } from '../helpers'

export const logClient = function (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
  const child = descriptor.value
  descriptor.value = function (...args: any[]) {
    const now = Date.now()

    mp.console.logInfo(
      format(now, 'HH:mm:ss') + ' [CALL] ' +
      target.constructor.name + '.' + key +
      `::(${args.map(decorate).join(', ')})`
    )

    const response = child.apply(this, arguments)

    if (response instanceof Promise) {
      const later = Date.now()

      response.then(value => {
        mp.console.logInfo(
          format(later, 'HH:mm:ss') + ' [ASYNC DONE] ' +
          `${target.constructor.name}.${key}` +
          `->(${decorate(value)})` + 
          ` ${later - now} ms`
        )

        return value
      })
    } else {
      const later = Date.now()
      mp.console.logInfo(
        format(later, 'HH:mm:ss') + ' [DONE] ' +
        `${target.constructor.name}.${key}` +
        `-> (${decorate(response)})` +
        ` ${later - now} ms`
      )
    }

    return response
  }

  return descriptor
}