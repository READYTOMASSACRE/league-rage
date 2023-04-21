// todo update rage-decorators library

import { env } from "../helpers"
import { ctor, Decorator, Enviroment, Proc } from "../types"

export const proceable = <T extends ctor>(target: T): T => {
  return class extends target {
    constructor(...args: any[]) {
      super(...args)

      if (!Reflect.getMetadata(Decorator.procsInit, target.prototype)) {
        const list: Proc[] = Reflect.getMetadata(Decorator.procs, target.prototype) || []

        for (const {procs, descriptor, method} of list) {
          const callback = descriptor.value

          if (typeof callback !== 'function') {
            throw new Error('Invalid type of target method ' + typeof callback)
          }

          procs.forEach(procName => {
            printProc({constructor: this.constructor.name, procName, method})
            mp.events.addProc(procName, (...args: any[]) => callback.apply(this, args))
          })
        }

        Reflect.defineMetadata(Decorator.procsInit, true, target.prototype)
      }
    }
  }
}

const printProc = ({constructor, procName, method}) => {
  if (env === Enviroment.client) {
    (mp as any).console.logInfo(`[PROCS::${procName}] ${constructor}.${method}::()`)
  } else {
    console.log(
      `[PROCS::${procName.cyan.underline}]`,
      constructor.green+'.'+method.magenta.underline+'::()'
    )
  }
}