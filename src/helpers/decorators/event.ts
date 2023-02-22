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
export const event = <T extends Function>(eventName: string | string[]): MethodDecorator => {
  const events = Array.isArray(eventName) ? eventName : [eventName]

  return function(target: T, method: string, descriptor: TypedPropertyDescriptor<any>) {
    if (typeof descriptor.value !== 'function') {
      throw new Error(`Event(s) ${events.join(', ')} must be callable`)
    }

    Reflect.defineMetadata(
      Decorator.Enum.events,
      [
        ...(Reflect.getMetadata(Decorator.Enum.events, target) || []),
        {events, method}
      ],
      target.prototype
    )

    return descriptor
  }
}