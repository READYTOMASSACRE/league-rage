import { ctor } from '../../types'
import { Decorator, Event } from '../../types/decorator'

// todo update rage-decorators library

export const eventable = <T extends ctor>(target: T) => {
  return class extends target {
    constructor(...args: any[]) {
      super(...args)

      if (!Reflect.getMetadata(Decorator.eventsInit, target.prototype)) {
        const list: Event[] = Reflect.getMetadata(Decorator.events, target) || []

        for (const { events, callback } of list) {
          if (typeof callback !== 'function') {
            throw new Error('Invalid type of target method ' + typeof callback)
          }

          events.forEach(eventName => mp.events.add(eventName, callback))
        }

        Reflect.defineMetadata(Decorator.eventsInit, true, target.prototype)
      }
    }
  }
}
