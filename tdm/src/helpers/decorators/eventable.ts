import { ctor } from '../../types'
import { Decorator, Event } from '../../types/decorator'

// todo update rage-decorators library

export const eventable = <T extends ctor>(target: T) => {
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
            console.log(
              `[EVENTS::${eventName.cyan.underline}]`,
              this.constructor.name.green+'.'+method.magenta.underline+'::()'
            )
            mp.events.add(eventName, (...args: any[]) => callback.apply(this, args))
          })
        }

        Reflect.defineMetadata(Decorator.eventsInit, true, target.prototype)
      }
    }
  }
}
