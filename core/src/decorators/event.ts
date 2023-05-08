import { Decorator, EventParams } from "../types"

/**
 * Decorator for adding events into RAGE API
 * 
 * @param {string | string[]} eventName - event(s) name, which will be added to mp.events.add
 * 
 * @example
 * decorator usage:
 * event("playerJoin")
 * event(["playerDeath", "playerQuit"])
 */
export const event = (eventName: string | string[], params: EventParams = {}): MethodDecorator => {
  const events = Array.isArray(eventName) ? eventName : [eventName]

  return function(target: Object, method: string, descriptor: TypedPropertyDescriptor<any>) {
    if (typeof descriptor.value !== 'function') {
      throw new Error(`Event(s) ${events.join(', ')} must be callable`)
    }

    Reflect.defineMetadata(
      Decorator.events,
      [
        ...(Reflect.getMetadata(Decorator.events, target) || []),
        { events, descriptor, method, ...params },
      ],
      target
    )

    return descriptor
  }
}