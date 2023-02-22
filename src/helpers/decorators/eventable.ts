import 'reflect-metadata'

// todo update rage-decorators library

export const eventable = <T extends ctor>(target: T) => {
  return class extends target {
    constructor(...args: any[]) {
      super(...args)

      if (!Reflect.getMetadata(Decorator.Enum.eventsInit, target.prototype)) {
        const list: Decorator.Event[] = Reflect.getMetadata(Decorator.Enum.events, target) || []

        for (const { events, method } of list) {
          const callback = target.prototype[method]

          if (typeof callback !== 'function') {
            throw new Error('Invalid type of target method ' + typeof callback)
          }

          events.forEach(eventName => mp.events.add(eventName, callback.bind(target)))
        }

        Reflect.defineMetadata(Decorator.Enum.eventsInit, true, target.prototype)
      }
    }
  }
}
