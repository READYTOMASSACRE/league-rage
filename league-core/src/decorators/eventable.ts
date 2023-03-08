// todo update rage-decorators library

import { env } from "../helpers"
import { ctor, Decorator, Enviroment, Event, Events } from "../types"

const serverOnly: string[] = [
  Events["tdm.start"],
  Events["tdm.vote"],
  Events["tdm.vote.start"],
  Events["tdm.vote.end"],
  Events["tdm.round.prepare"],
  Events["tdm.round.add"],
  Events["tdm.round.remove"],
  Events["tdm.round.pause"],
]

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
            mp.events.add(eventName, (...args: any[]) => {
              const [player] = args
              if (
                Enviroment.server &&
                serverOnly.includes(eventName) &&
                typeof player === 'object' &&
                mp.players.exists(player)
              ) {
                console.warn(`Player ${player.name}:${player.id} is trying call server event ${eventName}, avoid`)
                return
              }

              return callback.apply(this, args)
            })
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