// todo update rage-decorators library

import { env } from "../helpers"
import { ctor, Decorator, Enviroment, Event } from "../types"

export const eventable = <T extends ctor>(target: T): T => {
  return class extends target {
    constructor(...args: any[]) {
      super(...args)

      if (!Reflect.getMetadata(Decorator.eventsInit, target.prototype)) {
        const list: Event[] = Reflect.getMetadata(Decorator.events, target.prototype) || []

        for (const {events, descriptor, method} of list) {
          const callback = descriptor.value

          if (typeof callback !== 'function') {
            throw new Error('Invalid type of target method ' + typeof callback)
          }

          events.forEach(eventName => {
            printEvent({constructor: this.constructor.name, eventName, method})
            mp.events.add(eventName, (...args: any[]) => callback.apply(this, args))
          })
        }

        Reflect.defineMetadata(Decorator.eventsInit, true, target.prototype)
      }
    }
  }
}

const printEvent = ({constructor, eventName, method}) => {
  if (env === Enviroment.client) {
    (mp as any).console.logInfo(`[EVENTS::${eventName}] ${constructor}.${method}::()`)
  } else {
    console.log(
      `[EVENTS::${eventName.cyan.underline}]`,
      constructor.green+'.'+method.magenta.underline+'::()'
    )
  }
}