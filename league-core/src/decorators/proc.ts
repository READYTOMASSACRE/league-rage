import { Decorator } from "../types"

/**
 * Decorator for adding procs into RAGE API
 * 
 * @param {string | string[]} procName - event(s) name, which will be added to mp.events.add
 * 
 * @example
 * decorator usage:
 * proc("playerJoin")
 * proc(["playerDeath", "playerQuit"])
 */
export const proc = (procName: string | string[]): MethodDecorator => {
  const procs = Array.isArray(procName) ? procName : [procName]

  return function(target: Object, method: string, descriptor: TypedPropertyDescriptor<any>) {
    if (typeof descriptor.value !== 'function') {
      throw new Error(`Proc(s) ${procs.join(', ')} must be callable`)
    }

    Reflect.defineMetadata(
      Decorator.procs,
      [
        ...(Reflect.getMetadata(Decorator.procs, target) || []),
        {procs, descriptor, method}
      ],
      target
    )

    return descriptor
  }
}