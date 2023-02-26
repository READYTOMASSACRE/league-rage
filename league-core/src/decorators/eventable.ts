// todo update rage-decorators library

export const eventable = <T extends Core.ctor>(target: T): T => {
  return class extends target {
    constructor(...args: any[]) {
      super(...args)

      if (!Reflect.getMetadata(Core.Decorator.eventsInit, target.prototype)) {
        const list: Core.Event[] = Reflect.getMetadata(Core.Decorator.events, target.prototype) || []

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

        Reflect.defineMetadata(Core.Decorator.eventsInit, true, target.prototype)
      }
    }
  }
}
