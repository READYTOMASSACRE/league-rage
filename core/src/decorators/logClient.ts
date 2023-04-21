import {format} from 'date-fns'
import { decorate } from '../helpers'

export const logClient = function (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
  const child = descriptor.value
  descriptor.value = function (...args: any[]) {
    const now = Date.now()

    print(
      format(now, 'HH:mm:ss') + ' [CALL] ' +
      target.constructor.name + '.' + key +
      `::(${args.map(decorate).join(', ')})`
    )

    const response = child.apply(this, arguments)

    if (response instanceof Promise) {
      const later = Date.now()

      response.then(value => {
        print(
          format(later, 'HH:mm:ss') + '----> [ASYNC DONE] ' +
          `${target.constructor.name}.${key}` +
          `->(${decorate(value)})` + 
          ` ${later - now} ms`
        )

        return value
      })
    } else {
      const later = Date.now()
      print(
        format(later, 'HH:mm:ss') + '----> [DONE] ' +
        `${target.constructor.name}.${key}` +
        `-> (${decorate(response)})` +
        ` ${later - now} ms`
      )
    }

    return response
  }

  return descriptor
}

const print = (input: string) => {
  const log = typeof (mp as any).console.log === 'function' ? (mp as any).console.log : mp.console.logInfo
  return log(input)
}