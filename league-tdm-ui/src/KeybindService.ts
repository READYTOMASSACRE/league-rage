import { keyPriority } from "./@types/common"
import console from "./helpers/console"

type Binding = {
  handler: Function
  stopPropagation: boolean
  priority: number
  component: string
}

type BindOpts = {
  stopPropagation?: boolean
  priority?: number
}

export default class KeybindService {
  public typing: boolean = false
  private bindings: Map<string, Binding[]> = new Map()

  /**
   * Binds the key
   *
   * @param keyCode Hexadecimal code of [key](https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731).
   * @param keyHold True triggers on keydown, false triggers on keyup (bool)
   * @param handler Function Handler
   */
  bind(
    keyCode: number | number[],
    keyHold: boolean | boolean[],
    component: string,
    handler: Function,
    { stopPropagation = false, priority = keyPriority.default }: BindOpts = {},
  ) {
    keyCode = Array.isArray(keyCode) ? keyCode : [keyCode]
    keyHold = Array.isArray(keyHold) ? keyHold : [keyHold]

    const oldHandler = handler
    const self = this

    handler = function () {
      if (self.typing) return
      return oldHandler.apply(this, arguments)
    }

    for (const code of keyCode) {
      for (const upOrDown of keyHold) {
        this.addBinding(code, upOrDown, {
          component: this.getComponentKey(component, upOrDown),
          handler,
          stopPropagation,
          priority,
        })
      }
    }
  }

  /**
   * Unbinds the key
   *
   * @param keyCode Hexadecimal code of [key](https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731).
   * @param keyHold True triggers on keydown, false triggers on keyup (bool)
   * @param handler Only unbind this function handler
   */
  unbind(keyCode: number | number[], keyHold: boolean | boolean[], component: string) {
    keyCode = Array.isArray(keyCode) ? keyCode : [keyCode]
    keyHold = Array.isArray(keyHold) ? keyHold : [keyHold]

    for (const code of keyCode) {
      for (const upOrDown of keyHold) {
        this.removeBinding(code, upOrDown, this.getComponentKey(component, upOrDown))
      }
    }
  }

  private getComponentKey(component: string, keyHold?: boolean) {
    return `${component}_${keyHold ? 'down' : 'up'}`
  }

  private handle(keyCode: number, keyHold: boolean) {
    const key = this.getHandleKey(keyCode, keyHold)
    const bindings = this.bindings.get(key) || []

    let iterate = 0

    for (const {handler, stopPropagation} of bindings) {
      try {
        const response = handler()

        if (response instanceof Promise) {
          response.catch(err => {
            console.error(err)
            this.bindings.set(key, bindings.filter((_,index) => index !== iterate))
          })
        }

        if (stopPropagation || response?.__stopPropagation) break
      } catch (err) {
        console.error(err)
        this.bindings.set(key, bindings.filter((_,index) => index !== iterate))
      }
      ++iterate
    }
  }

  private addBinding(keyCode: number, keyHold: boolean, binding: Binding) {
    const key = this.getHandleKey(keyCode, keyHold)
    const has = this.bindings.has(key)
    const bindings = this.bindings.get(key) || []

    if (bindings.find(item => item.component === binding.component)) {
      return
    }

    this.bindings.set(key, [...bindings, binding].sort((a, b) => b.priority - a.priority))

    if (!has) {
      mp.keys.unbind(keyCode, keyHold)
      mp.keys.bind(keyCode, keyHold, () => this.handle(keyCode, keyHold))
    }
  }

  private removeBinding(keyCode: number, keyHold: boolean, component: string) {
    const key = this.getHandleKey(keyCode, keyHold)
    const bindings = (this.bindings.get(key) || []).filter(item => item.component !== component)

    if (bindings.length) {
      this.bindings.set(key, bindings)
    } else {
      this.bindings.delete(key)
      mp.keys.unbind(keyCode, keyHold)
    }
  }

  private getHandleKey(keyCode: number, keyHold: boolean) {
    return `${keyCode}_${keyHold ? 'down' : 'up'}`
  }
}

export const key: Record<string, number> = {
  left: 0x25,
  up: 0x26,
  right: 0x27,
  down: 0x28,
  a: 0x41,
  b: 0x42,
  d: 0x44,
  s: 0x53,
  t: 0x54,
  w: 0x57,
  tab: 0x09,
  return: 0x0D,
  enter: 0x0D,
  vk_f2: 0x71,
  vk_f9: 0x78,
}