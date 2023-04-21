import { Catcher } from "../types"

export const catchError = (errorHandler: Catcher) => {
  return function (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    const child = descriptor.value
    descriptor.value = function (...args: any[]) {
      try {
        const response = child.apply(this, arguments)

        if (response instanceof Promise) {
          response.catch(errorHandler.catch)
        }
    
        return response
      } catch (err) {
        errorHandler.catch(err)
      }
    }

    return descriptor
  }
}