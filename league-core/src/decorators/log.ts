import 'colors'
import {format} from 'date-fns'
import { decorate } from '../helpers'

export const log = function (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
  const child = descriptor.value
  descriptor.value = function (...args: any[]) {
    const now = Date.now()

    console.log(
      format(now, 'HH:mm:ss').green + ' [CALL] '.cyan +
      target.constructor.name.green + '.' + key.underline.magenta +
      `::(${args.map(decorate).join(', ').yellow})`
    )

    const response = child.apply(this, arguments)

    if (response instanceof Promise) {
      const later = Date.now()

      response.then(value => {
        console.log(
          format(later, 'HH:mm:ss').green + '   --> [ASYNC DONE] '.magenta +
          target.constructor.name.green + '.' + key.underline.magenta +
          `->(${decorate(value)})`.blue + 
          ` ${later - now} ms`
        )

        return value
      })
    } else {
      const later = Date.now()
      console.log(
        format(later, 'HH:mm:ss').green + '   --> [DONE] '.magenta +
        target.constructor.name.green + '.' + key.underline.magenta +
        `->(${decorate(response)})`.blue +
        ` ${later - now} ms`
      )
    }

    return response
  }

  return descriptor
}